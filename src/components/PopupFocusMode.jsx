import React from 'react';
import Timer from 'react-compound-timer';
import '../styles/PopupFocusMode.css';

class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocusModeOn: false,
      tabGroupName: 'CSE112',
      defaultTime: 3600000,
    };
  }

  clickStart = () => {
    this.setState({ isFocusModeOn: true });
  };

  clickEnd = () => {
    this.setState({ isFocusModeOn: false });
  };

  render() {
    const { isFocusModeOn, tabGroupName, defaultTime } = this.state;
    const buttonText = isFocusModeOn ? 'End\nFocus' : 'Start\nFocus';

    return (
      <div className="popup-view-fm">
        <h1>Focus Mode</h1>
        <Timer
          initialTime={defaultTime}
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
                <button
                  type="button"
                  onClick={() => {
                    if (isFocusModeOn) {
                      this.clickEnd();
                      stop();
                    } else {
                      this.clickStart();
                      start();
                    }
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </>
          )}
        </Timer>
      </div>
    );
  }
}
export default PopupFocusMode;
