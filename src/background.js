chrome.tabs.onUpdated.addListener(function blockSite(tabId, info, tab) {
  chrome.storage.sync.get('focusSites', (obj) => {
    const allowedDomains = obj.focusSites;
    // length 0 means focus mode not on
    if (allowedDomains.length > 0) {
      // if current tab's url isn't in allowedDomains, block the site
      if (!allowedDomains.some((domain) => tab.url.includes(domain))) {
        chrome.tabs.executeScript(tabId, { file: 'siteBlocker.bundle.js' });
      }
    }
  });
});
