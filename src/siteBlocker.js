import './styles/BlockPopup.css';

// document.body.innerHTML = '';
console.log('blocking');

// Overlay div
const overlay = document.createElement('div');
overlay.setAttribute('class', 'overlay');

// Main display div
const mainDiv = document.createElement('div');
mainDiv.setAttribute('class', 'main');
overlay.appendChild(mainDiv);

// FocusMode Text
const focusModeText = document.createElement('p');
focusModeText.setAttribute('class', 'focusModeText');
focusModeText.innerHTML = 'You are in Focus Mode for ';
mainDiv.append(focusModeText);

// Focus Group Text
const focusGroupText = document.createElement('p');
focusGroupText.setAttribute('class', 'focusGroupText');
chrome.storage.sync.get('focusedTabGroupName', (obj) => {
  focusGroupText.innerHTML = obj.focusedTabGroupName;
});
mainDiv.append(focusGroupText);

// Heading
const heading = document.createElement('p');
heading.setAttribute('class', 'heading');
heading.innerHTML = `${window.location.host} is blocked!`;
mainDiv.appendChild(heading);

// Close Button
const closeBtn = document.createElement('button');
closeBtn.setAttribute('class', 'button');
closeBtn.innerHTML = 'Close Tab';
closeBtn.style.background = '#18b53a';
closeBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: 'close' }, (response) => {
    console.log(response);
  });
};
mainDiv.appendChild(closeBtn);

// Unblock Button
const unblockBtn = document.createElement('button');
unblockBtn.setAttribute('class', 'button');
unblockBtn.innerHTML = 'Unblock Once';
unblockBtn.style.background = '#0078f0';
unblockBtn.onclick = () => {
  chrome.runtime.sendMessage(
    { action: 'unblock', url: window.location.origin },
    (response) => {
      console.log(response);
    }
  );
};
mainDiv.appendChild(unblockBtn);

// Add to Group Button
const addBtn = document.createElement('button');
addBtn.setAttribute('class', 'button');
addBtn.innerHTML = 'Add to Group';
addBtn.style.background = '#ff3b3b';
addBtn.onclick = () => {
  chrome.runtime.sendMessage(
    { action: 'add', url: window.location.origin },
    (response) => {
      console.log(response);
    }
  );
};
mainDiv.appendChild(addBtn);

document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.appendChild(overlay);
