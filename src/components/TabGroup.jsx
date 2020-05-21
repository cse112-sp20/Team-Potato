import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TabGroup.css';
import Card from 'react-bootstrap/Card';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';
import { v4 as uuid } from 'uuid';
import Tab from './Tab';

class TabGroup extends React.Component {
  constructor(props) {
    super(props);

    TabGroup.propTypes = {
      name: PropTypes.string.isRequired,
      tabs: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ).isRequired,
      deleteGroup: PropTypes.func,
      editGroup: PropTypes.func,
      displayFocusMode: PropTypes.func,
      view: PropTypes.string.isRequired,
      drop: PropTypes.func.isRequired,
      dragOver: PropTypes.func.isRequired,
    };

    TabGroup.defaultProps = {
      deleteGroup: () => {},
      editGroup: () => {},
      displayFocusMode: () => {},
    };

    this.state = {
      editMode: false,
      newName: this.props.name,
    };
  }

  onFocusModeClick = () => {
    const { name, tabs, displayFocusMode } = this.props;
    displayFocusMode(
      name,
      tabs.map((tab) => tab.url)
    );
  };

  toggleEdit = () => {
    this.setState({ editMode: true });
  };

  render() {
    const {
      name,
      tabs,
      deleteGroup,
      editGroup,
      view,
      drop,
      dragOver,
    } = this.props;
    const { editMode, newName } = this.state;
    return (
      <Card
        data-testid="tab-group"
        id={uuid()}
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
                    editGroup(name, newName);
                  } else {
                    this.setState({ editMode: false });
                  }
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
                  onClick={() => deleteGroup(name)}
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
              <Tab title={tab.title} url={tab.url} key={uuid()} />
            ))}
          </Card.Body>
        ) : null}
      </Card>
    );
  }
}

export default TabGroup;
