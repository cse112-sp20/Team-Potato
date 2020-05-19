chrome.tabs.onUpdated.addListener(function blockSite(tabId, info, tab) {
  console.log('Updated');
  const blockedDomains = ['facebook.com', 'youtube.com', 'twitch.tv'];
  blockedDomains.forEach(function (blockedDomain) {
    if (tab.url.includes(blockedDomain)) {
      chrome.tabs.executeScript(tabId, { file: 'siteBlocker.bundle.js' });
    }
  });
});
