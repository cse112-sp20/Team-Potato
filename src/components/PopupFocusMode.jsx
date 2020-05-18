/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Timer from 'react-compound-timer';
import '../styles/PopupFocusMode.css';

class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocusModeOn: false,
      tabGroupName: 'CSE112',
    };
  }

  clickStart = () => {
    this.setState({ isFocusModeOn: true });
  };

  clickEnd = () => {
    this.setState({ isFocusModeOn: false });
  };

  render() {
    const { isFocusModeOn, tabGroupName } = this.state;
    const buttonText = isFocusModeOn ? 'End\nFocus' : 'Start\nFocus';

    return (
      <div className="popup-view-fm">
        <h1>Focus Mode</h1>
        <Timer
          initialTime={3600000}
          direction="backward"
          startImmediately={false}
        >
          {({ start, stop }) => (
            <>
              <div>
                <Timer.Hours />
                :
                <Timer.Minutes />
                :
                <Timer.Seconds />
              </div>
              <h1>{tabGroupName}</h1>
              <div>
                {isFocusModeOn ? (
                  <button
                    type="button"
                    onClick={() => {
                      this.clickEnd();
                      stop();
                    }}
                  >
                    {buttonText}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      this.clickStart();
                      start();
                    }}
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            </>
          )}
        </Timer>
        {/* {isFocusModeOn ? (
          <button type="button" onClick={this.clickEnd}>
            {buttonText}
          </button>
        ) : (
          <button type="button" onClick={this.clickStart}>
            {buttonText}
          </button>
        )} */}
      </div>
    );
  }
}

export default PopupFocusMode;
