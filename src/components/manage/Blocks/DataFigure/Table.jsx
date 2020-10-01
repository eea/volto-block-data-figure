/**
 * Table image block.
 * @module components/manage/Blocks/DataFigure/Svg
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Svg block class.
 * @class Svg
 * @extends Component
 */
const Table = ({ data }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data.metadata,
      }}
    />
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Table.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Table;
