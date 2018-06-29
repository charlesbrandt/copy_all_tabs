# Copy All Tabs

Copy All Tabs is a Firefox Add-on that takes the address and title for each tab and creates a text list of links. The list is copied to your clipboard so you can paste it to notes. You can also open tabs from a previously saved list of links.

This Add-on is available for Firefox here:
https://addons.mozilla.org/en-US/firefox/addon/copy-all-tabs/?src=api

The extension is open source software. Source code is available here:
https://github.com/charlesbrandt/copy_all_tabs

This Add-on is similar in functionality to Copy All Urls on Chrome:
https://chrome.google.com/webstore/detail/copy-all-urls/djdmadneanknadilpjiknlnanaolmbfk?hl=en

Pull requests are welcome!

## Known Issues

  - The add-on does not work with any of the native Firefox pages like new tab or about: pages. This is annoying, but I haven't been able to find a solution for it. [more](https://github.com/charlesbrandt/copy_all_tabs/issues/2) [more](https://github.com/charlesbrandt/copy_all_tabs/issues/5) 
  - On Firefox for Android, the main interface opens in a new tab, but the actions don't work. May be related to the previous issue. 


## History

This add-on was inspired by old add-on called CopyAllUrls (http://www.plasser.net/copyallurls/). I used that add-on for many years with Firefox (Thank you, Jürgen!). 

The current version has been updated to use the Web Extension API. 
https://developer.mozilla.org/en-US/Add-ons/WebExtensions

It is loosely based on the structure of the example "tabs, tabs, tabs" extension.
https://github.com/mdn/webextensions-examples/


Previous versions used Firefox's Add-ons SDK:
https://developer.mozilla.org/en-US/Add-ons/SDK

Functionality in the old version was available via the context menu. Right-click on a page to find "Copy Tabs" and "Paste Tabs". 

## Contributors

Thanks [@refset](https://github.com/refset) for the start of the options / settings page. 
