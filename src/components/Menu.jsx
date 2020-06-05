/**
 * @fileOverview This file is the menu class which contains tabgroups,
 *               activetabs, and savedtabs. Here included functionalities from
 *               constrcutor, component render, create a new tabgroup, and so on
 *
 * @author      David Dai
 * @author      Gary Chew
 * @author      Chau Vu
 * @author      Fernando Vazquez
 * @author      Brandon Olmos
 *
 * @requires    NPM: react, uuid, prop-types, react-bootstrap, react-icons
 * @requires    ../styles/Menu.css
 * @requires    ./Tab
 * @requires    ./TabGroup
 */

import React from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { v4 as uuid } from 'uuid';
import TabGroup from './TabGroup';
import Tab from './Tab';
import '../styles/Menu.css';

/**
 * @description   A class to represent Menu components which consists TabGroups, ActiveTabs
 *                savedTabs, and Tabs
 * @class
 */
class Menu extends React.Component {
  /**
   * @constructor
   */
  constructor() {
    super();
    /** set the current default state to the following
     * @type  {boolean} addGroupModal: decide whether the modal render or not
     * @type  {array} activeTabs:  current active tabs
     * @type  {array} tabGroups: tabgroups being stored
     * @type  {array} savedTabs: the tabs being saved after launch focus mdoe
     * @type  {number} interval:  number of milisecond to get an update of activeTabs
     * @type  {array}  excludeUrls: urls not being shown on the within the active tabs
     */
    this.state = {
      addGroupModal: false,
      activeTabs: [],
      tabGroups: [],
      savedTabs: [],
      interval: 0,
      excludeUrls: [
        /** this is the potato tab menu page */
        'chrome-extension://flfgpjanhbdjakbkafipakpfjcmochnp/menu.html',
        /** new tab for chrome brower */
        'chrome://newtab/',
      ],
    };
  }

  /**
   * @description Method called to render at the beginning of the initial rendering
   */
  componentDidMount() {
    this.getActiveTabs(); /** get current active tabs */
    this.getTabGroups(); /** get current saved tabgroups */
    this.getSavedTabs(); /** get current saved tabs after focus mode */
    this.setInterval(); /** set an time of refreshing for new active tabs */
  }

  /**
   * @description Method called when a component is beingb removed from the DOM
   */
  componentWillUnmount() {
    clearInterval(this.state.interval); /** stop the refreshing for new active tabs */
  }

  /**
   * @description get the current chrome tabs opened to show up on the menu page
   */
  getActiveTabs = () => {
    const { excludeUrls } = this.state;
    /** call for the current tabs opened with Chrome */
    chrome.tabs.query({}, (tabs) => {
      const activeTabs = [];
      /** checking for redundancy chrome tabs */
      for (let i = 0; i < tabs.length; i += 1) {
        let addable = true;
        for (let j = 0; j < activeTabs.length; j += 1) {
          if (tabs[i].url === activeTabs[j].url) {
            addable = false;
            break;
          }
        }
        /** only if not in the excluded urls and no redundancy, it is added */
        if (addable && !excludeUrls.includes(tabs[i].url)) {
          activeTabs.push({
            title: tabs[i].title,
            url: tabs[i].url,
            favIconUrl: tabs[i].favIconUrl,
            stored: tabs[i].stored,
          });
        }
      }
      /** updates the corresponding state */
      this.setState({ activeTabs });
    });
  };

  /**
   * @description get the current saved tabGroups from the chrome storage
   *               to show up on the menu page
   */
  getTabGroups = () => {
    /** look into the chrome storage to find tabgroups */
    chrome.storage.sync.get('tabGroups', (obj) => {
      let { tabGroups } = obj;
      /** if it is empty, then set tabgroups to empty array */
      if (!tabGroups) {
        chrome.storage.sync.set({ tabGroups: [] });
        tabGroups = [];
      }
      /** update the tabGroups state */
      this.setState({ tabGroups });
    });
  };

  /**
   * @description   get the saved tabs from the chrome storage to show in the menu
   */
  getSavedTabs = () => {
    /** look into the chrome storage to find saved tabs */
    chrome.storage.sync.get('savedTabs', (obj) => {
      let { savedTabs } = obj;
      /** if it is empty, then set savedTabs to empty array */
      if (!savedTabs || savedTabs.length === 0) {
        savedTabs = [];
      }
      /** update the savedTabs state */
      this.setState({ savedTabs });
    });
  };

