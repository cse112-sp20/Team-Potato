import React from 'react';
import Button from 'react-bootstrap/Button';
import TabGroup from './TabGroup';
import '../styles/Popup.css';
import PopupFocusMode from './PopupFocusMode';

class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldDisplayFocusMode: false,
      focusedTabGroupName: '',
      focusedTabGroupUrls: [],
      tabGroups: [],
    };
  }

  componentDidMount() {
    chrome.storage.sync.get(
      'shouldDisplayFocusMode',
      (shouldDisplayFocusMode) => {
        this.setState({ shouldDisplayFocusMode });
      }
    );
    chrome.storage.sync.get('shouldDisplayFocusMode', (obj) => {
      this.setState({ shouldDisplayFocusMode: obj.shouldDisplayFocusMode });
    });
    chrome.storage.sync.get('focusedTabGroupName', (obj) => {
      this.setState({ focusedTabGroupName: obj.focusedTabGroupName });
    });
    chrome.storage.sync.get('focusedTabGroupUrls', (obj) => {
      this.setState({ focusedTabGroupUrls: obj.focusedTabGroupUrls });
    });
    chrome.storage.sync.get('tabGroups', (obj) => {
      const { tabGroups } = obj;
      /** if there is no tabgroups being created set it to an empty array */
      if (tabGroups.length === 0) {
        chrome.storage.sync.set({ tabGroups: [] });
      }
      this.setState({ tabGroups });
    });
  }

  displayFocusMode = (focusedTabGroupName, focusedTabGroupUrls) => {
    this.setState({ shouldDisplayFocusMode: true });
    chrome.storage.sync.set({ shouldDisplayFocusMode: true });
    this.setState({ focusedTabGroupName });
    chrome.storage.sync.set({ focusedTabGroupName });
    this.setState({ focusedTabGroupUrls });
  };

  hideFocusMode = () => {
    this.setState({ shouldDisplayFocusMode: false });
    chrome.storage.sync.set({ shouldDisplayFocusMode: false });
    this.setState({ focusedTabGroupName: '' });
    chrome.storage.sync.set({ focusedTabGroupName: '' });
    this.setState({ focusedTabGroupUrls: [] });
    chrome.storage.sync.set({ focusedTabGroupUrls: [] });
  };

  openMenu = () => {
    const url = chrome.runtime.getURL('menu.html');
    chrome.tabs.create({ url });
  };

  render() {
    const {
      shouldDisplayFocusMode,
      focusedTabGroupName,
      focusedTabGroupUrls,
      tabGroups,
    } = this.state;
    return (
      <div className="popupContainer">
        {shouldDisplayFocusMode ? (
          <PopupFocusMode
            tabGroupName={focusedTabGroupName}
            tabGroupUrls={focusedTabGroupUrls}
            hideFocusMode={this.hideFocusMode}
          />
        ) : (
          <div>
            {tabGroups.map((tabGroup) => (
              <TabGroup
                view="popup"
                key={tabGroup.name}
                name={tabGroup.name}
                id={tabGroup.id}
                tabs={tabGroup.tabs}
                displayFocusMode={this.displayFocusMode}
              />
            ))}
            <div className="btnContainer">
              <Button type="button" className="menuBtn" onClick={this.openMenu}>
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
