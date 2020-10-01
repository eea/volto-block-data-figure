/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import './less/public.less';
import Png from './Png';
import cx from 'classnames';
import { settings } from '@plone/volto/config';
import PropTypes from 'prop-types';
import { Button, Divider } from 'semantic-ui-react';
import replaceSVG from '@plone/volto/icons/replace.svg';
import { Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';
import Table from './Table';

/**
 * View block class.
 * @class View
 * @extends Component
 */

class View extends React.Component {
  state = {
    visible: false,
  };

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));

  render() {
    const { visible } = this.state;
    const { data, detached } = this.props;
    return this.props.data.url?.includes('.svg') ? (
      <div>
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
            </div>
            <div className="card__face card__face--back">
              <Table data={data} />
            </div>
          </div>
        </div>
        <Divider hidden />
        <Button
          icon={<Icon name={replaceSVG} />}
          size="small"
          onClick={this.toggleVisibility}
          style={{ marginLeft: '50%' }}
        />
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
