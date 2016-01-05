var cm = require("sdk/context-menu");
var tabs = require("sdk/tabs");
var clipboard = require("sdk/clipboard");

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
  onMessage: function (selection) {
    var tab_list = '';
    var active_window = tabs.activeTab.window;
    //console.log(active_window);
    
    for (let tab of tabs) {
      if (tab.window == active_window) {
        //TODO:
        //way to configure different output formats

        //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
        tab_list += tab.url + '\n';
        tab_list += tab.title + '\n';
      }
      else {
        //console.log("Different window", tab.window);
      }
    }
    //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/clipboard
    clipboard.set(tab_list);
  }
});

var menuPaste = cm.Item({
  label: "Paste Tabs",
  contentScript: 'self.on("click", function (node, data) {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  onMessage: function (selection) {

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
});

