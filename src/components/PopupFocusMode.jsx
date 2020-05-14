/* eslint-disable react/prefer-stateless-function */
import React from 'react';
// import Popup from './Popup';

function clickStartFocus() {
  setInterval(() => {
    // Set timer here
  });
}

function clickEndFocus() {}

class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      // Todo: set hours and minutes to numbers we can manipulate
      tabGroupName: 'CSE112',
      hours: '01:',
      minutes: '00',
    };
  }

  render() {
    const { tabGroupName, hours, minutes } = this.state;
    return (
      <div className="popup-view-fm-start">
        <h1>Focus Mode</h1>
        {/* Use timer react library below or implement own */}
        <h1>
          {hours}
          {minutes}
        </h1>
        <h1>{tabGroupName}</h1>
        <button type="button" onClick={clickStartFocus}>
          Start
        </button>
      </div>
    );
  }
}

export default PopupFocusMode;
