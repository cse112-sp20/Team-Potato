import React from 'react';
import PopupFocusMode from './PopupFocusMode';

function openMenu() {
  const menuUrl = chrome.runtime.getURL('menu.html');
  chrome.tabs.create({ url: menuUrl });
}

function Popup() {
  return (
    <div className="Popup">
      <PopupFocusMode />
      <button type="button" onClick={openMenu}>
        Open Potato Tab
      </button>
    </div>
  );
}

export default Popup;
