/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Transition, Modal, Header } from 'semantic-ui-react';

import {
  isSVGImage,
  isTableImage,
  getBlockPosition,
  isInternalContentURL,
  flattenToContentURL,
  isChartImage,
} from '@eeacms/volto-block-data-figure/helpers';

import MoreInfo from './MoreInfo';
import Share from './Share';
import Sources from './Sources';
import FigureNote from './FigureNote';
import Svg from './Svg';

import DownloadData from './DownloadData';
import React from 'react';
import { connect } from 'react-redux';
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
    modalOpen: false,
    zoomed: 'false',
    showDownload: false,
    position: 0,
    mobile: false,
    showTable: false,
    ref: React.createRef(),
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.screen !== this.props.screen) {
      const visWidth = this.state.ref?.current?.parentElement?.offsetWidth;

      if (visWidth < 600 && !this.state.mobile) {
        this.setState({ mobile: true });
      } else if (visWidth >= 600 && this.state.mobile) {
        this.setState({ mobile: false });
      }
    }
  };

  render() {
    const { modalOpen, zoomed } = this.state;
    const { data, detached } = this.props;
    // Block position in page
    const position = getBlockPosition(
      this.props.metadata || this.props.properties,
      this.props.id,
    );
    return data.url ? (
      <div className="data-figure-block">
        {data.title && (
          <Header as="h3" className="subtitle-light">
            Figure {position}. {data.title}
          </Header>
        )}

        <div>
          <div>
            <div>
              {isSVGImage(data.url) ? (
                <Svg data={data} detached={detached} id={this.props.id} />
              ) : data.url && isTableImage(data.url) ? (
                <DataTable data={data} />
              ) : data.url ? (
                <img
                  className={cx({ 'full-width': data.align === 'full' })}
                  loading="lazy"
                  zoomed={zoomed}
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
                    isInternalContentURL(data.url)
                      ? // Backwards compat in the case that the block is storing the full server URL
                        (() => {
                          return isChartImage(data.url)
                            ? `${flattenToContentURL(data.url)}`
                            : `${flattenToContentURL(data.url)}/@@images/image`;
                        })()
                      : data.url
                  }
                  alt={data.title || ''}
                />
              ) : (
                <></>
              )}
            </div>
            <div
              className={cx('data-table-animation', {
                open: this.state.showTable,
              })}
            >
              <DataTable data={data} />
            </div>
          </div>
        </div>

        <Transition visible={modalOpen} animation="scale" duration={300}>
          <Modal
            className="data-figure-zoom"
            open={modalOpen}
            onClose={() => this.setState({ modalOpen: false, zoomed: 'false' })}
          >
            <Modal.Content image className="data-figure-image">
              {isSVGImage(data.url) ? (
                <Svg data={data} detached={detached} />
              ) : data.url && isTableImage(data.url) ? (
                <DataTable data={data} />
              ) : data.url ? (
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
                  src={
                    isInternalContentURL(data.url)
                      ? // Backwards compat in the case that the block is storing the full server URL
                        (() => {
                          return isChartImage(data.url)
                            ? `${flattenToContentURL(data.url)}`
                            : `${flattenToContentURL(data.url)}/@@images/image`;
                        })()
                      : data.url
                  }
                  alt={data.title || ''}
                />
              ) : (
                <></>
              )}
              {this.state.showTable === true && <DataTable data={data} />}
            </Modal.Content>
          </Modal>
        </Transition>

        <div
          className={cx('visualization-toolbar data-figure-toolbar', {
            mobile: this.state.mobile,
          })}
          ref={this.state.ref}
        >
          <div className="left-col">
            {data.figure_note && <FigureNote notes={data.figure_note || []} />}
            {data.data_provenance && (
              <Sources sources={data.data_provenance?.data} />
            )}
            {data.href && <MoreInfo href={data.href} />}
          </div>
          {data?.tabledata && (
            <div className="show-table">
              {!isTableImage(data.url) && (
                <button
                  className={cx('trigger-button')}
                  onClick={() => {
                    this.setState((prevState) => ({
                      showTable: !prevState.showTable,
                    }));
                  }}
                >
                  <i
                    className={
                      this.state.showTable === false
                        ? 'ri-arrow-down-line'
                        : 'ri-arrow-up-line'
                    }
                  />
                  <span>Table</span>
                </button>
              )}
            </div>
          )}
          <div className="right-col">
            {data?.metadata?.downloadData && <DownloadData data={data} />}
            {data.href && <Share href={data.href} />}
            <div className="enlarge">
              <button
                className="trigger-button"
                onClick={() => {
                  this.setState({ modalOpen: true, zoomed: 'true' });
                }}
              >
                <i className="ri-fullscreen-line" />
                Enlarge
              </button>
            </div>
          </div>
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
