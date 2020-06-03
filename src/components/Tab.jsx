import React from 'react';
import '../styles/Tab.css';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class Tab extends React.Component {
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

  dragStart = (e) => {
    e.persist();
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
    setTimeout(() => {
      e.target.style.display = 'always';
    }, 0);
  };

  dragOver = (e) => {
    e.stopPropagation();
  };

  openTab = (link) => {
    window.open(link, '_blank');
  };

  getWebsite = (link) => {
    if (!link) return null;
    const path = link.split('/');
    const protocol = path[0];
    const host = path[2];
    if (host.search('www.') !== -1) {
      return host.substr(host.search('www.') + 4);
    }
    if (protocol.search('https') === -1) {
      return `${protocol}//${host}`;
    }
    return host;
  };

  renderTooltip(title, url) {
    return (
      <Tooltip id="button-tooltip">
        <b>{title}</b>
        <br />
        {this.getWebsite(url)}
      </Tooltip>
    );
  }

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
