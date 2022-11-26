function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}

/**
 * Convert the incoming tab object provided by the mozilla extension api
 * to a tab list item
 *
 * @param {*} tab
 * @param {*} format
 *
 * [CAUTION]
 * We attempted to convert strings to template strings
 * using both "`" and eval which result in an error:
 * Content Security Policy: The page’s settings blocked the loading of a resource at eval (“script-src”).
 */
function convertTabToListItem(tab, format = "${tab.url}\r\n${tab.title}\r\n") {
  format = format.replaceAll("${tab.url}", tab.url);
  const tabListItem = format.replaceAll("${tab.title}", tab.title);
  return tabListItem;
}

function callOnActiveTab(callback) {
  getCurrentWindowTabs().then((tabs) => {
    for (var tab of tabs) {
      if (tab.active) {
        //console.log('Active Tab, calling callback', tab)
        callback(tab, tabs);
      }
    }
  });
}

function updatePosition() {
  callOnActiveTab((tab, tabs) => {
    var all_tabs;
    browser.tabs.query({}).then((total_tabs) => {
      all_tabs = total_tabs.length;
      var index = tab.index + 1;
      // document.querySelector('#total').innerHTML = 'Tab ' + index + ' of ' + tabs.length + ' (' + all_tabs + ' total)'
      document.querySelector("#total").innerHTML = " - " + all_tabs + " total";
      document.querySelector("#position").value = index;
      document.querySelector("#window_total").innerHTML = " of " + tabs.length;
    });
  });
}
updatePosition();

// TODO:
// handle when enter is pressed to update the current tab's postion
// the update link works
// but this does not
// seems to be called though
document.addEventListener("submit", (e) => {
  //console.log('SUBMIT start!')
  getCurrentWindowTabs().then((tabs) => {
    // doesn't make it here...
    // is the interface window being closed when form is submitted?
    // console.log("got current window tabs");
    for (var tab of tabs) {
      if (tab.active) {
        //console.log('Active Tab, calling callback', tab)
        // console.log("inside callOnActiveTab");
        index = document.querySelector("#position").value - 1;
        // console.log("destination: ", index);
        browser.tabs.move([tab.id], { index });
        updatePosition();
      }
    }
  });

  //try1
  /*
  callOnActiveTab((tab, tabs) => {
    console.log('inside callOnActiveTab')
    index = document.querySelector('#position').value - 1
    console.log('destination: ', index)
    browser.tabs.move([tab.id], {index})
    updatePosition()
  })
  */

  //console.log('SUBMIT end!')
});

document.addEventListener("click", (e) => {
  if (e.target.id === "tabs-move-beginning") {
    callOnActiveTab((tab, tabs) => {
      var index = 0;
      if (!tab.pinned) {
        index = firstUnpinnedTab(tabs);
      }
      // console.log(`moving ${tab.id} to ${index}`);
      browser.tabs.move([tab.id], { index });
      updatePosition();
    });
  } else if (e.target.id === "update") {
    callOnActiveTab((tab, tabs) => {
      index = document.querySelector("#position").value - 1;
      // console.log('destination: ', index)
      browser.tabs.move([tab.id], { index });
      updatePosition();
    });
  } else if (e.target.id === "tabs-move-end") {
    callOnActiveTab((tab, tabs) => {
      var index = -1;
      if (tab.pinned) {
        var lastPinnedTab = Math.max(0, firstUnpinnedTab(tabs) - 1);
        index = lastPinnedTab;
      }
      browser.tabs.move([tab.id], { index });
      updatePosition();
    });
  } else if (e.target.id === "tabs-copy") {
    copyTabs();
  } else if (e.target.id === "tabs-paste") {
    browser.runtime.sendMessage({ action: "paste" });
    /*
    callOnActiveTab((tab, tabs) => {
      browser.tabs.sendMessage(tab.id, {'action': 'paste'})
    })
    */
  } else if (e.target.id === "open-settings") {
    // console.log("Open Settings called");
    browser.tabs.create({ url: "settings.html" });
  }

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // console.log(`The tab with id: ${tabId}, is closing`);

  if (removeInfo.isWindowClosing) {
    // console.log(`Its window is also closing.`)
  } else {
    // console.log(`Its window is not closing`)
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  // console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`)
});

browser.runtime.onMessage.addListener(notify);

function notify(message) {
  browser.tabs.create({ url: message.url });
}

/**
 * Applies output format to every tab and copies resultant tab list to clipboard
 */
function copyTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabList = "";

    browser.storage.sync.get("outputFormat").then((res) => {
      const outputFormat = res.outputFormat;

      for (var tab of tabs) {
        tabList += convertTabToListItem(tab, outputFormat);
      }
      browser.runtime.sendMessage({ content: tabList });

      document.querySelector("#message").innerHTML =
        "Copied " + tabs.length + " tabs";
    });
  });
}
