/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */
import './less/public.less';
import Png from './Png';
import PropTypes from 'prop-types';
import React from 'react';
import Svg from './Svg';
/**
 * View block class.
 * @class View
 * @extends Component
 */
const View = ({ data, detached }) => {
  return data.url?.includes('.svg') ? (
    <Svg data={data} detached={detached} />
  ) : (
    <Png data={data} detached={detached} />
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
