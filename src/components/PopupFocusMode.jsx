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

  componentDidMount() {
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      this.setState({ isFocusModeEnabled: obj.isFocusModeEnabled });
    });
  }

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
    const { tabGroupName, tabGroupUrls } = this.props;
    const { isFocusModeEnabled, defaultTime } = this.state;
    const buttonText = isFocusModeEnabled ? 'End\nFocus' : 'Start\nFocus';

    return (
      <div className="popupFocusMode">
        <h1>Focus Mode</h1>
        <Timer
          initialTime={defaultTime}
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
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
              <div className="btnContainer">
                <button
                  type="button"
                  onClick={() => {
                    if (isFocusModeEnabled) {
                      stop();
                      chrome.storage.sync.set({ focusedTabGroupUrls: [] });
                      this.setState({ isFocusModeEnabled: false });
                      chrome.storage.sync.set({ isFocusModeEnabled: false });
                    } else {
                      start();
                      chrome.storage.sync.set({
                        focusedTabGroupUrls: tabGroupUrls,
                      });
                      this.setState({ isFocusModeEnabled: true });
                      chrome.storage.sync.set({ isFocusModeEnabled: true });
                      this.launchFocusMode();
                    }
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </>
          )}
        </Timer>
        <br />
        {isFocusModeEnabled ? null : (
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
    );
  }
}
export default PopupFocusMode;
