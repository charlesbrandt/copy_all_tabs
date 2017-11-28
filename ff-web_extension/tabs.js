function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index;
    }
  }
}

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", (e) => {
  function callOnActiveTab(callback) {
    getCurrentWindowTabs().then((tabs) => {
      for (var tab of tabs) {
        if (tab.active) {
	  //console.log("Active Tab, calling callback", tab);
          callback(tab, tabs);
        }
      }
    });
  }

  if (e.target.id === "tabs-move-beginning") {
    callOnActiveTab((tab, tabs) => {
      var index = 0;
      if (!tab.pinned) {
        index = firstUnpinnedTab(tabs);
      }
      console.log(`moving ${tab.id} to ${index}`)
      browser.tabs.move([tab.id], {index});
    });
  }

  if (e.target.id === "tabs-move-end") {
    callOnActiveTab((tab, tabs) => {
      var index = -1;
      if (tab.pinned) {
        var lastPinnedTab = Math.max(0, firstUnpinnedTab(tabs) - 1);
        index = lastPinnedTab;
      }
      browser.tabs.move([tab.id], {index});
    });
  }

  if (e.target.id === "tabs-copy") {
    getCurrentWindowTabs().then((tabs) => {
      var tab_list = '';
      for (var tab of tabs) {
	tab_list += tab.url;
	tab_list += "\n";
	tab_list += tab.title || tab.id;
	tab_list += "\n";
      }
      callOnActiveTab((tab, tabs) => {
	browser.tabs.sendMessage(tab.id, {"content": tab_list});
      });
      //console.log(tab_list);
    });
    
  }
  
  else if (e.target.id === "tabs-paste") {
    callOnActiveTab((tab, tabs) => {
      browser.tabs.sendMessage(tab.id, {"action": "paste"});
    });
  }

  e.preventDefault();
});

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  var startIndex = moveInfo.fromIndex;
  var endIndex = moveInfo.toIndex;
  console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`);
});

browser.runtime.onMessage.addListener(notify);

function notify(message) {
  browser.tabs.create({url: message.url});
}

browser.tabs.executeScript({file: "/content_scripts/copy-paste.js"});
