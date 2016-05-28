var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var clipboard = require("sdk/clipboard");
var windows = require("sdk/windows").browserWindows;
var { ActionButton } = require("sdk/ui/button/action");

function copy_tabs(selection) {
  var tab_text = '';
  var tab_list = [];
  
  var cur_pos = 0;
  var inserted = false;
  
  
  var active_window = windows.activeWindow;
  
  //alternative approach
  //var active_window = tabs.activeTab.window;
  
  //console.log(active_window);
  
  //rather than loop over all tabs, 
  //for (let tab of tabs) {
  
  //using the windows sdk:
  //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/windows#BrowserWindow
  //each window has a tabs property which should do the work for us
  for (let tab of active_window.tabs) {
    
    
    //console.log("Tab window: ", tab.window);
    //console.log("Active window: ", active_window);
    
    //TODO:
    //way to configure different output formats
    
    //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
    //this will print the tab data in the order that tabs were opened
    //usually it's more useful to print the tabs in the order
    //that they have been arranged currently (by index)
    //tab_text += tab.url + '\n';
    //tab_text += tab.title + '\n';

    cur_pos = 0;
    inserted = false;
    var cur_item;
    while ( (cur_pos < tab_list.length) && (inserted == false) ) {
      cur_item = tab_list[cur_pos];
      if (tab.index < cur_item.index) {
        //insert tab into cur_pos of tab_list
        tab_list.splice(cur_pos, 0, tab);
        inserted = true;
      }
      cur_pos += 1;
    }
    if (! inserted) {
      // add it to the end
      tab_list.splice(cur_pos, 0, tab)
    }
    
  }

  for (let tab of tab_list) {
    tab_text += tab.url + '\n';
    tab_text += tab.title + '\n';
  }    
  
  //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/clipboard
  clipboard.set(tab_text);
}

function paste_tabs(selection) {

  //http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
  //http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript

  //console.log("hello");
  //console.log(tabs);
    
  var expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

  var regex = new RegExp(expression);
  
  var contents = clipboard.get();
  var lines = contents.split(/\r?\n/);
  // go through each line and 1) look for urls 2) get rid of dupes
  var links = [];
  for (let line of lines) {
    if (line.match(regex)) {
      //sometimes the url and the title is the same...
      //don't want to open multiple instance of the same url
      //check for and ignore duplicates
      if (links.indexOf(line) == -1) {
        links.push(line);
      }
      else {
        //console.log("Skipping dupe:", line);
      }
    }
    else {
      //console.log("DIDN't match", line);
    }
  }

  for (let link of links) {
    tabs.open(link);
  }
}    


//https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Add_a_Context_Menu_Item
//https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/context-menu
var menuCopy = cm.Item({
  label: "Copy Tabs",
  //context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  accessKey: "t",
  onMessage: copy_tabs
});

var menuPaste = cm.Item({
  label: "Paste Tabs",
  contentScript: 'self.on("click", function (node, data) {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  onMessage: paste_tabs
});

var copy_button = ActionButton({
  id: "copy-tabs",
  label: "Copy Tabs",
  icon: {
    "16": "./copy16.png",
    "32": "./copy32.png",
    "64": "./copy64.png"
  },
  onClick: copy_tabs
});

var paste_button = ActionButton({
  id: "paste-tabs",
  label: "Paste Tabs",
  icon: {
    "16": "./paste16.png",
    "32": "./paste32.png",
    "64": "./paste64.png"
  },
  onClick: paste_tabs
});

