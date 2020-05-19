import React from 'react';
import Button from 'react-bootstrap/Button';
import TabGroup from './TabGroup';
import '../styles/Popup.css';

class Popup extends React.Component {
  constructor() {
    super();

    this.state = {
      tabgroups: [
        {
          name: 'work',
          tabs: [
            { title: 'Slack', url: 'https://slack.com' },
            { title: 'StackOverflow', url: 'https://stackoverflow' },
            { title: 'Canvas', url: 'https://canvas.com' },
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

  deleteGroup = (target) => {
    const { tabgroups } = this.state;
    this.setState({
      tabgroups: tabgroups.filter((tabgroup) => tabgroup.name !== target),
    });
  };

  editGroup = (target, newName) => {
    const { tabgroups } = this.state;
    const index = tabgroups.findIndex((tabgroup) => tabgroup.name === target);
    tabgroups[index].name = newName;
    this.setState({ tabgroups });
  };

  render() {
    const { tabgroups } = this.state;
    return (
      <div className="menuContainer">
        {tabgroups.map((tabgroup) => (
          <TabGroup
            key={tabgroup.name}
            name={tabgroup.name}
            tabs={tabgroup.tabs}
            deleteGroup={this.deleteGroup}
            editGroup={this.editGroup}
          />
        ))}
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