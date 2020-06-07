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
 * A class to represent TabGroup components
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
  /* istanbul ignore next */
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

    TabGroup.defaultProps = {
      deleteGroup: () => {},
      editGroup: () => {},
      removeTab: () => {},
      drop: () => {},
      dragOver: () => {},
      displayFocusMode: () => {},
    };

    this.state = {
      editMode: false,
      // eslint-disable-next-line react/destructuring-assignment
      newName: this.props.name,
    };
  }

  /**
   * The display of the current TabGroup once focuemode is launched
   */
  onFocusModeClick = () => {
    const { name, tabs, displayFocusMode } = this.props;
    displayFocusMode(
      name,
      tabs.map((tab) => tab.url)
    );
  };

  /**
   * Change the state of making the TabGroup editable
   */
  toggleEdit = () => {
    this.setState({ editMode: true });
  };

  /**
   * How the TabGroup is rendered
   *
   * @returns {*}
   */
  render() {
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
    const { editMode, newName } = this.state;
    return (
      <Card
        data-testid="tab-group"
        id={trackid}
        onDrop={drop}
        onDragOver={dragOver}
        droppable="true"
      >
        <Card.Header as="h5" droppable="false">
          {editMode ? (
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
                  this.setState({ editMode: false });
                }
              }}
            />
          ) : (
            <strong>{name}</strong>
          )}

          <div className="buttonGroup">
            {view === 'menu' ? (
              <div>
                <button
                  type="button"
                  onClick={() => deleteGroup(trackid)}
                  data-testid="delete-button"
                >
                  <RiDeleteBinLine />
                </button>
                <button
                  type="button"
                  onClick={this.toggleEdit}
                  data-testid="edit-button"
                >
                  <GrEdit />
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-testid="focus-button"
                onClick={this.onFocusModeClick}
              >
                <img
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
