chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab) {
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      // check if Focus Mode is on
      if (obj.isFocusModeEnabled) {
        chrome.storage.sync.get(
          'focusedTabGroupUrls',
          (focusedTabGroupUrlsObj) => {
            const allowedDomains = focusedTabGroupUrlsObj.focusedTabGroupUrls;
            // if current tab's url isn't in allowedDomains, block the site
            if (!allowedDomains.some((domain) => tab.url.includes(domain))) {
              chrome.tabs.executeScript(tabId, {
                file: 'siteBlocker.bundle.js',
              });
            }
          }
        );
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'close':
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.remove(tabs[0].id);
      });
      sendResponse({
        response: 'Success',
      });
      return true;
    case 'unblock':
      chrome.storage.sync.get(
        'focusedTabGroupUrls',
        (focusedTabGroupUrlsObj) => {
          const { focusedTabGroupUrls } = focusedTabGroupUrlsObj;
          // Add the link to the current focusedTabGroupUrls list
          focusedTabGroupUrls.push(request.url);
          chrome.storage.sync.set({ focusedTabGroupUrls });
        }
      );
      // Reload the page to unblock
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
      setTimeout(() => {
        sendResponse({ response: 'Success' });
      }, 1);
      return true;
    case 'add':
      chrome.storage.sync.get('focusedTabGroupName', (obj) => {
        const { focusedTabGroupName } = obj;
        chrome.storage.sync.get('tabGroups', (tabGroupsObj) => {
          const { tabGroups } = tabGroupsObj;
          const index = tabGroups.findIndex(
            (tabGroup) => tabGroup.name === focusedTabGroupName
          );
          const tabData = { title: request.title, url: request.url };
          tabGroups[index].tabs.push(tabData);
        });
      });
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
      setTimeout(() => {
        sendResponse({ response: 'Success' });
      }, 1);
      return true;
    default:
  }
  return true;
});