  /**
   * @description   delete all the tabs stored in the SavedTabs
   */
  deleteSavedTabs = () => {
    const savedTabs = [];
    /** update the savedTab state and the chrome storage */
    this.setState({ savedTabs });
    chrome.storage.sync.set({ savedTabs });
  };

  /**
   * @description   open all the tabs stored in the SavedTabs
   */
  openSavedTabs = () => {
    const { savedTabs } = this.state;
    savedTabs.forEach((tabUrl) => {
      /** launch a new chrome tab for each saved tab */
      chrome.tabs.create({ url: tabUrl.url });
    });
    /** then remove the saved tabs from SavedTabs */
    this.deleteSavedTabs();
  };

  /**
   * @description   drop a tab into a tabgroup and lead to a series of rendering and chrome
   *                storage update
   *
   * @param {Tab} e   the tab that is being dropped
   */
  drop = (e) => {
    /** stop the refreshing for new active tabs */
    this.clearInterval();
    const { tabGroups } = this.state;
    /** check if the dropped target is droppable or valid */
    if (
      e.target === undefined ||
      e.target.attributes.getNamedItem('droppable').value !== 'true'
    ) {
      /** if invalid or not droppable, do nothing */
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.preventDefault();
      /** receive the tab data from dragStart of Tab */
      const tabObj = JSON.parse(e.dataTransfer.getData('text'));
      // get the element by the id
      /** grab the element by id for visual movement */
      const tab = document.getElementById(tabObj.id);
      /** find the index of the TabGroup to add the Tab */
      const index = tabGroups.findIndex(
        (tabGroup) => tabGroup.name === e.target.id
      );
      /** create the data to be appended to the TabGroup */
      const tabData = {
        title: tabObj.title,
        url: tabObj.url,
        stored: tabGroups[index].trackid,
        favIconUrl: tabObj.favIconUrl,
      };
      /** check if there is an redundant tab in the target */
      let addable = true;
      for (let i = 0; i < tabGroups[index].tabs.length; i += 1) {
        if (tabGroups[index].tabs[i].url === tabObj.url) {
          addable = false;
        }
      }
      /** if there is redundancy, we skip this if loop */
      if (addable === true) {
        /** here means no redundancy */
        /** push the Tab to the corresponding TabGroup (append) */
        tabGroups[index].tabs.push(tabData);
        tab.style.display = 'block';
        /** if the tab is originally stored in activeTabs or savedTabs
         *  when we drop this tab, we keep a copy in the activeTabs or
         *  savedTabs instead of remove it */
        /** however, if it is stored from a TabGroup
         *  delete this tab from the old TabGroup */
        if (tabObj.stored !== 'activeTabs' && tabObj.stored !== 'savedTabs') {
          /** find the TabGroup to delete the corresponding tab */
          const deleteGroup = tabGroups.findIndex(
            (tabGroup) => tabGroup.trackid === tabObj.stored
          );
          /** find the Tab index to delete from the deleteGroup */
          const deleteIndex = tabGroups[deleteGroup].tabs.findIndex(
            (temp) => temp.url === tabObj.url
          );
          /** delete the corresponding Tab from the corresponding TabGroup */
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
          /** update the state with the newest deletion*/
          tabGroups[deleteGroup].tabs = updatedTabs;
        }
      }
      /** sync the updated TabGroups with chrome storage */
      chrome.storage.sync.set({ tabGroups });
      /** tell DOM to re-render to update the menu visual */
      this.setState({ tabGroups });
    }
    /** this will keep refresh for newest number of tabs in ActiveTabs */
    this.getActiveTabs();
    this.setInterval();
  };

  /**
   * @description   prevents propagation of the same event from being called
   * @param {Tab} e   the tab that is being dropped
   */
  dragOver = (e) => {
    /** prevent the refresh of searching active tabs */
    this.clearInterval();
    e.preventDefault();
    /** continue the interval of searchinga active tabs */
    this.setInterval();
  };

