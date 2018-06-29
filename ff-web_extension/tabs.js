var prefs = {}

function firstUnpinnedTab(tabs) {
  for (var tab of tabs) {
    if (!tab.pinned) {
      return tab.index
    }
  }
}

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true})
}

function add_separator(content) {
  //console.log('adding separator: ', prefs.separator)
  if (!prefs.separator) {
    content += '\r\n'
  }
  else {
    content += prefs.separator
  }
  return content
}

function callOnActiveTab(callback) {
  getCurrentWindowTabs().then((tabs) => {
    for (var tab of tabs) {
      if (tab.active) {
	//console.log('Active Tab, calling callback', tab)
        callback(tab, tabs)
      }
    }
  })
}

function updatePosition() {
  callOnActiveTab((tab, tabs) => {
    var all_tabs
    browser.tabs.query({}).then((total_tabs) => {
      all_tabs = total_tabs.length;
      var index = tab.index + 1
      // document.querySelector('#total').innerHTML = 'Tab ' + index + ' of ' + tabs.length + ' (' + all_tabs + ' total)'
      document.querySelector('#total').innerHTML = ' - ' + all_tabs + ' total'
      document.querySelector('#position').value = index
      document.querySelector('#window_total').innerHTML = ' of ' + tabs.length
    })
  })
}
updatePosition()

// TODO:
// handle when enter is pressed to update the current tab's postion
// the update link works
// but this does not
// seems to be called though
document.addEventListener('submit', (e) => {
  //console.log('SUBMIT start!')
  getCurrentWindowTabs().then((tabs) => {
    // doesn't make it here...
    // is the interface window being closed when form is submitted?
    console.log('got current window tabs')
    for (var tab of tabs) {
      if (tab.active) {

	//console.log('Active Tab, calling callback', tab)
        console.log('inside callOnActiveTab')
        index = document.querySelector('#position').value - 1
        console.log('destination: ', index)
        browser.tabs.move([tab.id], {index})
        updatePosition()
      }
    }
  })
  
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
})


document.addEventListener('click', (e) => {
  if (e.target.id === 'tabs-move-beginning') {
    callOnActiveTab((tab, tabs) => {
      var index = 0
      if (!tab.pinned) {
        index = firstUnpinnedTab(tabs)
      }
      console.log(`moving ${tab.id} to ${index}`)
      browser.tabs.move([tab.id], {index})
      updatePosition()
    })
  }

  else if (e.target.id === 'update') {
    callOnActiveTab((tab, tabs) => {
      index = document.querySelector('#position').value - 1
      //console.log('destination: ', index)
      browser.tabs.move([tab.id], {index})
      updatePosition()
    })
  }

  else if (e.target.id === 'tabs-move-end') {
    callOnActiveTab((tab, tabs) => {
      var index = -1
      if (tab.pinned) {
        var lastPinnedTab = Math.max(0, firstUnpinnedTab(tabs) - 1)
        index = lastPinnedTab
      }
      browser.tabs.move([tab.id], {index})
      updatePosition()
    })
  }

  else if (e.target.id === 'tabs-copy') {
    getCurrentWindowTabs().then((tabs) => {
      var tab_list = ''
      for (var tab of tabs) {
	tab_list += tab.url
        tab_list = add_separator(tab_list)
	if (!prefs.noTitles) {
	  tab_list += tab.title || tab.id
	  //tab_list += '\n'
          tab_list = add_separator(tab_list)
	}
      }
      browser.runtime.sendMessage({'content': tab_list})
      
      /*
      // old way of sending message to the content script
      callOnActiveTab((tab, tabs) => {
	browser.tabs.sendMessage(tab.id, {'content': tab_list})
      })
      */
      //console.log(tab_list)
      document.querySelector('#message').innerHTML = 'Copied ' + tabs.length + ' tabs'
    })
    
  }
  
  else if (e.target.id === 'tabs-paste') {
    browser.runtime.sendMessage({'action': 'paste'})
    /*
    callOnActiveTab((tab, tabs) => {
      browser.tabs.sendMessage(tab.id, {'action': 'paste'})
    })
    */
  }

  else if (e.target.id === 'open-options') {
    console.log('Open Options called')
    browser.tabs.create( { 'url': 'options.html'} )
  }

  e.preventDefault()
})

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`)

  if(removeInfo.isWindowClosing) {
    // console.log(`Its window is also closing.`)
  } else {
    // console.log(`Its window is not closing`)
  }
})

//onMoved listener. fired when tab is moved into the same window
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  var startIndex = moveInfo.fromIndex
  var endIndex = moveInfo.toIndex
  // console.log(`Tab with id: ${tabId} moved from index: ${startIndex} to index: ${endIndex}`)
})

browser.runtime.onMessage.addListener(notify)

function notify(message) {
  browser.tabs.create({url: message.url})
}

function onError(error) {
  console.log(`Error: ${error}`)
}

function onGot(item) {
  //console.log('item: ', item)
  if (item.noTitles) {
    prefs.noTitles = item.noTitles
  }
  if (item.separator) {
    prefs.separator = item.separator
  }

  /*
  browser.tabs.executeScript({
    file: '/content_scripts/copy-paste.js'
  })
  */
}

var getting = browser.storage.local.get()
getting.then(onGot, onError)

