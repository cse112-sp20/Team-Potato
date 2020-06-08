/**
 *  @fileOverview Component for the Focus Mode Popup, which includes the timer,
 *                buttons to start and end focus mode, and current tabgroup.
 *
 *  @author       Gary Chew
 *  @author       Christopher Yeh
 *  @author       Stephen Cheung
 *  @author       Chau Vu
 *  @author       David Dai
 *
 *  @requires     NPM:react,prop-types,react-compound-timer
 *  @requires     ../styles/PopupFocusMode.css
 */

import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'react-compound-timer';
import ReactSlider from 'react-slider';
import '../styles/PopupFocusMode.css';

/**
 * @description  The class of popup behavior to setup focusmode settings
 * @class
 */
class PopupFocusMode extends React.Component {
  /**
   * @constructor
   *
   * @type  {string} tabGroupName: the name of the focused group
   * @type  {array} tabGroupUrls: the tabgroup urls for the focused group
   * @type  {func} hideFocusMode: function to hide focusMode option for other tabgroups
   */
  constructor() {
    super();
    /**
     * those states are the intial default state
     * @type {boolean} isFocusModeEnables: whether the focus mode has started or not
     * @type {number} defaultTime: the default time for the length of focusmode
     * @type {number} passedTime: the amount of time passed since start focusmode
     */
    this.state = {
      isFocusModeEnabled: false,
      shouldDisplaySlider: true,
      defaultTime: 3600000,
      passedTime: 0,
    };

    PopupFocusMode.propTypes = {
      tabGroupName: PropTypes.string.isRequired,
      tabGroupUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      hideFocusMode: PropTypes.func.isRequired,
    };
    /** set the default props */
    PopupFocusMode.defaultProps = {};
  }

  /**
   * @description Method called to render at the beginning of the initial rendering
   */
  componentDidMount = () => {
    /** set the state that focusMode is started or not */
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      this.setState({ isFocusModeEnabled: obj.isFocusModeEnabled });
      if (obj.isFocusModeEnabled) {
        this.setState({ shouldDisplaySlider: false });
      }
    });
    /** start the clocktime to be the initclocktime */
    chrome.storage.sync.get('initClockTime', (obj) => {
      this.setState({ initClockTime: obj.initClockTime });
    });
  };

  /**
   * @description Function of when the focus mode decided to be luanched from the popup
   */
  launchFocusMode = () => {
    /** first get all the tabs */
    chrome.tabs.query({}, (currentTabs) => {
      const { tabGroupUrls } = this.props;
      // Open tabs in tab group
      /** for each tab in the tabgroup, open a seperate window */
      tabGroupUrls.forEach((tabUrl) => {
        chrome.tabs.create({ url: tabUrl });
      });
      /** Save current tabs */
      chrome.storage.sync.set({ savedTabs: currentTabs });
      /** Close current tabs */
      currentTabs.forEach((tab) => {
        chrome.tabs.remove(tab.id);
      });
    });
  };

  /**
   * @description render the popup focus part to initiate focus mode
   * @returns {*}
   */
  render() {
    /** set the following to be props
     * tabGroupname: the name of the tabgroup to launch focus mode
     * tabGroupUrls: the urls stored in the tabgroup which is to be launched into focus mode
     * hideFocusMode: forbidden other tabgroups to start focus mode
     */
    const { tabGroupName, tabGroupUrls, hideFocusMode } = this.props;
    /** set the following to be the current state
     * isFocusModeEnabled: decide whether the focus mode start or end
     * defaultime: the 1 hour default value for focus mode
     * initClockTime: the time when the focus mode is launched
     * passedTime: the amount of time passed by
     */
    const {
      isFocusModeEnabled,
      shouldDisplaySlider,
      defaultTime,
      initClockTime,
      passedTime,
    } = this.state;
    const buttonText = isFocusModeEnabled ? 'End\nFocus' : 'Start\nFocus';

    /**
     * @description end the focus mode by setting urls and enabled boolen to empty and false
     */
    const endFocusMode = () => {
      chrome.storage.sync.set({ focusedTabGroupUrls: [] });
      this.setState({ isFocusModeEnabled: false });
      chrome.storage.sync.set({ isFocusModeEnabled: false });
      chrome.runtime.sendMessage({ msg: 'end' });
    };

    /**
     * @description the set of actions to update state and so forth when focus
     *              mode is launched
     * @param {number} clock  the initial time of the clock
     */
    const startFocusMode = (clock) => {
      /** set the urls to the tabgroupRuls */
      chrome.storage.sync.set({
        focusedTabGroupUrls: tabGroupUrls,
      });
      /** update the states */
      this.setState({ isFocusModeEnabled: true });
      chrome.storage.sync.set({ shouldDisplayFocusMode: true });
      chrome.storage.sync.set({ isFocusModeEnabled: true });
      /** pass in the time for the initial time of the clock */
      chrome.storage.sync.set({ initClockTime: clock });
      /** set chrome storage to start focus mode */
      chrome.runtime.sendMessage({ msg: 'start' });
      /** launch the focus mode */
      this.launchFocusMode();
    };

    /**
     * @description get the starting time
     */
    const getStartingTime = () => {
      /** How much time to start clock with */
      if (isFocusModeEnabled) {
        return initClockTime;
      }
      return defaultTime;
    };

    /**
     * @description get the passed time updating for the focuspopup
     * @returns {number}  return the starting time
     */
    const getPassedTime = () => {
      /** get the passed time */
      chrome.runtime.sendMessage({ msg: 'get' }, (response) => {
        if (response) this.setState({ passedTime: response.time });
      });

      /** update the clock time */
      const newClockTime = initClockTime - passedTime;
      if (newClockTime > 0) {
        return newClockTime;
      }
      return 0;
    };

    return (
      <div className="popupFocusMode">
        <div className="popupFocusModeTitle">
          <h2>
            <strong>Focus Mode</strong>
          </h2>
        </div>
        <Timer
          // Note this is only set ONCE
          initialTime={getStartingTime()} /** get the starting time */
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
        >
          {({ start, stop, setTime, getTime }) => (
            <>
              <div className="popupFocusModeBodyContainer">
                <div className="popupFocusModeTabGroupName">{tabGroupName}</div>
                <button
                  className="popupFocusModeTimer"
                  type="button"
                  onClick={() => {
                    // Clicking timer will allow user to set custom time.
                    if (!isFocusModeEnabled && !shouldDisplaySlider) {
                      this.setState({ shouldDisplaySlider: true });
                    } else {
                      this.setState({ shouldDisplaySlider: false });
                    }
                  }}
                  data-testid="timer-button"
                >
                  <Timer.Hours formatValue={(value) => `${value}`} />
                  :
                  <Timer.Minutes />
                  :
                  <Timer.Seconds />
                </button>
                {/* <br /> */}
                {shouldDisplaySlider ? (
                  <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="sliderThumb"
                    defaultValue={60}
                    min={5}
                    step={5}
                    max={180}
                    snapDragDisabled={false}
                    renderThumb={(props, state) => (
                      <div {...props}>{[setTime(60000 * state.valueNow)]}</div>
                    )}
                  />
                ) : null}
              </div>
              {/* <br /> */}
              {/* <div className="popupFocusModeTabGroupName">{tabGroupName}</div> */}
              <div className="popupFocusModeBtnContainer">
                <button
                  className="popupFocusModeButton btn"
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
                <br />
                {isFocusModeEnabled ? (
                  [start(), setTime(getPassedTime())] // Where we get time from background
                ) : (
                  <button
                    type="button"
                    className="popupFocusModeBackButton btn"
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
