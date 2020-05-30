chrome.tabs.onUpdated.addListener((tabId, tab) => {
  chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
    // check if Focus Mode is on
    if (obj.isFocusModeEnabled) {
      chrome.storage.sync.get(
        'focusedTabGroupUrls',
        (focusedTabGroupUrlsObj) => {
          const allowedDomains = focusedTabGroupUrlsObj.focusedTabGroupUrls;
          // if current tab's url isn't in allowedDomains, block the site
          if (!allowedDomains.some((domain) => tab.url.includes(domain))) {
            chrome.tabs.executeScript(tabId, { file: 'siteBlocker.bundle.js' });
          }
        }
      );
    }
  });
});

// Timer for Focus Mode
// let startTime;
// let passedTime = Date.now() - startTime;
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.cmd === 'start') {
//     startTime = Date.now();
//   } else if (request.cmd === 'get') {
//     passedTime = Date.now() - startTime;
//     sendResponse({ time: passedTime });
//   }
// });

// chrome.browserAction.onClicked.addListener((tab) => {
//   chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
//     if (obj.isFocusModeEnabled) {
//       chrome.storage.sync.get('time', (obj) => {
//         if (obj) {
//           this.setState({ backgroundTime: obj.time - Date.now() });
//         }
//       });
//     }
//   });
// });
