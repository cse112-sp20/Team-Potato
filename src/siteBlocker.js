import './styles/BlockPopup.css';

const headingTexts = [
  'Tsk tsk tsk 😤, you should be focusing on [tabgroup]!',
  "Shouldn't you be working on [tabgroup]? 🤔",
  'Quit 🐴-ing around, get back to work on [tabgroup]!',
  "What do you think you're doing 👀? Focus on [tabgroup]!",
  "I guess [tabgroup] isn't that important to you 🥺?",
  'You wanted to focus on [tabgroup] you said 🤥',
  'Seriously 😟, you need to work on [tabgroup]!',
];

document.body.style.position = 'relative';
document.body.style.zIndex = '-1';
// Overlay div
const overlay = document.createElement('div');
overlay.setAttribute('class', 'overlay');

// Main display div
const mainDiv = document.createElement('div');
mainDiv.setAttribute('class', 'main');
overlay.appendChild(mainDiv);

// Heading
const heading = document.createElement('p');
heading.setAttribute('class', 'heading');
chrome.storage.sync.get('focusedTabGroupName', (obj) => {
  const focusGroupText = obj.focusedTabGroupName;
  const randomIndex = Math.floor(Math.random() * headingTexts.length);
  heading.innerHTML = headingTexts[randomIndex].replace(
    '[tabgroup]',
    focusGroupText
  );
});
mainDiv.appendChild(heading);

// Close Button
const closeBtn = document.createElement('button');
closeBtn.setAttribute('class', 'button');
closeBtn.innerHTML = `You got me, close ${window.location.host}`;
closeBtn.style.background = '#18b53a';
closeBtn.onclick = () => {
  chrome.runtime.sendMessage({ action: 'close' }, (response) => {
    console.log(response);
  });
};
mainDiv.appendChild(closeBtn);

// Unblock for Session Button
const unblockSessionBtn = document.createElement('button');
unblockSessionBtn.setAttribute('class', 'button');
unblockSessionBtn.setAttribute('id', 'unblockSessionBtn');
unblockSessionBtn.innerHTML = `Please, I really need ${window.location.host}`;
unblockSessionBtn.style.background = '#ff3b3b';
unblockSessionBtn.onclick = () => {
  chrome.runtime.sendMessage(
    {
      action: 'unblockSession',
      title: document.title,
      url: window.location.origin,
    },
    (response) => {
      console.log(response);
    }
  );
};
mainDiv.appendChild(unblockSessionBtn);

document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.parentNode.insertBefore(overlay, document.body.previousSibling);
