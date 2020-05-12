import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TabGroup.css';
import Card from 'react-bootstrap/Card';
import { IoIosTimer } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrEdit } from 'react-icons/gr';

const TabGroup = (props) => {
  const { name, tabs } = props;

  TabGroup.propTypes = {
    name: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
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

            <button type="button">
              <RiDeleteBinLine />
            </button>

            <button type="button">
              <GrEdit />
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          <ul>
            {tabs.map((tab) => (
              <li>{tab}</li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabGroup;
