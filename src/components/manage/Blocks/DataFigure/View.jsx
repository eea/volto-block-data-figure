/**
 * View block.
 * @module components/manage/Blocks/DataFigure/View
 */

import Png from './Png';
import PropTypes from 'prop-types';
import ViewBoX from '@eeacms/volto-image-zoom-and-flip/ImageBlock/View';
import React from 'react';

/**
 * View block class.
 * @class View
 * @extends Component
 */
const View = ({ data, detached }) => {
  return data.url?.includes('.svg') ? (
    <ViewBoX data={data} />
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
