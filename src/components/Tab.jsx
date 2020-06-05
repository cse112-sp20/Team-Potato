/**
 * @fileOverview This file contains Tab object and along side with its
 *               functionalities, including drag, click, and render
 *
 * @author      David Dai
 * @author      Gary Chew
 * @author      Chau Vu
 * @author      Fernando Vazquez
 *
 * @requires    NPM: react, prop-types, uuid, react-bootstrap
 * @requires    ../styles/Tab.css
 */

import React from 'react';
import '../styles/Tab.css';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * A class to represent Tab components
 * @class
 */
class Tab extends React.Component {
  /**
   * @constructor
   *
   * @property  title:      the title of the website
   * @property  url:        the url of the website
   * @property  stored:     the location where this tab is currently attached
   * @property  favIconUrl: the url for the favicon
   */
  constructor(props) {
    super(props);
    Tab.propTypes = {
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      stored: PropTypes.string.isRequired,
      favIconUrl: PropTypes.string,
      groupName: PropTypes.string,
      removeTab: PropTypes.func,
    };
    Tab.defaultProps = {
      favIconUrl: '',
      groupName: '',
      removeTab: () => {},
    };
  }

  /**
   * Get the information when the tab start to be dragged
   * @param  {Tab} e   the tab that is being dragged
   */
  dragStart = (e) => {
    e.persist();
    /** pass information to drop in menu.jsx as JSON */
    const { title, url, favIconUrl, groupName, removeTab, stored } = this.props;
    const tabObj = {
      title,
      url,
      favIconUrl,
      groupName,
      removeTab,
      id: e.target.id,
      stored,
    };
    e.dataTransfer.setData('text', JSON.stringify(tabObj));
    /** to have the tab showing before dragged to a confirmed location */
    setTimeout(() => {
      e.target.style.display = 'always';
    }, 0);
  };

  /**
   *  prevents propagation of the same event from being called
   *  @param   {Tab} e   the tab that is being dragged
   */
  dragOver = (e) => {
    e.stopPropagation();
  };

  /**
   * Open the link url attached to the Tab
   * @param     {string} link   the url of the Tab
   */
  openTab = (link) => {
    /** opens the link in a new window */
    window.open(link, '_blank');
  };

  /**
   * Returns the website name attached in a url
   * @param     {string} link   the url of the Tab
   * @returns   {string|null|*}   the host website or null if url is not given
   */
  getWebsite = (link) => {
    if (!link || link === '') return null;
    /** split the url path by '/' */
    const path = link.split('/');
    /** differentiate the website protocol and host */
    const protocol = path[0];
    const host = path[2];
    /** check if the host is part of www */
    if (host.search('www.') !== -1) {
      /** if so, return the host name without the extension */
      return host.substr(host.search('www.') + 4);
    }
    /** check if the protocol is not https */
    if (protocol.search('https') === -1) {
      /** if so, return the protocol concatenated with the host */
      return `${protocol}//${host}`;
    }
    /** if all checks fail, just return the host */
    return host;
  };

  /**
   * Returns the tooltip with the full url name and host website
   *
   * @param     {string} title  the full url title name
   * @param     {string} url   the url of the Tab
   *
   * @returns {*} tooltip with full Tab name and host website
   */
  renderTooltip(title, url) {
    return (
      <Tooltip id="button-tooltip">
        <b>{title}</b>
        <br />
        {this.getWebsite(url)}
      </Tooltip>
    );
  }

  /**
   * How the Tab is rendered
   *
   * @returns {*}
   */
  render() {
    const { title, url, favIconUrl, groupName, removeTab } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
      <OverlayTrigger
        placement="bottom"
        overlay={this.renderTooltip(title, url)}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
        <div
          id={uuid()}
          role="button"
          className="tabContainer"
          draggable="true"
          key={url}
          onDragStart={this.dragStart}
          onDragOver={this.dragOver}
          data-testid="tab-container"
        >
          <p className="tabTitle" onClick={() => this.openTab(url)}>
            {favIconUrl !== '' && (
              <img
                className="tabFavIcon"
                src={favIconUrl}
                alt="favicon"
                height="16"
                width="16"
              />
            )}
            {title}
          </p>
          <div
            className="closeButton"
            onClick={() => removeTab(groupName, url)}
          >
            {groupName !== '' && <p>x</p>}
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}

export default Tab;
