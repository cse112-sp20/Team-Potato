import React from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import TabGroup from './TabGroup';
import '../styles/Menu.css';

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

  addGroup = () => {
    const { tabgroups } = this.state;
    const newGroup = {
      name: 'test',
      tabs: ['test1', 'test2'],
    };
    tabgroups.push(newGroup);
    this.setState({ tabgroups });
  }

  render() {
    const { tabgroups } = this.state;
    return (
      <div>
        <h1>Menu.jsx</h1>
        {tabgroups.map((tabgroup) => (
          <TabGroup name={tabgroup.name} tabs={tabgroup.tabs} />
        ))}

        <button className="addGroup" type="button" onClick={this.addGroup}>
          <IoMdAddCircle />
        </button>
      </div>
    );
  }
}

export default Menu;
