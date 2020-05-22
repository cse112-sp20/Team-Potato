import React from 'react';
import Button from 'react-bootstrap/Button';
import TabGroup from './TabGroup';
import '../styles/Popup.css';
import PopupFocusMode from './PopupFocusMode';

class Popup extends React.Component {
  constructor() {
    super();

    this.state = {
      focusMode: false,
      focusGroup: '',
      tabgroups: [],
    };
  }

  componentDidMount() {
    chrome.storage.sync.get('tabgroups', (obj) => {
      if (obj) {
        const { tabgroups } = obj;
        if (tabgroups.length === 0) {
          chrome.storage.sync.set({ tabgroups: [] });
        }
        this.setState({ tabgroups });
      }
    });

    chrome.storage.sync.get('focusMode', (obj) => {
      const { focusMode } = obj;
      this.setState({ focusMode });
    });

    chrome.storage.sync.get('focusSites', (obj) => {
      console.log(obj.focusSites);
    });
  }

  startFocusMode = (target) => {
    const { tabgroups } = this.state;
    const index = tabgroups.findIndex((tabgroup) => tabgroup.name === target);
    this.setState({ focusMode: true, focusGroup: tabgroups[index] });
  };

  endFocusMode = () => {
    this.setState({ focusMode: false });
  };

  openMenu = () => {
    const menuUrl = chrome.runtime.getURL('menu.html');
    chrome.tabs.create({ url: menuUrl });
  };

  render() {
    const { focusMode, focusGroup, tabgroups } = this.state;
    return (
      <div className="menuContainer">
        {focusMode ? (
          <PopupFocusMode
            focusGroup={focusGroup}
            endFocusMode={this.endFocusMode}
          />
        ) : (
          tabgroups.map((tabgroup) => (
            <TabGroup
              view="popup"
              key={tabgroup.name}
              name={tabgroup.name}
              tabs={tabgroup.tabs}
              startFocusMode={this.startFocusMode}
            />
          ))
        )}

        <div className="btnContainer">
          <Button type="button" className="menuBtn" onClick={this.openMenu}>
            Open Potato Tab
          </Button>
        </div>
      </div>
    );
  }
}

export default Popup;
