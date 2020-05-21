import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TabGroup.css';
import Card from 'react-bootstrap/Card';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';
import { v4 as uuid } from 'uuid';
import Tab from './Tab';

const drop = (e) => {
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

const dragOver = (e) => {
  e.preventDefault();
};

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
      startFocusMode: PropTypes.func,
      view: PropTypes.string.isRequired,
    };

    TabGroup.defaultProps = {
      deleteGroup: () => {},
      editGroup: () => {},
      startFocusMode: () => {},
    };

    this.state = {
      editMode: false,
      newName: '',
    };
  }

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
      startFocusMode,
    } = this.props;
    const { editMode, newName } = this.state;
    return (
      <div data-testid="tab-group">
        <Card>
          <Card.Header as="h5">
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
                    editGroup(name, newName);
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
                  onClick={() => startFocusMode()}
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
            <Card.Body
              id={uuid()}
              onDrop={drop}
              onDragOver={dragOver}
              droppable="true"
            >
              {tabs.map((tab) => (
                <Tab title={tab.title} url={tab.url} key={uuid()} />
              ))}
            </Card.Body>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default TabGroup;
