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
      excludeUrls: [
        'chrome-extension://flfgpjanhbdjakbkafipakpfjcmochnp/menu.html',
        'chrome://newtab/',
      ],
    };
  }

  componentDidMount() {
    this.getActiveTabs();
    this.getTabGroups();
    this.getSavedTabs();
  }

  getActiveTabs = () => {
    const { excludeUrls } = this.state;
    chrome.tabs.query({}, (tabs) => {
      const activeTabs = [];

      for (let i = 0; i < tabs.length; i += 1) {
        let addable = true;
        for (let j = 0; j < activeTabs.length; j += 1) {
          if (tabs[i].url === activeTabs[j].url) {
            addable = false;
          }
        }
        if (addable && !excludeUrls.includes(tabs[i].url)) {
          activeTabs.push({
            title: tabs[i].title,
            url: tabs[i].url,
            favIconUrl: tabs[i].favIconUrl,
            stored: tabs[i].stored,
          });
        }
      }
      this.setState({ activeTabs });
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
    if (
      e.target === undefined ||
      e.target.attributes.getNamedItem('droppable').value !== 'true'
    ) {
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
      const tabData = {
        title: tabObj.title,
        url: tabObj.url,
        stored: tabGroups[index].trackid,
        favIconUrl: tabObj.favIconUrl,
      };
      let addable = true;
      for (let i = 0; i < tabGroups[index].tabs.length; i += 1) {
        if (tabGroups[index].tabs[i].url === tabObj.url) {
          addable = false;
        }
      }
      if (addable === true) {
        tabGroups[index].tabs.push(tabData);
        tab.style.display = 'block';
        // delete from the old TabGroup
        if (tabObj.stored !== 'activeTabs' && tabObj.stored !== 'savedTabs') {
          const deleteGroup = tabGroups.findIndex((tabGroup) => tabGroup.trackid === tabObj.stored);
          const deleteIndex = tabGroups[deleteGroup].tabs.findIndex(
            (temp) => temp.url === tabObj.url
          );
          const updatedTabs = [];
          for (let i = 0; i < tabGroups[deleteGroup].tabs.length; i += 1) {
            if (i !== deleteIndex) {
              updatedTabs.push({
                title: tabGroups[deleteGroup].tabs[i].title,
                url: tabGroups[deleteGroup].tabs[i].url,
                stored: tabGroups[deleteGroup].tabs[i].stored,
                favIconUrl: tabGroups[deleteGroup].tabs[i].favIconUrl,
              });
            }
          }
          tabGroups[deleteGroup].tabs = updatedTabs;
        }
      }
      chrome.storage.sync.set({ tabGroups });
    }
    this.componentDidMount();
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
      let count = 0;
      let nameCheck = true;
      let tempGroupName = groupName;
      while (nameCheck) {
        const index = tabGroups.findIndex(
          (tabGroup) => tabGroup.name === tempGroupName
        );
        if (index === -1) {
          nameCheck = false;
        } else {
          count += 1;
          tempGroupName = groupName + count.toString();
        }
      }
      groupName = tempGroupName;
      const newGroup = {
        name: groupName,
        trackid: uuid(),
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
    tabGroups = tabGroups.filter((tabGroup) => tabGroup.trackid !== target);
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
  };

  editGroup = (target, newName) => {
    const { tabGroups } = this.state;
    const index = tabGroups.findIndex(
      (tabGroup) => tabGroup.trackid === target
    );
    let count = 0;
    if (tabGroups[index].name === newName) {
      // eslint-disable-next-line no-param-reassign
      newName = tabGroups[index].name;
    } else {
      let tempName = newName;
      while (true) {
        const i = tabGroups.findIndex((tabGroup) => tabGroup.name === tempName);
        if (i === -1 || i === index) {
          break;
        } else {
          count += 1;
          tempName = newName + count.toString();
        }
      }
      // eslint-disable-next-line no-param-reassign
      newName = tempName;
    }
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
            droppable="false"
            onDrop={this.drop}
            onDragOver={this.dragOver}
          >
            <h2>Active Tabs</h2>
            {activeTabs.map((tab) => (
              <Tab
                //key={uuid()}
                title={tab.title}
                url={tab.url}
                stored="activeTabs"
                favIconUrl={tab.favIconUrl}
              />
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
                <Tab
                  //key={uuid()}
                  title={tab.title}
                  url={tab.url}
                  stored="activeTabs"
                  favIconUrl={tab.favIconUrl}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="tabGroups">
          <h2>Tab Groups</h2>
          {tabGroups.map((tabGroup) => (
            <TabGroup
              view="menu"
              key={tabGroup.trackid}
              trackid={tabGroup.trackid}
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
