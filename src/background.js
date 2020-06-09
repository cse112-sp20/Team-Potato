/**
 * @fileOverview
 *
 * @author  Chau Vu
 * @author  Gary Chew
 * @author  Christopher Yeh
 * @author  Stephen Cheung
 */

const psl = require('psl');
/**
 * add a listener to trigger the site blocker
 */
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
    /** check if Focus Mode is on */
    if (obj.isFocusModeEnabled) {
      if (tab.url != null && !tab.url.startsWith('chrome://')) {
        chrome.storage.sync.get(
          'focusedTabGroupUrls',
          (focusedTabGroupUrlsObj) => {
            const allowedUrls = focusedTabGroupUrlsObj.focusedTabGroupUrls;
            const tabDomain = psl.parse(tab.url.split('/')[2]).domain;
            const hasSameDomain = (u) => u.includes(tabDomain);
            /** if current tab's url isn't in allowedDomains, block the site */
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
let timeOut; // Displays chrome notification
let initTimeInMinutes;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'start') {
    startTime = Date.now();
    passedTime = 0;
    chrome.storage.sync.get('initClockTime', (obj) => {
      if (obj) {
        initTimeInMinutes = obj.initClockTime / 60000;
        const opt = {
          type: 'basic',
          title: 'Good work!',
          message: `You focused for ${initTimeInMinutes} minutes. \nOpen Flow to end focus mode`,
          iconUrl: 'logo.png',
        };
        timeOut = setTimeout(
          () => chrome.notifications.create('fm-end', opt),
          obj.initClockTime
        );
      }
    });
  } else if (request.msg === 'get') {
    passedTime = Date.now() - startTime;
    sendResponse({ time: passedTime });
  } else if (request.msg === 'end') {
    window.clearTimeout(timeOut);
  }
});

// Blocking logic
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
    case 'unblockSession':
      // Unblock site
      chrome.storage.sync.get(
        'focusedTabGroupUrls',
        (focusedTabGroupUrlsObj) => {
          const { focusedTabGroupUrls } = focusedTabGroupUrlsObj;
          // Add the link to the current focusedTabGroupUrls list
          focusedTabGroupUrls.push(request.url);
          chrome.storage.sync.set({ focusedTabGroupUrls });
        }
      );

      // Reload page to unblock
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
