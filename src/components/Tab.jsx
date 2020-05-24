import React from 'react';
import '../styles/Tab.css';
import PropTypes from 'prop-types';

const Tab = (props) => {
  const { title, url } = props;

  Tab.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  };

  function openTab(link) {
    window.open(link, '_blank');
  }

  return (
    <div>
      <button
        type="button"
        className="tablink"
        onClick={() => {
          openTab(url);
        }}
        data-testid="tab-button"
      >
        {title}
      </button>
    </div>
  );
};

export default Tab;
