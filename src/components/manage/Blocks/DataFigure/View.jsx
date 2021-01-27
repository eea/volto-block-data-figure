/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import cx from 'classnames';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Popup,
  Sidebar,
  Container,
  Transition,
  Modal,
  Header,
} from 'semantic-ui-react';
import { isSVGImage } from '@eeacms/volto-block-data-figure/helpers';
import Svg from './Svg';
import spreadsheetSVG from '@plone/volto/icons/spreadsheet.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import zoomSVG from '@plone/volto/icons/zoom-in.svg';
import infoSVG from '@plone/volto/icons/info.svg';
import applicationSVG from '@plone/volto/icons/application.svg';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon } from '@plone/volto/components';
import Metadata from './Metadata';
import DownloadData from './DownloadData';
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
    modalOpen: false,
    zoomed: 'false',
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
    const {
      visible,
      showMetadata,
      isLeftClicked,
      modalOpen,
      zoomed,
    } = this.state;
    const { data, detached } = this.props;
    return data.url ? (
      <div style={{ paddingTop: '25px' }}>
        {data.title && <Header>{data.title}</Header>}
        <Sidebar.Pushable as={Container}>
          <Sidebar.Pusher style={{ height: '100%' }}>
            <div className="scene scene--card">
              <div className={`card ${visible ? ' is-flipped' : ''}`}>
                <div className="card__face card__face--front">
                  {isSVGImage(data.url) ? (
                    <Svg data={data} detached={detached} />
                  ) : (
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
                      src={`${data.url}/@@images/image`}
                      alt={data.title || ''}
                    ></img>
                  )}
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
          <Transition visible={modalOpen} animation="scale" duration={300}>
            <Modal
              style={{ width: 'unset' }}
              open={modalOpen}
              onClose={() =>
                this.setState({ modalOpen: false, zoomed: 'false' })
              }
            >
              <Modal.Content image>
                {visible ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.table,
                    }}
                  />
                ) : isSVGImage(data.url) ? (
                  <Svg data={data} detached={detached} />
                ) : (
                  <img
                    aria-hidden="true"
                    className={cx({ 'full-width': data.align === 'full' })}
                    zoomed={zoomed}
                    style={{ maxHeight: '80vh', maxWidth: '100%' }}
                    src={`${data.url}/@@images/image`}
                    onClick={() => this.setState({ zoomed: 'true' })}
                    alt={data.alt || ''}
                  ></img>
                )}
              </Modal.Content>
            </Modal>
          </Transition>
        </Sidebar.Pushable>
        <Divider hidden />
        <Button.Group className="metadata-btn-group" basic>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button
                icon
                onClick={this.toggleVisibility}
                className="data-figure-control"
              >
                {visible ? (
                  <Icon name={imageSVG} size="24px" />
                ) : (
                  <Icon name={spreadsheetSVG} size="24px" />
                )}
              </Button>
            }
            position="top center"
          >
            {visible ? 'data figure' : 'data table'}
          </Popup>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button
                icon
                onClick={this.toggleMetadata}
                className="data-figure-control"
              >
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
              <a
                href={data.href}
                target={data.openLinkInNewTab ? '_blank' : '_self'}
              >
                <Button icon className="data-figure-control">
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
              <Button
                icon
                onClick={this.toggleLeftPopup}
                className="data-figure-control"
              >
                <Icon name={downloadSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            download data
          </Popup>
          <Popup
            className="popup-wrap"
            inverted
            trigger={
              <Button
                icon
                className="data-figure-control"
                onClick={() =>
                  this.setState({ modalOpen: true, zoomed: 'true' })
                }
              >
                <Icon name={zoomSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            enlarge
          </Popup>
        </Button.Group>
      </div>
    ) : null;
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
