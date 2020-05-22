import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'react-compound-timer';
import '../styles/PopupFocusMode.css';

class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocusModeOn: false,
      defaultTime: 3600000,
    };

    PopupFocusMode.propTypes = {
      focusGroup: PropTypes.string.isRequired,
      endFocusMode: PropTypes.func.isRequired,
    };
  }

  componentDidMount() {
    chrome.storage.sync.get('focusMode', (obj) => {
      const isFocusModeOn = obj.focusMode;
      this.setState({ isFocusModeOn });
    });
  }

  clickStart = () => {
    const { focusGroup } = this.props;
    this.setState({ isFocusModeOn: true });
    chrome.storage.sync.set({ focusMode: true });
    const focusSites = focusGroup.tabs.map((tab) => tab.url);
    chrome.storage.sync.set({ focusSites }, () => {});
  };

  clickEnd = () => {
    const { endFocusMode } = this.props;
    this.setState({ isFocusModeOn: false });
    chrome.storage.sync.set({ focusMode: false });
    chrome.storage.sync.set({ focusSites: [] }, () => {});
    endFocusMode();
  };

  render() {
    const { focusGroup } = this.props;
    const { isFocusModeOn, defaultTime } = this.state;
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
              <h1>{focusGroup.name}</h1>
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
