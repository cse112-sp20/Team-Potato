import React from 'react';
import TabGroup from './TabGroup';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      tabgroups: [
        {
          name: 'work',
          tabs: ['slack', 'stackoverflow', 'canvas'],
        },
        {
          name: 'play',
          tabs: ['youtube', 'netflix', 'hulu'],
        },
      ],
    };
  }

  render() {
    const { tabgroups } = this.state;
    return (
      <div>
        <h1>Menu.jsx</h1>
        {tabgroups.map((tabgroup) => (
          <TabGroup name={tabgroup.name} tabs={tabgroup.tabs} />
        ))}
      </div>
    );
  }
}

export default Menu;
