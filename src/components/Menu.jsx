import React from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TabGroup from './TabGroup';
import Tab from './Tab';
import '../styles/Menu.css';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      addGroupModal: false,
      activeTabs: [],
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

  addGroup = (e) => {
    if (e.type === 'submit') {
      e.preventDefault();
      const { activeTabs, tabgroups } = this.state;
      let groupName = e.target[0].value;
      if (groupName === '') {
        groupName = 'Untitled';
      }
      const { options } = e.target[1];

      const selectedTabs = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          selectedTabs.push(activeTabs[i]);
        }
      }
      const newGroup = {
        name: groupName,
        tabs: selectedTabs,
      };

      tabgroups.push(newGroup);
      this.setState({ tabgroups });

      this.modalClose();
    }
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

  modalClose = () => {
    this.setState({ addGroupModal: false });
  };

  render() {
    const { addGroupModal, activeTabs, tabgroups } = this.state;
    return (
      <div className="menuContainer">
        <div className="activeTabs">
          <h2>Active Tabs</h2>
          {activeTabs.map((tab) => (
            <Tab title={tab.title} url={tab.url} key={tab.title} />
          ))}
        </div>
        <div className="tabGroups">
          <h2>Tab Groups</h2>
          {tabgroups.map((tabgroup) => (
            <TabGroup
              key={tabgroup.name}
              name={tabgroup.name}
              tabs={tabgroup.tabs}
              deleteGroup={this.deleteGroup}
              editGroup={this.editGroup}
            />
          ))}

          <button
            className="addGroup"
            type="button"
            onClick={() => {
              this.setState({ addGroupModal: true });
            }}
          >
            <IoMdAddCircle />
          </button>
        </div>

        <Modal show={addGroupModal} onHide={this.modalClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Tabgroup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.addGroup}>
              <Form.Group controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Group Name..." />
              </Form.Group>
              <Form.Group controlId="selectedTabs">
                <Form.Label>Add Tabs to TabGroup</Form.Label>
                <Form.Control as="select" multiple>
                  {activeTabs.map((tab) => (
                    <option key={tab.title}>{tab.title}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" onClick={this.addGroup}>
                Create Group
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Menu;
