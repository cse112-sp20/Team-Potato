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
      // Set timer
    }
  });
});
