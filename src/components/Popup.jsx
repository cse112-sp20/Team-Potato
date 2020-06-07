/**
 * @fileOverview This file is for popup object attach to the extension part of
 *               Chrome and it contains constructor, display focusmode, open
 *               menu, and hide focusmode.
 *
 * @author      Stephen Cheung
 * @author      Gary Chew
 * @author      Chau Vu
 * @author      Christopher Yeh
 * @author      David Dai
 *
 * @requires    NPM: react, react-bootstrap
 * @requires    ../styles/Popup.css
 * @requires    ./TabGroup
 * @requires    ./PopupFocusMode
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import TabGroup from './TabGroup';
import '../styles/Popup.css';
import PopupFocusMode from './PopupFocusMode';

/**
 * @description   A class which controls the rendering and behavior of the
 *                popup page for the chrome extension
 * @class
 */
class Popup extends React.Component {
  /**
   * @constructor
   */
  constructor() {
    super();
    /** set those as the current initial state
     * @type {boolean}  shouldDisplayFocusMode: decide whether the focus mode should be displayed or not
     * @type {stirng}   focusedTabGroupName: the name of the tabgroup that user chose to focus
     * @type {array}    focusedTabGroupUrls: an array of urls stored in the tabgroup that user chose to focus
     * @type {array}    tabGroups: the array of tabgroups user created
     */
    this.state = {
      shouldDisplayFocusMode: false,
      focusedTabGroupName: '',
      focusedTabGroupUrls: [],
      tabGroups: [],
    };
  }

  /**
   * @description  Method called to render at the beginning of the initial rendering
   */
  componentDidMount() {
    /** set the state for shouldDisplayFocusMode */
    chrome.storage.sync.get(
      'shouldDisplayFocusMode',
      (shouldDisplayFocusMode) => {
        this.setState({ shouldDisplayFocusMode });
      }
    );
    chrome.storage.sync.get('shouldDisplayFocusMode', (obj) => {
      this.setState({ shouldDisplayFocusMode: obj.shouldDisplayFocusMode });
    });
    /** set the state for focusedtabgroupname */
    chrome.storage.sync.get('focusedTabGroupName', (obj) => {
      this.setState({ focusedTabGroupName: obj.focusedTabGroupName });
    });
    /** set the state for the focusedTabGroupUrls */
    chrome.storage.sync.get('focusedTabGroupUrls', (obj) => {
      this.setState({ focusedTabGroupUrls: obj.focusedTabGroupUrls });
    });
    /** set the state for the tabgroups */
    chrome.storage.sync.get('tabGroups', (obj) => {
      if (obj) {
        const { tabGroups } = obj;
        /** if there is no tabgroups being created set it to an empty array */
        if (tabGroups.length === 0) {
          chrome.storage.sync.set({ tabGroups: [] });
        }
        this.setState({ tabGroups });
      }
    });
  }

  /**
   * @description when focus mode button clicked the following are executed
   * @param {string} focusedTabGroupName  the name of the focused tab group
   * @param {array} focusedTabGroupUrls  the urls that this focused tab group contained
   */
  displayFocusMode = (focusedTabGroupName, focusedTabGroupUrls) => {
    this.setState({ shouldDisplayFocusMode: true });
    chrome.storage.sync.set({ shouldDisplayFocusMode: false });
    /** update state with the focusedTabGroupName and urls */
    this.setState({ focusedTabGroupName });
    chrome.storage.sync.set({ focusedTabGroupName });
    this.setState({ focusedTabGroupUrls });
  };

  /**
   *  @description: depend on the shoulddisplayFocusmode decide to hide the focusmode
   */
  hideFocusMode = () => {
    this.setState({ shouldDisplayFocusMode: false });
    chrome.storage.sync.set({ shouldDisplayFocusMode: false });
    /** update state with the empty focusedTabGroupName and empty urls */
    this.setState({ focusedTabGroupName: '' });
    chrome.storage.sync.set({ focusedTabGroupName: '' });
    this.setState({ focusedTabGroupUrls: [] });
    chrome.storage.sync.set({ focusedTabGroupUrls: [] });
  };

  /**
   * @description: click the open menu button to direct to menu
   */
  openMenu = () => {
    /** open menu.html in a new tab */
    const url = chrome.runtime.getURL('menu.html');
    chrome.tabs.create({ url });
  };

  /**
   * @description: how the popup page is rendered
   * @returns {*}
   */
  render() {
    /** update those to the current state
     * shouldDisplayFocusMode: decide whether the focus mode should be displayed or not
     * focusedTabGroupName: the name of the tabgroup that user chose to focus
     * focusedTabGroupUrls: an array of urls stored in the tabgroup that user chose to focus
     * tabGroups: the array of tabgroups user created
     */
    const {
      shouldDisplayFocusMode,
      focusedTabGroupName,
      focusedTabGroupUrls,
      tabGroups,
    } = this.state;
    return (
      <div className="popupContainer">
        {shouldDisplayFocusMode ? (
          /** if should not display focusmode */
          <PopupFocusMode
            tabGroupName={focusedTabGroupName}
            tabGroupUrls={focusedTabGroupUrls}
            /** update state and chrome storage */
            hideFocusMode={this.hideFocusMode}
          />
        ) : (
          <div>
            <div className="popupTabGroupHeader">
              <h2>Tab Groups</h2>
            </div>
            <div className="popupTabGroupContainer">
              {tabGroups.map((tabGroup) => (
                /** if should display focuemode */
                <TabGroup
                  view="popup"
                  key={tabGroup.name}
                  name={tabGroup.name}
                  id={tabGroup.id}
                  tabs={tabGroup.tabs}
                  /** update state and chrome storage */
                  displayFocusMode={this.displayFocusMode}
                />
              ))}
            </div>
            <div className="btnContainer">
              <Button
                type="button"
                className="menuBtn"
                onClick={this.openMenu} /** click to open menu */
              >
                Open Potato Tab
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Popup;
