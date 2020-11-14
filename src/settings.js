// TODO: updateSettingsForm, updateSettingsStorage, loadSettings as bare storage retrieval 
function loadSettings() {
  browser.storage.sync.get().then((res) => {
    res.outputFormat = res.outputFormat || "${tab.url}\r\n${tab.title}\r\n";
    console.log("Storage sync outputformat:", res.outputFormat);
    document.querySelector("#show-badge").checked = res.showBadge;
    document.querySelector("#output-format").value = res.outputFormat;
  });
}

function updateSettings(e) {
  e.preventDefault();
  browser.storage.sync.set({
    showBadge: document.querySelector("#show-badge").checked,
    outputFormat: document.querySelector("#output-format").value,
  });

  // TODO:
  // not sure how to call this (from background.js) to update instantly
  // updateCount();
  // in the meantime, any change to tabs should trigger the update
}

document.addEventListener("DOMContentLoaded", loadSettings);
document.querySelector("form").addEventListener("submit", updateSettings);
