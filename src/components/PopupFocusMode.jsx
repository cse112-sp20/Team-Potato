/**
 *  @fileOverview Component for the Focus Mode Popup, which includes the timer,
 *                buttons to start and end focus mode, and current tabgroup.
 *
 *  @author       Gary Chew
 *  @author       Christopher Yeh
 *
 *  @requires     NPM:react,prop-types,react-compound-timer
 *  @requires     ../styles/PopupFocusMode.css
 */

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

    const getStartingTime = () => {
      if (isFocusModeEnabled) {
        return initClockTime;
      }
      return defaultTime;
    };

    const getPassedTime = () => {
      chrome.runtime.sendMessage({ msg: 'get' }, (response) => {
        this.setState({ passedTime: response.time });
      });
      if (isFocusModeEnabled) {
        const newClockTime = initClockTime - passedTime;
        if (newClockTime > 0) {
          return newClockTime;
        }
        return 0;
      }
      return getStartingTime();
    };

    return (
      <div className="popupFocusMode">
        <div className="popupFocusModeTitle">Focus Mode</div>
        <Timer
          // Note this is only set ONCE
          initialTime={getStartingTime()}
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
          checkpoints={{
            time: 0,
            callback: () => {
              endFocusMode();
              hideFocusMode();
            },
          }}
        >
          {({ start, stop, setTime, getTime }) => (
            <>
              <div className="popupFocusModeTimer">
                <Timer.Hours />
                :
                <Timer.Minutes />
                :
                <Timer.Seconds />
              </div>

              <div className="popupFocusModeTabGroupName">{tabGroupName}</div>

              <div className="popupFocusModeBtnContainer">
                <button
                  className="popupFocusModeButton btn btn-primary"
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
                  [start(), setTime(getPassedTime())] // Where we get time from background
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

        {isFocusModeEnabled ? null : (
          <button
            className="popupFocusModeBackButton btn btn-secondary"
            type="button"
            onClick={() => {
              const { hideFocusMode } = this.props;
              hideFocusMode();
            }}
          >
            Go Back
          </button>
        )}
      </div>
    );
  }
}
export default PopupFocusMode;
