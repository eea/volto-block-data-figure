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
import infoSVG from '@plone/volto/icons/info.svg';
import applicationSVG from '@plone/volto/icons/application.svg';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon } from '@plone/volto/components';
import Metadata from './Metadata';
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
  };

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));

  toggleMetadata = () =>
    this.setState((prevState) => ({ showMetadata: !prevState.showMetadata }));

  render() {
    const { visible, showMetadata } = this.state;
    const { data, detached } = this.props;
    return this.props.data.url?.includes('.svg') ? (
      <div>
        <Sidebar.Pushable as={Container}>
          <Sidebar.Pusher style={{ height: '100%' }}>
            <div className="scene scene--card">
              <div className={`card ${visible ? ' is-flipped' : ''}`}>
                <div className="card__face card__face--front">
                  <a
                    href={data.href}
                    target={data.openLinkInNewTab && '_blank'}
                  >
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
                  </a>
                </div>
                <div className="card__face card__face--back">
                  <Table data={data} />
                </div>
              </div>
            </div>
          </Sidebar.Pusher>
          <Metadata visible={showMetadata} data={data} />
        </Sidebar.Pushable>
        <Divider hidden />
        <Button.Group style={{ margin: '0 50%' }} widths={16}>
          <Popup
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
            trigger={
              <Button icon>
                <Icon name={applicationSVG} size="24px" />
              </Button>
            }
            position="top center"
          >
            application
          </Popup>
          <Popup
            trigger={
              <Button icon>
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
