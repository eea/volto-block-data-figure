/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import React from 'react';
import { connect } from 'react-redux';
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
import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import {
  isSVGImage,
  isTableImage,
  getBlockPosition,
  setImageSize,
  isInternalContentURL,
} from '@eeacms/volto-block-data-figure/helpers';
import { getInternalContent } from '@eeacms/volto-block-data-figure/actions';
import spreadsheetSVG from '@plone/volto/icons/spreadsheet.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import zoomSVG from '@plone/volto/icons/zoom-in.svg';
import infoSVG from '@plone/volto/icons/info.svg';
import applicationSVG from '@plone/volto/icons/application.svg';
import downloadSVG from '@plone/volto/icons/download.svg';
import Metadata from './Metadata';
import Svg from './Svg';
import DownloadData from './DownloadData';
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
    showDownload: false,
    position: 0,
    scaledImage: '',
  };

  hideMetadata = () => {
    this.setState(() => ({
      showMetadata: false,
    }));
  };

  hideDownload = () => {
    this.setState(() => ({
      showDownload: false,
    }));
  };

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));

  toggleMetadata = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState((prevState) => ({
      showDownload: false,
      showMetadata: !prevState.showMetadata,
    }));
  };

  internalURLContents = async (block = this.props.id, url) => {
    await this.props.getInternalContent(block, flattenToAppURL(url));
  };

  toggleLeftPopup = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState((prevState) => ({
      showMetadata: false,
      showDownload: !prevState.showDownload,
    }));
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props?.data?.url !== nextProps?.data?.url &&
      isInternalContentURL(nextProps?.data?.url)
    ) {
      this.internalURLContents(nextProps?.id, nextProps?.data?.url);
    }

    if (this.props?.scales !== nextProps?.scales) {
      const scaledImage =
        this.props?.data?.url && nextProps?.scales
          ? setImageSize(
              this.props?.data?.url,
              nextProps.scales,
              this.props?.data?.align === 'full' ? 'h' : this.props?.data?.size,
            )
          : '';
      this.setState({
        scaledImage,
      });
    }
  }

  componentDidMount() {
    if (this.props?.data?.url && isInternalContentURL(this.props?.data?.url)) {
      this.internalURLContents(this.props.id, this.props?.data?.url);
    }
  }

  render() {
    const {
      visible,
      showMetadata,
      showDownload,
      modalOpen,
      zoomed,
    } = this.state;
    const { data, detached } = this.props;
    const { scaledImage } = this.state;

    const imageUrl = flattenToAppURL(scaledImage?.download);

    // Block position in page
    const position = getBlockPosition(
      this.props.metadata || this.props.properties,
      this.props.id,
    );

    const is_flipped = isTableImage(data?.url || '') || visible;

    return data.url && __CLIENT__ ? (
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
                    <Svg
                      data={data}
                      detached={detached}
                      id={this.props.id}
                      scales={scaledImage}
                    />
                  ) : (
                    <img
                      className={cx({ 'full-width': data.align === 'full' })}
                      loading="lazy"
                      style={{
                        width: data.width ? data.width + 'px' : '100%',
                        height: data.height ? data.height + 'px' : '100%',
                        marginLeft:
                          data.inLeftColumn && data.width
                            ? `-${parseInt(data.width) + 10}px`
                            : '0',
                        marginRight: data.inLeftColumn ? '0!important' : '1rem',
                      }}
                      src={isTableImage(data.url) ? data.url : imageUrl}
                      alt={data.title || ''}
                      width={scaledImage?.width}
                      height={scaledImage?.height}
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
            data={data}
            visible={showMetadata}
            onHide={this.hideMetadata}
          />
          <DownloadData
            data={data}
            visible={showDownload}
            onHide={this.hideDownload}
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
                    loading="lazy"
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

export default connect(
  (state, ownProps) => ({
    screen: state?.screen,
    scales: state.content?.subrequests?.[ownProps.id]?.data?.image,
  }),
  { getInternalContent },
)(View);
