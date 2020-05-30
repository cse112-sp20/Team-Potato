import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'react-compound-timer';
import '../styles/PopupFocusMode.css';

class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocusModeEnabled: false,
      defaultTime: 3600000,
    };

    PopupFocusMode.propTypes = {
      tabGroupName: PropTypes.string.isRequired,
      tabGroupUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      hideFocusMode: PropTypes.func.isRequired,
    };

    PopupFocusMode.defaultProps = {};
  }

  componentDidMount = () => {
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      this.setState({ isFocusModeEnabled: obj.isFocusModeEnabled });
    });
  };

  launchFocusMode = () => {
    chrome.tabs.query({}, (currentTabs) => {
      const { tabGroupUrls } = this.props;
      // Open tabs in tab group
      tabGroupUrls.forEach((tabUrl) => {
        chrome.tabs.create({ url: tabUrl });
      });
      // Save current tabs
      chrome.storage.sync.set({ savedTabs: currentTabs });
      // Close current tabs
      currentTabs.forEach((tab) => {
        chrome.tabs.remove(tab.id);
      });
    });
  };

  render() {
    const { tabGroupName, tabGroupUrls, hideFocusMode } = this.props;
    const {
      isFocusModeEnabled,
      defaultTime,
      backgroundTime,
      startingTime,
      passedTime,
    } = this.state;
    const buttonText = isFocusModeEnabled ? 'End\nFocus' : 'Start\nFocus';

    const endFocusMode = () => {
      chrome.storage.sync.set({ focusedTabGroupUrls: [] });
      this.setState({ isFocusModeEnabled: false });
      chrome.storage.sync.set({ isFocusModeEnabled: false });
    };

    const startFocusMode = () => {
      chrome.storage.sync.set({
        focusedTabGroupUrls: tabGroupUrls,
      });
      this.setState({ isFocusModeEnabled: true });
      chrome.storage.sync.set({ isFocusModeEnabled: true });
      // chrome.runtime.sendMessage({ cmd: 'start' });
      chrome.storage.sync.set({ time: Date.now() });
      this.launchFocusMode();
    };

    // const getPassedTime = chrome.runtime.sendMessage(
    //   { cmd: 'get' },
    //   (response) => {
    //     return response.time;
    //   }
    // );

    const getPassedTime = () => {
      if (isFocusModeEnabled) {
        // chrome.storage.sync.get('time', (obj) => {
        //   if (obj) {
        //     this.setState({ backgroundTime: obj.time - Date.now() });
        //   }
        // });
        // chrome.storage.sync.get('startingTime', (obj) => {
        //   if (obj) {
        //     this.setState({ startingTime: obj.startTime });
        //   }
        // });
        // const interval = startingTime - backgroundTime;
        // this.setState({ passedTime: interval });
        return 1200000;
      }
      return defaultTime;
    };

    return (
      <div className="popupFocusMode">
        <h1>Focus Mode</h1>
        <Timer
          // Note this is only set ONCE
          initialTime={getPassedTime()}
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
          checkpoints={{
            time: 0,
            callback: () => {
              // TODO: check if this works when extension isn't open, may need to check with background.js
              endFocusMode();
              hideFocusMode();
            },
          }}
        >
          {({ start, stop, setTime, getTime }) => (
            <>
              <div>
                <button
                  className="clock"
                  type="button"
                  onClick={() => {
                    const newTime = prompt('Enter new time in minutes: ', '60');
                    const parsedTime = parseInt(newTime, 10);
                    if (Number.isInteger(parsedTime) && parsedTime > 0) {
                      chrome.runtime.sendMessage({ cmd: 'start' });
                      setTime(60000 * parsedTime);
                    }
                  }}
                >
                  <Timer.Hours />
                  :
                  <Timer.Minutes />
                  :
                  <Timer.Seconds />
                </button>
              </div>
              <h1>{tabGroupName}</h1>
              <br />
              <div className="btnContainer">
                <button
                  className="fm-button"
                  type="button"
                  onClick={() => {
                    if (isFocusModeEnabled) {
                      stop();
                      endFocusMode();
                      hideFocusMode();
                    } else {
                      start();
                      // Set initial time so we can set a new time when popup is reopened
                      chrome.storage.sync.set({ startTime: getTime() });
                      startFocusMode();
                    }
                  }}
                >
                  {buttonText}
                </button>
                {isFocusModeEnabled ? (
                  start()
                ) : (
                  <button
                    type="button"
                    className="fm-button"
                    onClick={() => {
                      hideFocusMode();
                    }}
                  >
                    Go Back
                  </button>
                )}
                <br />
              </div>
            </>
          )}
        </Timer>
      </div>
    );
  }
}
export default PopupFocusMode;
