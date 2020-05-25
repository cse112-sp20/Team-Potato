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
    };
  }

  componentDidMount() {
    this.getActiveTabs();
    chrome.storage.sync.get('tabGroups', (obj) => {
      const { tabGroups } = obj;
      if (tabGroups.length === 0) {
        chrome.storage.sync.set({ tabGroups: [] });
      }
      this.setState({ tabGroups });
    });
  }

  getActiveTabs = () => {
    chrome.tabs.query({}, (tabs) => {
      const tempTabs = [];

      for (let i = 0; i < tabs.length; i += 1) {
        let addable = true;
        for (let j = 0; j < tempTabs.length; j += 1) {
          if (tabs[i].url === tempTabs[j].url){
            addable = false;
          }
        }
        if (addable) {
          tempTabs.push({ title: tabs[i].title, url: tabs[i].url, key: tabs[i].key });
        }
      }
      this.setState({ activeTabs: tempTabs });
    });
  };

  drop = (e) => {
    console.log("run");
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

      const index = tabGroups.findIndex(
        (tabGroup) => tabGroup.name === e.target.id
      );

      const tabData = { title: tabObj.title, url: tabObj.url, key: tabObj.key };
      let addable = true;
      for (let i = 0; i < tabGroups[index].tabs.length; i += 1) {
        if (tabGroups[index].tabs[i].url === tabObj.url) {
          addable = false;
        }
      }
      if (addable === true) {
        tabGroups[index].tabs.push(tabData);
        tab.style.display = 'block';
        e.target.appendChild(tab);
      }
      chrome.storage.sync.set({ tabGroups });
    }
    console.log(tabGroups);
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
    const { addGroupModal, activeTabs, tabGroups } = this.state;
    return (
      <div className="menuContainer">
        <div
          id="activeTabs"
          className="activeTabs"
          droppable="false"
          onDrop={this.drop}
          onDragOver={this.dragOver}
        >
          <h2>Active Tabs</h2>
          {activeTabs.map((tab) => (
            <Tab title={tab.title} url={tab.url} key={tab.key} />
          ))}
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
