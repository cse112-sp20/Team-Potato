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
    };
  }

  dragStart = (e) => {
    e.persist();
    const { title, url } = this.props;
    const tabObj = { title, url, id: e.target.id };
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
    const { title, url } = this.props;
    return (
      <div
        id={uuid()}
        draggable="true"
        onDragStart={this.dragStart}
        onDragOver={this.dragOver}
        className="tablink"
      >
        <OverlayTrigger
          placement="bottom"
          overlay={this.renderTooltip(title, url)}
        >
          <button
            type="button"
            className="button"
            onClick={() => this.openTab(url)}
            data-testid="tab-button"
          >
            {title}
          </button>
        </OverlayTrigger>
      </div>
    );
  }
}

export default Tab;
