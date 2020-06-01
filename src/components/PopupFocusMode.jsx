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
      passedTime: 0,
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
    chrome.storage.sync.get('initClockTime', (obj) => {
      this.setState({ initClockTime: obj.initClockTime });
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
      initClockTime,
      passedTime,
    } = this.state;
    const buttonText = isFocusModeEnabled ? 'End\nFocus' : 'Start\nFocus';

    const endFocusMode = () => {
      chrome.storage.sync.set({ focusedTabGroupUrls: [] });
      this.setState({ isFocusModeEnabled: false });
      chrome.storage.sync.set({ isFocusModeEnabled: false });
    };

    const startFocusMode = (clock) => {
      chrome.storage.sync.set({
        focusedTabGroupUrls: tabGroupUrls,
      });
      this.setState({ isFocusModeEnabled: true });
      chrome.storage.sync.set({ isFocusModeEnabled: true });
      chrome.runtime.sendMessage({ msg: 'start' });
      chrome.storage.sync.set({ initClockTime: clock });
      this.launchFocusMode();
    };

    const getPassedTime = () => {
      chrome.runtime.sendMessage({ msg: 'get' }, (response) => {
        this.setState({ passedTime: response.time });
      });
      if (isFocusModeEnabled) {
        return initClockTime - passedTime;
      }
      return defaultTime;
    };

    return (
      <div className="popupFocusMode">
        <h1>Focus Mode</h1>
        <Timer
          // Note this is only set ONCE
          initialTime={defaultTime}
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
                {setTime(getPassedTime())}
                <button
                  className="clock"
                  type="button"
                  onClick={() => {
                    const newTime = prompt('Enter new time in minutes: ', '60');
                    const parsedTime = parseInt(newTime, 10);
                    if (Number.isInteger(parsedTime) && parsedTime > 0) {
                      chrome.runtime.sendMessage({ cmd: 'start' });
                      const msInitClockTime = 60000 * parsedTime;
                      chrome.storage.sync.set({
                        initClockTime: msInitClockTime,
                      });
                      this.setState({ initClockTime: msInitClockTime });
                      setTime(msInitClockTime);
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
                      startFocusMode(getTime());
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
