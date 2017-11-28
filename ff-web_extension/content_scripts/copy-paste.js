/**
 * Attempts to write data to the users clipboard.
 * @param  {string|object}  message  expects a string at 'content' attribute
 * @param  {natural}        time  Maximum runtime of this asynchronous operation after which it will be canceled and rejected.
 * @return {Promise}              Promise that rejects if the timeout or an error occurred. If it resolves the operation should have succeeded.

via:
https://discourse.mozilla.org/t/placing-a-variable-in-the-clipboard/15347/2
 */
function handleMessage(message, time) {
  console.log("handleMessage called:", message.action);
  if (message.action == "paste") {
    //handle paste

    // these show up in the console for the active window/tab,
    // not in the background page console (debug)
    //console.log("made it here");
    //console.log(message.content);
    return new Promise(function(resolve, reject) {
      let done = false;
      function onPaste(event) { try {
	console.log("onPaste called:", event);
	if (done) { return; } done = true;
	document.removeEventListener('paste', onPaste);
	//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData
	const transfer = event.clipboardData;
	var contents = transfer.getData("text");

	var expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

	var regex = new RegExp(expression);
	
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
              console.log("Skipping dupe:", line);
	    }
	  }
	  else {
	    console.log("DIDN't match", line);
	  }
	}
	
	for (let link of links) {
	  //tabs.open(link);
	  console.log("Opening new tab: ", link);
	  // can't do this in a content script:
	  //browser.tabs.create({url: link});
	  // send a message instead:
	  browser.runtime.sendMessage({"url": link});
	}
	
	
	event.preventDefault();
	resolve();
      } catch (error) { reject(error); } }
      setTimeout(() => {
	if (done) { return; } done = true;
	document.removeEventListener('paste', onPaste);
	reject(new Error('Timeout after '+ (time || 1000) +'ms'));
      }, time || 1000);
      document.addEventListener('paste', onPaste);
      document.execCommand('paste', false, null);
    })
  }
  else {
    //handle copy
    return new Promise(function(resolve, reject) {
      let done = false;
      function onCopy(event) { try {
	if (done) { return; } done = true;
	document.removeEventListener('copy', onCopy);
	const transfer = event.clipboardData;
	transfer.clearData();
	transfer.setData('text/plain', message.content);
	event.preventDefault();
	resolve();
      } catch (error) { reject(error); } }
      setTimeout(() => {
	if (done) { return; } done = true;
	document.removeEventListener('copy', onCopy);
	reject(new Error('Timeout after '+ (time || 1000) +'ms'));
      }, time || 1000);
      document.addEventListener('copy', onCopy);
      document.execCommand('copy', false, null);
    })
  }
};

browser.runtime.onMessage.addListener(handleMessage);

