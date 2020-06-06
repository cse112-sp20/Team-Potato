/**
 * @fileOverview  This file mainly describes the rendering and functions
 *                of the blocker when a user access a website that is
 *                not within the tabgroup url
 *
 * @author  Gary Chew
 * @author  Chau Vu
 *
 * @requires  ./styles/BlockPopup.css
 */

import './styles/BlockPopup.css';

/** the component is built from a bottom to top perspective
 * we first build the overlay, then we build the mainDiv, and then
 * we attach the text and buttons
 */
document.body.style.position = 'relative';
document.body.style.zIndex = '-1';
/** Overlay div */
const overlay = document.createElement('div');
overlay.setAttribute('class', 'overlay');

/** Main display div */
const mainDiv = document.createElement('div');
mainDiv.setAttribute('class', 'main');
overlay.appendChild(mainDiv);

/** FocusMode Text */
const focusModeText = document.createElement('p');
focusModeText.setAttribute('class', 'focusModeText');
focusModeText.innerHTML = 'You are in Focus Mode for ';
mainDiv.append(focusModeText);

/** Focus Group Text */
const focusGroupText = document.createElement('p');
focusGroupText.setAttribute('class', 'focusGroupText');
/** get the focued tab group name to be displayed */
chrome.storage.sync.get('focusedTabGroupName', (obj) => {
  focusGroupText.innerHTML = obj.focusedTabGroupName;
});
mainDiv.append(focusGroupText);

/** Heading: describing what is blocked */
const heading = document.createElement('p');
heading.setAttribute('class', 'heading');
/** telling user what is blocked */
heading.innerHTML = `${window.location.host} is blocked!`;
mainDiv.appendChild(heading);

/** User may click Close Button to close the website */
const closeBtn = document.createElement('button');
closeBtn.setAttribute('class', 'button');
closeBtn.innerHTML = 'Close Tab';
closeBtn.style.background = '#18b53a';
closeBtn.onclick = () => {
  /** when the buttonis closed, the website will be closed */
  chrome.runtime.sendMessage({ action: 'close' }, (response) => {
    console.log(response);
  });
};
/** append close button to the mainDiv */
mainDiv.appendChild(closeBtn);

/** the user may click Unblock Button to temporarily unblock the website */
console.log('Unblock once');
const unblockBtn = document.createElement('button');
unblockBtn.setAttribute('class', 'button');
unblockBtn.innerHTML = 'Unblock Once';
unblockBtn.style.background = '#0078f0';
unblockBtn.onclick = () => {
  /** when the user clicked the website is unblocked */
  chrome.runtime.sendMessage(
    { action: 'unblock', url: window.location.origin },
    (response) => {
      console.log(response);
    }
  );
};
/** append the unblock button to the mainDiv */
mainDiv.appendChild(unblockBtn);

/** user may click Add to Group Button to unblock the website for the whole
 * focus mode session
 */
const addBtn = document.createElement('button');
addBtn.setAttribute('class', 'button');
addBtn.innerHTML = 'Add to Group';
addBtn.style.background = '#ff3b3b';
addBtn.onclick = () => {
  chrome.runtime.sendMessage(
    /** add the current domain to the tabgroup so it will not be blocked */
    { action: 'add', title: document.title, url: window.location.origin },
    (response) => {
      console.log(response);
    }
  );
};
mainDiv.appendChild(addBtn);
document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.parentNode.insertBefore(overlay, document.body.previousSibling);
