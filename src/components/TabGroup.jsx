/**
 * @fileOverview This file is for TabGroup object which is used to contain the
 *               Tab components. Here includes TabGroup constructor, starting
 *               focus mode click, and render.
 *
 * @author      David Dai
 * @author      Gary Chew
 * @author      Chau Vu
 * @author      Fernando Vazquez
 *
 * @requires    NPM: react, prop-types, react-bootstrap, react-icons
 * @requires    ../styles/TabGroup.css
 * @requires    ./Tab
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';
import { v4 as uuid } from 'uuid';
import Tab from './Tab';
import '../styles/TabGroup.css';

/**
 * @description   A class to represent TabGroup components
 * @class
 */
class TabGroup extends React.Component {
  /**
   * @constructor
   *
   * @property  {string} name       the title of the TabGroup
   * @property  {string} trackid    the unique id of the TabGroup to keep track
   * @property  {string}  view      the location of where the TabGroup is shown
   * @property  {Array} tabs        the array of tabs stored under this TabGroup
   * @property  {function}  deleteGroup       Delete the current TabGroup
   * @property  {function}  editGroup         Rename the current TabGroup
   * @property  {function}  displayFocusMode  Display current TabGroup during focue mode
   * @property  {function}  drop              Drop a tab in the target TabGroup
   * @property  {function}  dragOver          Drag the selected tab from the TabGroup
   *
   */
  constructor(props) {
    super(props);
    TabGroup.propTypes = {
      name: PropTypes.string.isRequired,
      trackid: PropTypes.string.isRequired,
      view: PropTypes.string.isRequired,
      tabs: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          stored: PropTypes.string.isRequired,
          favIconUrl: PropTypes.string,
        })
      ).isRequired,
      deleteGroup: PropTypes.func,
      editGroup: PropTypes.func,
      removeTab: PropTypes.func,
      displayFocusMode: PropTypes.func,
      drop: PropTypes.func,
      dragOver: PropTypes.func,
    };
    /** default function properties definition */
    TabGroup.defaultProps = {
      deleteGroup: () => {},
      editGroup: () => {},
      removeTab: () => {},
      drop: () => {},
      dragOver: () => {},
      displayFocusMode: () => {},
    };
    /** set the current default states
     * @type  {boolean} editMode: decide whether the tabgroup name is changable
     * @type   {string} newName:  the new name to assign to the tabgroup
     * */
    this.state = {
      editMode: false,
      // eslint-disable-next-line react/destructuring-assignment
      newName: this.props.name,
    };
  }

  /**
   * @description:  The display of the current TabGroup once focuemode is launched
   */
  onFocusModeClick = () => {
    const { name, tabs, displayFocusMode } = this.props;
    displayFocusMode(
      name,
      tabs.map((tab) => tab.url)
    );
  };

  /**
   * @description:  Change the state of making the TabGroup editable
   */
  toggleEdit = () => {
    this.setState({ editMode: true });
  };

  /**
   * @description:  How the TabGroup is rendered
   *
   * @returns {*}
   */
  render() {
    /** add the following to the props
     * name: the name of the tabgroup
     * trackid: uuid for each tabgroup
     * deleteGroup: function to delete a tabgroup
     * editGroup: function to rename a tabgroup
     * removeTab: function to remove a tabgroup
     * view: the location of where the tabgroup is shown
     * drop: function to drop a tab into the tabgroup
     * dragOver: function to drag a tab over
     */
    const {
      name,
      trackid,
      tabs,
      deleteGroup,
      editGroup,
      removeTab,
      view,
      drop,
      dragOver,
    } = this.props;
    /** set the following to the state
     *  editMode: whether the name is changable or not
     *  newName: the new name for the tabgroup
     */
    const { editMode, newName } = this.state;
    return (
      <Card
        data-testid="tab-group" /** for unit testing */
        id={trackid}
        onDrop={drop}
        onDragOver={dragOver}
        droppable="true"
      >
        <Card.Header as="h5" droppable="true" id={name}>
          {editMode ? (
            /** if enters editMode */
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              defaultValue={name}
              onChange={(e) => {
                this.setState({ newName: e.target.value });
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (name !== newName) {
                    editGroup(trackid, newName);
                  }
                  /** change state so the page will render */
                  this.setState({ editMode: false });
                }
              }}
            />
          ) : (
            <div>
              <strong>{name}</strong>
              {view === 'menu' ? (
                <button
                  /** delete group button */
                  type="button"
                  onClick={this.toggleEdit}
                  data-testid="edit-button"
                >
                  <GrEdit />
                </button>
              ) : null}
            </div>
          )}

          <div className="buttonGroup">
            {view === 'menu' ? (
              <div>
                <button
                  /** delete group button */
                  className="deleteButton"
                  type="button"
                  onClick={() => deleteGroup(trackid)}
                  data-testid="delete-button"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            ) : (
              /** view that is not on the menu, which means on the popup */
              <button
                className="focusButton"
                type="button"
                data-testid="focus-button"
                onClick={this.onFocusModeClick}
              >
                <img
                  /** this is the start green triangle image source */
                  src="https://icons.iconarchive.com/icons/icons-land/vista-multimedia/256/Play-1-Hot-icon.png"
                  alt="start-button"
                  width="25px"
                  height="25px"
                />
              </button>
            )}
          </div>
        </Card.Header>
        {view === 'menu' ? (
          /** inside the menu, where the tabs being drag and droppable in respect to tabgroups */
          <Card.Body id={name} droppable="true">
            {tabs.map((tab) => (
              <Tab
                title={tab.title}
                url={tab.url}
                favIconUrl={tab.favIconUrl}
                groupName={name}
                removeTab={removeTab}
                key={uuid()}
                stored={trackid}
              />
            ))}
          </Card.Body>
        ) : null}
      </Card>
    );
  }
}

export default TabGroup;
