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
    chrome.tabs.query({}, (openTabs) => {
      const { tabGroupUrls } = this.props;
      tabGroupUrls.forEach((tabUrl) => {
        chrome.tabs.create({ url: tabUrl });
      });

      openTabs.forEach((tab) => {
        chrome.tabs.remove(tab.id);
      });
    });
  };

  render() {
    const { tabGroupName, tabGroupUrls } = this.props;
    const { isFocusModeEnabled, defaultTime } = this.state;
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
      this.launchFocusMode();
    };

    return (
      <div className="popupFocusMode">
        <h1>Focus Mode</h1>
        <Timer
          initialTime={defaultTime}
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
          checkpoints={{
            time: 0,
            callback: () => {
              // TODO: check if this works when extension isn't open, may need to check with background.js
              endFocusMode();
            },
          }}
        >
          {({ start, stop, setTime }) => (
            <>
              <div>
                <button
                  className="clock"
                  type="button"
                  onClick={() => {
                    const newTime = prompt('Enter new time in minutes: ', '60');
                    const parsedTime = parseInt(newTime, 10);
                    if (Number.isInteger(parsedTime) && parsedTime > 0) {
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
              <div className="btnContainer">
                <button
                  type="button"
                  onClick={() => {
                    if (isFocusModeEnabled) {
                      stop();
                      endFocusMode();
                    } else {
                      start();
                      startFocusMode();
                    }
                  }}
                >
                  {buttonText}
                </button>
                <br />
                {isFocusModeEnabled ? (
                  start()
                ) : (
                  <button
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
            </>
          )}
        </Timer>
      </div>
    );
  }
}
export default PopupFocusMode;
