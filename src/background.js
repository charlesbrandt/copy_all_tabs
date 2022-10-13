browser.browserAction.setIcon({ path: "icons/icon-bw.svg" });

function updateTabCount(tabId, isOnRemoved) {
  browser.storage.sync.get().then((res) => {
    let show = res.showBadge;
    if (show) {
      browser.tabs.query({}).then((tabs) => {
        let length = tabs.length;

        // onRemoved fires too early and the count is one too many.
        // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
        if (
          isOnRemoved &&
          tabId &&
          tabs
            .map((t) => {
              return t.id;
            })
            .includes(tabId)
        ) {
          length--;
        }

        browser.browserAction.setBadgeText({ text: length.toString() });
        browser.browserAction.setBadgeBackgroundColor({ color: "green" });
      });
    }
  });
}

browser.tabs.onRemoved.addListener((tabId) => {
  updateTabCount(tabId, true);
});
browser.tabs.onCreated.addListener((tabId) => {
  updateTabCount(tabId, false);
});
updateTabCount();

/**
 * Attempts to write data to the users clipboard.
 * @param  {string|object}  message  expects a string at 'content' attribute
 * @param  {natural}        time  Maximum runtime of this asynchronous operation after which it will be canceled and rejected.
 * @return {Promise}              Promise that rejects if the timeout or an error occurred. If it resolves the operation should have succeeded.

via:
https://discourse.mozilla.org/t/placing-a-variable-in-the-clipboard/15347/2
 */
function handleMessage(message, time) {
  //console.log("handleMessage called:", message);
  if (message.action == "paste") {
    //handle paste

    // these show up in the console for the background page console (debug)
    //console.log("made it here");
    //console.log(message.content);
    return new Promise(function (resolve, reject) {
      let done = false;
      function onPaste(event) {
        try {
          //console.log("onPaste called:", event);
          if (done) {
            return;
          }
          done = true;
          document.removeEventListener("paste", onPaste);
          //https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData
          const transfer = event.clipboardData;
          var contents = transfer.getData("text");

          function isUrlValid(string) {
            try {
              new URL(string);
              return true;
            } catch (typeError) {
              return false;
            }
          }

          var lines = contents.split(/\r?\n/);
          // go through each line and 1) look for urls 2) get rid of dupes
          var links = [];
          for (let line of lines) {
            if (isUrlValid(line)) {
              //sometimes the url and the title is the same...
              //don't want to open multiple instance of the same url
              //check for and ignore duplicates
              if (links.indexOf(line) == -1) {
                links.push(line);
              }
              // else {
              //   console.log("Skipping dupe:", line);
              // }
            }
            // else {
            //   console.log("DIDN't match", line);
            // }
          }

          for (let link of links) {
            // console.log("Opening new tab: ", link);

            // can't do this in a content script:
            //browser.tabs.create({url: link});
            //tabs.open(link);

            // send a message instead:
            browser.runtime.sendMessage({ url: link });
          }

          event.preventDefault();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        document.removeEventListener("paste", onPaste);
        reject(new Error("Timeout after " + (time || 1000) + "ms"));
      }, time || 1000);
      document.addEventListener("paste", onPaste);
      document.execCommand("paste", false, null);
    });
  } else {
    //handle copy
    return new Promise(function (resolve, reject) {
      let done = false;
      function onCopy(event) {
        try {
          if (done) {
            return;
          }
          done = true;
          document.removeEventListener("copy", onCopy);
          const transfer = event.clipboardData;
          transfer.clearData();
          transfer.setData("text/plain", message.content);
          event.preventDefault();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        document.removeEventListener("copy", onCopy);
        reject(new Error("Timeout after " + (time || 1000) + "ms"));
      }, time || 1000);
      document.addEventListener("copy", onCopy);
      document.execCommand("copy", false, null);
    });
  }
}

browser.runtime.onMessage.addListener(handleMessage);
