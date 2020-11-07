/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import Png from './Png';
import cx from 'classnames';
import { settings } from '@plone/volto/config';
import PropTypes from 'prop-types';
import { Button, Divider, Popup, Sidebar, Container } from 'semantic-ui-react';
import spreadsheetSVG from '@plone/volto/icons/spreadsheet.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import zoomSVG from '@plone/volto/icons/zoom-in.svg';
import showSVG from '@plone/volto/icons/show.svg';
import infoSVG from '@plone/volto/icons/info.svg';
import applicationSVG from '@plone/volto/icons/application.svg';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon } from '@plone/volto/components';
import Metadata from './Metadata';
import DownloadData from './DownloadData';
import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';
import Table from './Table';
import './less/public.less';

/**
 * View block class.
 * @class View
 * @extends Component
 */

class View extends React.Component {
  state = {
    visible: false,
    showMetadata: false,

    isLeftClicked: false,
  };

  hideSidebar = () => {
    const { showMetadata, isLeftClicked } = this.state;
    if (showMetadata) {
      this.setState((prevState) => ({
        showMetadata: false,
      }));
    }
    if (isLeftClicked) {
      this.setState((prevState) => ({
        isLeftClicked: false,
      }));
    }
  };

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));

  toggleMetadata = () =>
    this.setState((prevState) => ({
      showMetadata: !prevState.showMetadata,
    }));

  toggleLeftPopup = () =>
    this.setState((prevState) => ({
      isLeftClicked: !prevState.isLeftClicked,
    }));

  render() {
    const { visible, showMetadata, isLeftClicked } = this.state;
    const { data, detached } = this.props;
    return this.props.data.url?.includes('.svg') ? (
      <div>
        <Sidebar.Pushable as={Container}>
          <Sidebar.Pusher style={{ height: '100%' }}>
            <div className="scene scene--card">
              <div className={`card ${visible ? ' is-flipped' : ''}`}>
                <div className="card__face card__face--front">
                  <img
                    className={cx({ 'full-width': data.align === 'full' })}
                    style={{
                      width: data.width ? data.width + 'px' : '100%',
                      height: data.height ? data.height + 'px' : '100%',
                      marginLeft:
                        data.inLeftColumn && data.width
                          ? `-${parseInt(data.width) + 10}px`
                          : '0',
                      marginRight: data.inLeftColumn ? '0!important' : '1rem',
                    }}
                    src={
                      data.url.includes(settings.apiPath)
                        ? `${flattenToAppURL(data.url)}/@@images/image`
                        : data.url
                    }
                    alt={data.alt || ''}
                  ></img>
                  <div class="overlay">
                    <Button.Group basic className="text">
                      <Popup
                        className="popup-wrap"
                        trigger={
                          <Button icon onClick={this.toggleLeftPopup}>
                            <Icon name={saveSVG} size="24px" />
                          </Button>
                        }
                        position="top center"
                      >
                        save
                      </Popup>
                      <Popup
                        className="popup-wrap"
                        trigger={
                          <a
                            href={data.figureUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <Button icon>
                              <Icon name={showSVG} size="24px" />
                            </Button>
                          </a>
                        }
                        position="top center"
                      >
                        explore
                      </Popup>
                      <Popup
                        className="popup-wrap"
                        trigger={
                          <a href={data.url} rel="noreferrer" target="_blank">
                            <Button icon>
                              <Icon name={zoomSVG} size="24px" />
                            </Button>
                          </a>
                        }
                        position="top center"
                      >
                        enlarge
                      </Popup>
                    </Button.Group>
                  </div>
                </div>
                <div className="card__face card__face--back">
                  <Table data={data} />
                </div>
              </div>
            </div>
          </Sidebar.Pusher>
          <Metadata
            visible={showMetadata}
            data={data}
            hideSidebar={this.hideSidebar}
          />
          <DownloadData
            data={data}
            isLeftClicked={isLeftClicked}
            hideSidebar={this.hideSidebar}
          />
        </Sidebar.Pushable>
        <Divider hidden />
        <Button.Group className="metadata-btn-group">
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button icon onClick={this.toggleVisibility}>
                <Icon name={spreadsheetSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            data table
          </Popup>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button icon onClick={this.toggleMetadata}>
                <Icon name={infoSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            metadata
          </Popup>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <a href={data.href} target={data.openLinkInNewTab && '_blank'}>
                <Button icon>
                  <Icon name={applicationSVG} size="24px" />
                </Button>
              </a>
            }
            position="top center"
          >
            {data.label || <p>Interactive link</p>}
          </Popup>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button icon onClick={this.toggleLeftPopup}>
                <Icon name={downloadSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            download data
          </Popup>
        </Button.Group>
      </div>
    ) : (
      <Png data={data} detached={detached} />
    );
  }
}
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
