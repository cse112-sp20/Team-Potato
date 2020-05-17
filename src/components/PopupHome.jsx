import React from 'react';
import TabGroup from './TabGroup';
import '../styles/Popup.css';

class Popup extends React.Component {
  constructor() {
    super();

    this.state = {
      mode: 'home',
      tabgroups: [
        {
          name: 'work',
          tabs: [
            { title: 'Slack', url: 'https://slack.com' },
            { title: 'StackOverflow', url: 'https://stackoverflow.com' },
            { title: 'Canvas', url: 'https://canvas.ucsd.edu' },
          ],
        },
        {
          name: 'play',
          tabs: [
            { title: 'Youtube', url: 'https://youtube.com' },
            { title: 'Netflix', url: 'https://netflix.com' },
            { title: 'Hulu', url: 'https://hulu.com' },
          ],
        },
      ],
    };
  }

  openMenu = () => {
    const menuUrl = chrome.runtime.getURL('menu.html');
    chrome.tabs.create({ url: menuUrl });
  };

  render() {
    const { mode, tabgroups } = this.state;
    return (
      <div className="Popup">
        <h1>PotatoTab</h1>
        {mode === 'home'
          ? tabgroups.map((tabgroup) => (
            <TabGroup
              name={tabgroup.name}
              tabs={tabgroup.tabs}
              key={tabgroup.name}
            />
            ))
          : null}

        <button type="button" onClick={this.openMenu}>
          Open Potato Tab
        </button>
      </div>
    );
  }
}

export default Popup;
