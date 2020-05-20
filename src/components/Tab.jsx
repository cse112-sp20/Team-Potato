import React from 'react';
import '../styles/Tab.css';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

const dragStart = (e) => {
  const { target } = e;
  console.log(e);
  console.log(target);
  console.log(target.id);
  e.dataTransfer.setData('id', target.id);
  setTimeout(() => {
    target.style.display = 'none';
  }, 0);
};

const dragOver = (e) => {
  e.stopPropagation();
};

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
    <div
      id={title}
      draggable="true" // true
      onDragStart={dragStart}
      onDragOver={dragOver}
    >
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
      {props.children}
    </div>
  );
};

export default Tab;
