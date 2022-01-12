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
import {
  isSVGImage,
  isTableImage,
  getBlockPosition,
} from '@eeacms/volto-block-data-figure/helpers';
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
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import DataTable from './Table';
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
    position: 0,
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

    const scale_range =
      config.blocks.blocksConfig['dataFigure'].imageScaleRanges;
    const imageScale = config.blocks.blocksConfig['dataFigure'].imageScale;
    const page_width = this.props.screen?.page?.width || 1300;
    const scale = Object.keys(scale_range).filter(
      (value) => value > page_width,
    )[0];
    const scale_name = scale_range[scale];
    const imageUrl =
      '@@images/image' + (imageScale === 'original' ? '' : '/' + scale_name);

    // Block position in page
    const position = getBlockPosition(
      this.props.metadata || this.props.properties,
      this.props.id,
    );

    const is_flipped = isTableImage(data?.url || '') || visible;

    return data.url ? (
      <div className="data-figure-block">
        {data.title && (
          <Header>
            Figure {position}. {data.title}
          </Header>
        )}
        <Sidebar.Pushable as={Container}>
          <Sidebar.Pusher style={{ height: '100%' }}>
            <div className="scene scene--card">
              <div className={`card ${is_flipped ? ' is-flipped' : ''}`}>
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
                      src={
                        isTableImage(data.url)
                          ? data.url
                          : `${data.url}/${imageUrl}`
                      }
                      alt={data.title || ''}
                    ></img>
                  )}
                </div>
                <div className="card__face card__face--back">
                  <DataTable data={data} />
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
              className="data-figure-zoom"
              open={modalOpen}
              onClose={() =>
                this.setState({ modalOpen: false, zoomed: 'false' })
              }
            >
              <Modal.Content image className="data-figure-image">
                {is_flipped ? (
                  <DataTable data={data} />
                ) : isSVGImage(data.url) ? (
                  <Svg data={data} detached={detached} />
                ) : (
                  <img
                    aria-hidden="true"
                    className={cx({ 'full-width': data.align === 'full' })}
                    zoomed={zoomed}
                    style={{ maxHeight: '80vh', maxWidth: '100%' }}
                    src={
                      isTableImage(data.url)
                        ? data.url
                        : `${data.url}/${imageUrl}`
                    }
                    onClick={() => this.setState({ zoomed: 'true' })}
                    alt={data.alt || ''}
                  ></img>
                )}
              </Modal.Content>
            </Modal>
          </Transition>
        </Sidebar.Pushable>
        <Divider hidden />
        <div className="metadata-btn-group">
          <Button.Group basic>
            <Popup
              className="popup-wrap"
              inverted
              trigger={
                <Button
                  icon
                  disabled={!data.tabledata || isTableImage(data?.url || '')}
                  onClick={this.toggleVisibility}
                  className="data-figure-control"
                >
                  {is_flipped ? (
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
                  disabled={!Object.keys(data?.metadata || {}).length}
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
                  href={data?.href ? data.href : null}
                  target={data.openLinkInNewTab ? '_blank' : '_self'}
                >
                  <Button
                    icon
                    className="data-figure-control"
                    disabled={!data.href}
                  >
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
                  disabled={!data?.metadata?.downloadData}
                  onClick={this.toggleLeftPopup}
                  className="data-figure-control"
                >
                  <Icon name={downloadSVG} size="24px" />
                </Button>
              }
              position="top center"
            >
              download
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

export default connect((state, ownProps) => ({
  screen: state?.screen,
}))(View);
