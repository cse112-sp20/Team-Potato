/* global chrome */
import React from 'react';

function openMenu() {
  const menuUrl = chrome.runtime.getURL('menu.html');
  chrome.tabs.create({ url: menuUrl });
}

function Popup() {
  return (
    <div className="Popup">
      <h1>Hello world</h1>
      <button type="button" onClick={openMenu}>
        Open Potato Tab
      </button>
    </div>
  );
}

export default Popup;
