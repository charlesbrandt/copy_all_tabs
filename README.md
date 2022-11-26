# Copy All Tabs

A Firefox Add-on that takes the address and title for each tab and creates a text list of links. The list is copied to your clipboard so you can paste it to notes. You can also open tabs from a previously saved list of links.

This Add-on is available for Firefox here:
https://addons.mozilla.org/en-US/firefox/addon/copy-all-tabs/?src=api

The extension is open source software. Source code is available here:
https://github.com/charlesbrandt/copy_all_tabs

This Add-on is similar in functionality to Copy All Urls on Chrome:
https://chrome.google.com/webstore/detail/copy-all-urls/djdmadneanknadilpjiknlnanaolmbfk?hl=en

Pull requests are welcome!

## Development Process

Documentation for creating an extension has improved over the years.

https://extensionworkshop.com/

The WebExtensions API is required in Firefox

https://developer.mozilla.org/en-US/Add-ons/WebExtensions

Generally, following along with a "getting started" guide helps:

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension

### Installing

Open "about:debugging" in Firefox, click "This Firefox", click "Load Temporary Add-on" and select any file in your extension's directory

When getting started with a custom extension manifest.json, I received:

    There was an error during installation: Extension is invalid

Check that the manifest.json is valid. In my case, I wasn't providing all parameters for the content_scripts option. Subtract and re-add elements until it passes to hone in on the part with a problem.

Click Inspect -> Console to see logging output

Reminder: Actions taken on Firefox `about:*` pages will not have any console output. Test with other tabs.

### Permissions

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json/permissions#Clipboard_access

### Publishing

Remember to:

- comment out any console statements added during development before zipping up.

- increment the version number in `manifest.json`
- commit changes and add a tag in git repo
```
git tag -a 0.0.10 -m 'version 0.0.10'  
```
- bundle and deploy
```
cd copy_all_tabs/src
zip -r -FS ../copy-all-tabs.zip *
```

Log in and publish zip file.

## History

0.0.10
Merge in PR #16 and apply fix for #17

0.0.9
Version 0.0.9 provides a custom output setting in the settings panel to customize the way tab links are copied to the clipboard.

This add-on is inspired by old add-on called CopyAllUrls (http://www.plasser.net/copyallurls/). I used that add-on for many years with Firefox (Thank you, Jürgen!).

The current version has been updated to use the Web Extension API.
https://developer.mozilla.org/en-US/Add-ons/WebExtensions

It is loosely based on the structure of the example "tabs, tabs, tabs" extension.
https://github.com/mdn/webextensions-examples/

Previous versions used Firefox's Add-ons SDK:
https://developer.mozilla.org/en-US/Add-ons/SDK

Functionality in the old version was available via the context menu. Right-click on a page to find "Copy Tabs" and "Paste Tabs".

## Alternatives

https://addons.mozilla.org/en-US/firefox/addon/foxytab/?src=featured
Not open source?
