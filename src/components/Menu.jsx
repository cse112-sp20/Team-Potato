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
      tabGroups: [],
      savedTabs: [],
    };
  }

  componentDidMount() {
    this.getActiveTabs();
    this.getTabGroups();
    this.getSavedTabs();
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

  getTabGroups = () => {
    chrome.storage.sync.get('tabGroups', (obj) => {
      let { tabGroups } = obj;
      if (!tabGroups) {
        chrome.storage.sync.set({ tabGroups: [] });
        tabGroups = [];
      }
      this.setState({ tabGroups });
    });
  };

  getSavedTabs = () => {
    chrome.storage.sync.get('savedTabs', (obj) => {
      let { savedTabs } = obj;
      if (!savedTabs || savedTabs.length === 0) {
        savedTabs = [];
      }
      this.setState({ savedTabs });
    });
  };

  deleteSavedTabs = () => {
    const savedTabs = [];
    this.setState({ savedTabs });
    chrome.storage.sync.set({ savedTabs });
  };

  openSavedTabs = () => {
    const { savedTabs } = this.state;
    savedTabs.forEach((tabUrl) => {
      chrome.tabs.create({ url: tabUrl.url });
    });
    this.deleteSavedTabs();
  };

  drop = (e) => {
    const { tabGroups } = this.state;
    const droppable = e.target.attributes.getNamedItem('droppable').value;
    if (droppable !== 'true' || e.target === undefined) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.preventDefault();
      const tabObj = JSON.parse(e.dataTransfer.getData('text'));
      // get the element by the id
      const tab = document.getElementById(tabObj.id);
      tab.style.display = 'block';
      e.target.appendChild(tab);

      const index = tabGroups.findIndex(
        (tabGroup) => tabGroup.name === e.target.id
      );

      const tabData = { title: tabObj.title, url: tabObj.url };
      tabGroups[index].tabs.push(tabData);
      chrome.storage.sync.set({ tabGroups });
    }
  };

  dragOver = (e) => {
    e.preventDefault();
  };

  addGroup = (e) => {
    if (e.type === 'submit') {
      e.preventDefault();
      const { activeTabs, tabGroups } = this.state;
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

      tabGroups.push(newGroup);
      this.setState({ tabGroups });

      chrome.storage.sync.set({ tabGroups }, () => {});

      this.modalClose();
    }
  };

  deleteGroup = (target) => {
    let { tabGroups } = this.state;
    tabGroups = tabGroups.filter((tabGroup) => tabGroup.name !== target);
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
  };

  editGroup = (target, newName) => {
    const { tabGroups } = this.state;
    const index = tabGroups.findIndex((tabGroup) => tabGroup.name === target);
    tabGroups[index].name = newName;
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
  };

  modalClose = () => {
    this.setState({ addGroupModal: false });
  };

  render() {
    const { addGroupModal, activeTabs, tabGroups, savedTabs } = this.state;
    return (
      <div className="menuContainer">
        <div className="leftSideBar">
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
          {savedTabs.length !== 0 ? (
            <div className="savedTabs">
              <div className="savedTabsHeader">
                <h2>Saved Tabs</h2>
                <button type="button" onClick={this.deleteSavedTabs}>
                  Delete All
                </button>
                <button type="button" onClick={this.openSavedTabs}>
                  Open All
                </button>
              </div>
              {savedTabs.map((tab) => (
                <Tab title={tab.title} url={tab.url} key={uuid()} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="tabGroups">
          <h2>Tab Groups</h2>
          {tabGroups.map((tabGroup) => (
            <TabGroup
              view="menu"
              key={tabGroup.name}
              name={tabGroup.name}
              tabs={tabGroup.tabs}
              deleteGroup={this.deleteGroup}
              editGroup={this.editGroup}
              drop={this.drop}
              dragOver={this.dragOver}
            />
          ))}
        </div>
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

        <Modal show={addGroupModal} onHide={this.modalClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New tabGroup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.addGroup} data-testid="form">
              <Form.Group controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Group Name..." />
              </Form.Group>
              <Form.Group controlId="selectedTabs">
                <Form.Label>Add Tabs to tabGroup</Form.Label>
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
