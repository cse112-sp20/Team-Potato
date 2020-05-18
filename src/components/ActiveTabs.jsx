import React from 'react';

class ActiveTabs extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTabs: [],
    };
  }

  componentDidMount() {
    this.getActiveTabs();
  }

  getActiveTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      const tempTabs = [];

      for (let i = 0; i < tabs.length; i += 1) {
        tempTabs.push({ title: tabs[i].title, url: tabs[i].url });
      }

      this.setState({ activeTabs: tempTabs });
    });
  };

  render() {
    const { activeTabs } = this.state;
    return (
      <div className="ActiveTabs">
        <h2>Active Tabs</h2>
        <ul>
          {activeTabs.map((tab) => (
            <li key={tab.title}>{tab.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ActiveTabs;
