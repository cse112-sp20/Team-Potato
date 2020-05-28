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
      favIconUrl: PropTypes.string,
    };
    Tab.defaultProps = {
      favIconUrl: '',
    };
  }

  dragStart = (e) => {
    e.persist();
    const { title, url, favIconUrl } = this.props;
    const tabObj = { title, url, favIconUrl, id: e.target.id };
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
    const { title, url, favIconUrl } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
      <OverlayTrigger
        placement="bottom"
        overlay={this.renderTooltip(title, url)}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
        <div
          role="button"
          className="tabContainer"
          draggable="true"
          key={url}
          onClick={() => this.openTab(url)}
          onDragStart={this.dragStart}
          onDragOver={this.dragOver}
          data-testid="tab-container"
        >
          <p className="tabTitle">
            {favIconUrl != '' && (
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
        </div>
      </OverlayTrigger>
    );
  }
}

export default Tab;
