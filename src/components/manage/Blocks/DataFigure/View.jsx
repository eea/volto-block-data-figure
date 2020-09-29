/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import { useState } from 'react';

import './less/public.less';
import Png from './Png';
import PropTypes from 'prop-types';
import { Transition, Button, Divider } from 'semantic-ui-react';
import replaceSVG from '@plone/volto/icons/replace.svg';
import { Icon } from '@plone/volto/components';
import React from 'react';
import Svg from './Svg';
import Table from './Table';

/**
 * View block class.
 * @class View
 * @extends Component
 */
class View extends React.Component {
  state = {
    visible: true,
  }

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }));

  render() {
    const { visible } = this.state;
    const { data, detached } = this.props;
    return this.props.data.url?.includes('.svg') ? (
      <div>
        <Transition.Group visible={visible} animation='horizontal flip' duration={500} unmountOnHide={false}>
          {visible && (<div>
            <Svg data={data} detached={detached} />
          </div>)}
          {!visible && (<div style={{ width: '100%', height: '500px', overflowY: 'scroll' }}>
            <Table data={data} detached={detached} />
          </div>)}

        </Transition.Group>
        <Divider hidden />
        <Button icon={<Icon name={replaceSVG} />} size='small' onClick={this.toggleVisibility} style={{ marginLeft: '50%' }} />
      </div>
    ) : (
        <Png data={data} detached={detached} />
      );
  };
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
