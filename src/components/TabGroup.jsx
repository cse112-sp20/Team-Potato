import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

const TabGroup = (props) => {
  const { name, tabs } = props;

  TabGroup.propTypes = {
    name: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  return (
    <div>
      <Card>
        <Card.Header as="h2">
          <strong>{name}</strong>
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
