import React from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import TabGroup from './TabGroup';
import Tab from './Tab';
import '../styles/Menu.css';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      addGroupModal: false,
      activeTabs: [],
      tabgroups: [],
    };
  }

  componentDidMount() {
    this.getActiveTabs();
    chrome.storage.sync.get('tabgroups', (obj) => {
      const { tabgroups } = obj;
      if (tabgroups.length === 0) {
        chrome.storage.sync.set({ tabgroups: [] });
      }
      this.setState({ tabgroups });
    });
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

  drop = (e) => {
    const droppable = e.target.attributes.getNamedItem('droppable').value;
    if (droppable !== 'true' || e.target === undefined) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.preventDefault();
      const id = e.dataTransfer.getData('id');
      // get the element by the id
      const tab = document.getElementById(id);
      tab.style.display = 'block';
      e.target.appendChild(tab);
    }
  };

  dragOver = (e) => {
    e.preventDefault();
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

      chrome.storage.sync.set({ tabgroups }, () => {});

      this.modalClose();
    }
  };

  deleteGroup = (target) => {
    let { tabgroups } = this.state;
    tabgroups = tabgroups.filter((tabgroup) => tabgroup.name !== target);
    this.setState({ tabgroups });
    chrome.storage.sync.set({ tabgroups });
  };

  editGroup = (target, newName) => {
    const { tabgroups } = this.state;
    const index = tabgroups.findIndex((tabgroup) => tabgroup.name === target);
    tabgroups[index].name = newName;
    this.setState({ tabgroups });
    chrome.storage.sync.set({ tabgroups });
  };

  modalClose = () => {
    this.setState({ addGroupModal: false });
  };

  render() {
    const { addGroupModal, activeTabs, tabgroups } = this.state;
    return (
      <div className="menuContainer">
        <div
          id="activeTabs"
          className="activeTabs"
          droppable="true"
          onDrop={this.drop}
          onDragOver={this.dragOver}
        >
          <h2>Active Tabs</h2>
          {activeTabs.map((tab) => (
            <Tab title={tab.title} url={tab.url} key={uuid()} />
          ))}
        </div>
        <div className="tabGroups">
          <h2>Tab Groups</h2>
          {tabgroups.map((tabgroup) => (
            <TabGroup
              view="menu"
              key={tabgroup.name}
              name={tabgroup.name}
              tabs={tabgroup.tabs}
              deleteGroup={this.deleteGroup}
              editGroup={this.editGroup}
              drop={this.drop}
              dragOver={this.dragOver}
            />
          ))}

          <button
            className="addGroup"
            type="button"
            onClick={() => {
              this.setState({ addGroupModal: true });
            }}
            data-testid="add-button"
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
                    <option key={uuid()}>{tab.title}</option>
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
