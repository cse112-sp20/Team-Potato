const psl = require('psl');

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
    // check if Focus Mode is on
    if (obj.isFocusModeEnabled) {
      if (tab.url != null && !tab.url.startsWith('chrome://')) {
        chrome.storage.sync.get(
          'focusedTabGroupUrls',
          (focusedTabGroupUrlsObj) => {
            const allowedUrls = focusedTabGroupUrlsObj.focusedTabGroupUrls;
            const tabDomain = psl.parse(tab.url.split('/')[2]).domain;
            const hasSameDomain = (u) => u.includes(tabDomain);
            // if current tab's url isn't in allowedDomains, block the site
            if (!allowedUrls.some(hasSameDomain)) {
              chrome.tabs.executeScript(tabId, {
                file: 'siteBlocker.bundle.js',
              });
            }
          }
        );
      }
    }
  });
});

// Timer for Focus Mode
let startTime;
let passedTime;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'start') {
    startTime = Date.now();
    console.log('Start time:');
    console.log(startTime);
  } else if (request.msg === 'get') {
    passedTime = Date.now() - startTime;
    sendResponse({ time: passedTime });
    console.log('Passed time:');
    console.log(passedTime);
  }
});
