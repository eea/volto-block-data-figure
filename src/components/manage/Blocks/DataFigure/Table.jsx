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
  return data.metadata ? (
    <div
      dangerouslySetInnerHTML={{
        __html: data.metadata,
      }}
    />
  ) : (
    <div>
      Data table is not directly available for this figure, please consult Data
      sources.
    </div>
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