  /**
   * @description   Add a new TabGroup and triggers a series of rendering with
   *                chrome storage update
   * @param {Modal} e   the modal jumped out to add a new group
   */
  addGroup = (e) => {
    /** prevent the refresh of searching active tabs */
    this.clearInterval();
    /** only execute when user hit submit button */
    if (e.type === 'submit') {
      e.preventDefault();
      const { activeTabs, tabGroups } = this.state;
      /** if user inputs name, then set the name temporary to it
       * else set it to Untitled */
      let groupName = e.target[0].value;
      if (groupName === '') {
        groupName = 'Untitled';
      }
      const { options } = e.target[1];
      /** allow user to append the tabs to the newly created TabGroup
       * from the active Tabs */
      const selectedTabs = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          selectedTabs.push(activeTabs[i]);
        }
      }
      /** check for redundant groupname and auto rename groupname */
      let count = 0;
      let nameCheck = true;
      let tempGroupName = groupName;
      /** constantly loop through the names of all the tabgroups
       * if there is an redundant name, append a numerical number behind
       * and reloop through. This process will continue until there is
       * no redundant names */
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
      /** create the newGroup to be appended to chrome storage */
      const newGroup = {
        name: groupName,
        trackid: uuid() /** to keep track each group uniquely */,
        tabs: selectedTabs,
      };
      /** update tabGroups and corresponding chrome storage */
      tabGroups.push(newGroup);
      this.setState({ tabGroups });
      chrome.storage.sync.set({ tabGroups }, () => {});
      /** close the modal since user submitted */
      this.modalClose();
    }
    this.setInterval();
  };

  /**
   * @description   Delete the TabGroup by passing in the trackid
   * @param {string} target   The trackid of the TabGroup to be deleted
   */
  deleteGroup = (target) => {
    let { tabGroups } = this.state;
    /** filter out the TabGroup which trackid matches target */
    tabGroups = tabGroups.filter((tabGroup) => tabGroup.trackid !== target);
    /** update the correspondings tate and chrome storage */
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
  };

  /**
   * @description   Rename the Tabgroup by passing in the trackid and the new name
   * @param {string} target   The trackid of the TabGroup to be editted
   * @param {string} newName  The new name of the TabGroup
   */
  editGroup = (target, newName) => {
    /** prevent the refresh of searching active tabs */
    this.clearInterval();
    const { tabGroups } = this.state;
    /** find the index of the TabGroup to be renamed */
    const index = tabGroups.findIndex(
      (tabGroup) => tabGroup.trackid === target
    );
    /** change the name only if the name is different */
    if (tabGroups[index].name !== newName) {
      /** check if there is a redundant name existed */
      /** constantly loop through the names of all the tabgroups
       * if there is an redundant name, append a numerical number behind
       * and reloop through. This process will continue until there is
       * no redundant names */
      let count = 0;
      let tempName = newName;
      while (true) {
        // eslint-disable-next-line no-loop-func
        const i = tabGroups.findIndex((tabGroup) => tabGroup.name === tempName);
        /** if cannot find a tabgroup with same name, exit the while loop */
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
    /** update the new name to the corresponding TabGroup */
    tabGroups[index].name = newName;
    /** update the current state and the chrom storage */
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
    /** continue to search for new active tabs */
    this.setInterval();
  };

  /**
   * @description   remove a tab from a tabgroup given its TabGroup name and tab's url
   * @param {string} name   the name of the tabgroup to delete the tab from
   * @param {string} url    the url of the tab
   */
  removeTab = (name, url) => {
    const { tabGroups } = this.state;
    /** find the corresponding tabGroup */
    const index = tabGroups.findIndex((tabGroup) => tabGroup.name === name);
    /** filter out the corresponding tab that has the same url as url passed in */
    tabGroups[index].tabs = tabGroups[index].tabs.filter(
      (tabGroup) => tabGroup.url !== url
    );
    /** update the state and chrome storage */
    this.setState({ tabGroups });
    chrome.storage.sync.set({ tabGroups });
  };

  /**
   * @description   set up a 1000 ms to get new active tabs to render in activeTabs
   */
  setInterval = () => {
    this.state.interval = setInterval(this.getActiveTabs, 1000);
  };

  /**
   * @description   pause to get new active tabs until setInterval being called
   */
  clearInterval = () => {
    clearInterval(this.state.interval);
  };

  /**
   * @description   close the modal when the add group modal is closed
   */
  modalClose = () => {
    this.setState({ addGroupModal: false });
    this.setInterval();
  };

  /**
   * @description   render the menu
   * @returns {*}
   */
  render() {
    /** Add those to the current state
     * addGroupModel: decide whether the add group modal pop oopen or not
     * activeTabs: the tabs being active currently on chrome browser
     * tabGroups: the tabGroups the user has created
     * savedTabs: the tabs being closed when focus mode is launched
     */
    const { addGroupModal, activeTabs, tabGroups, savedTabs } = this.state;
    return (
      <div className="container-fluid maxHeight">
        <div className="row maxHeight">
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 leftSideBar maxHeight">
            <div className="activeTabsContainer">
              <div className="activeTabsHeader">
                <h2>Active Tabs</h2>
              </div>
              <div
                id="activeTabs"
                className="activeTabs"
                droppable="false" /** notify the drag drop algoithm that activeTabs is not droppable */
                onDrop={this.drop}
                onDragOver={this.dragOver}
              >
                {activeTabs.map((tab) => (
                  <Tab  /** display each tab in the activeTabs */
                    title={tab.title}
                    url={tab.url}
                    stored="activeTabs"
                    favIconUrl={tab.favIconUrl}
                  />
                ))}
              </div>
            </div>
            {savedTabs.length !== 0 ? (
              <div className="savedTabsContainer">
                <div className="savedTabsHeader">
                  <h2>Saved Tabs</h2>
                  <button /** the user may delete all the saved tabs */
                    type="button"
                    className="btn btn-primary savedTabsDeleteButton"
                    onClick={this.deleteSavedTabs}
                  >
                    Delete All
                  </button>
                  <button /** the user may also open all the saved tabs */
                    type="button"
                    className="btn btn-primary savedTabsOpenButton"
                    onClick={this.openSavedTabs}
                  >
                    Open All
                  </button>
                </div>
                <div className="savedTabs">
                  {savedTabs.map((tab) => (
                    <Tab /** display all the tabs being closed after focus mode launched */
                      title={tab.title}
                      url={tab.url}
                      stored="activeTabs"
                      favIconUrl={tab.favIconUrl}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-6 col-sm-8 col-md-9 col-lg-10 content maxHeight">
            <div className="tabGroupsContainer">
              <div className="tabGroupsHeader">
                <h2>Tab Groups</h2>
              </div>
              <div className="tabGroups">
                {tabGroups.map((tabGroup) => (
                  <TabGroup
                    view="menu"
                    key={
                      tabGroup.trackid
                    } /** track the tabgrouop by trackid which unique to each tabgroup */
                    trackid={tabGroup.trackid} /** trackid assignmemnt */
                    name={tabGroup.name}
                    tabs={tabGroup.tabs}
                    deleteGroup={this.deleteGroup}
                    editGroup={this.editGroup}
                    removeTab={this.removeTab}
                    drop={this.drop}
                    dragOver={this.dragOver}
                  />
                ))}
              </div>
            </div>
            <button
              className="addGroup"
              type="button"
              /** add a group then we set the addGroupModal to be true */
              onClick={() => {
                this.setState({ addGroupModal: true });
              }}
              data-testid="add-button" /** for testing purposes */
            >
              <IoMdAddCircle />
            </button>
          </div>
        </div>
        /** this modal is opened when the user is attempting to add a new tabgroup */
        <Modal
          show={addGroupModal}
          onHide={this.modalClose}
          onShow={this.clearInterval} /** stop refreshing for new active tab */
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a New tabGroup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={this.addGroup}
              data-testid="form" /** for testing purpose */
            >
              <Form.Group controlId="groupName">
                <Form.Label>Group Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Group Name..." />
              </Form.Group>
              <Form.Group controlId="selectedTabs">
                <Form.Label>Add Tabs to tabGroup</Form.Label>
                <Form.Control as="select" multiple>
                  {activeTabs.map((tab) => (
                    /** user may select each tab to add into the created tabrgoup */
                    <option key={uuid()}>{tab.title}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                onClick={
                  this.addGroup
                } /** run addGroup when user clicks submit */
              >
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
