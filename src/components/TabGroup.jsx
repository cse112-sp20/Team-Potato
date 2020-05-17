import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TabGroup.css';
import Card from 'react-bootstrap/Card';
import { IoIosTimer } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';
import Tab from './Tab';

const TabGroup = (props) => {
  const { name, tabs, deleteGroup } = props;

  TabGroup.propTypes = {
    name: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    deleteGroup: PropTypes.func.isRequired,
  };

  return (
    <div>
      <Card>
        <Card.Header as="h5">
          <strong>{name}</strong>

          <div className="buttonGroup">
            <button type="button">
              <IoIosTimer />
            </button>

            <button type="button" onClick={() => deleteGroup(name)}>
              <RiDeleteBinLine />
            </button>

            <button type="button">
              <GrEdit />
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          {tabs.map((tab) => (
            <Tab title={tab.title} url={tab.url} key={tab.title} />
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabGroup;
