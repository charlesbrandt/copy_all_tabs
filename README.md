#Copy All Tabs

Copy All Tabs is a Firefox Add-on that takes the address and title for each tab and creates a text list of links. The list is copied to your clipboard so you can paste it to notes. You can also open tabs from a previously saved list of links.

This Add-on is available for Firefox here:
https://addons.mozilla.org/en-US/firefox/addon/copy-all-tabs/?src=api

The extension is open source software. Source code is available here:
https://github.com/charlesbrandt/copy_all_tabs

As of 2017.11.27, there may be a bug where paste will open multiple copies of the same tag. I am working to resolve that. 

This Add-on is functionally similar to CopyAllUrls (http://www.plasser.net/copyallurls/). I have used that add-on for many years with Firefox (Thank you, Jürgen!). The author has indicated that it is no longer being maintained. Now that Firefox requires Add-ons to be signed, the original is being blocked by Firefox.

It is also similar in functionality to Copy All Urls on Chrome, but I have not found something similar on Firefox:
https://chrome.google.com/webstore/detail/copy-all-urls/djdmadneanknadilpjiknlnanaolmbfk?hl=en


The current version has been updated to use the Web Extension API. 
https://developer.mozilla.org/en-US/Add-ons/WebExtensions

It is loosely based on the structure of the example "tabs, tabs, tabs" extension.
https://github.com/mdn/webextensions-examples/



Previous versions used Firefox's Add-ons SDK:
https://developer.mozilla.org/en-US/Add-ons/SDK

Functionality in the old version was available via the context menu. Right-click on a page to find "Copy Tabs" and "Paste Tabs". 

