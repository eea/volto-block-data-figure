/**
 * Metadata View.
 * @module components/manage/Blocks/DataFigure/Metadata
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

const DEFAULT_TIMEOUT = 500;
/**
 * Metadata  class.
 * @class Metadata
 * @extends Component
 */
const Metadata = ({ visible }) => {
  return (
    <CSSTransition
      in={visible}
      timeout={DEFAULT_TIMEOUT}
      classNames=""
      unmountOnExit
    >
      <div
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        key="sidebarpopup"
        className="sidebar-container"
        style={{ overflowY: 'auto' }}
      >
        Hello ths is sportal
      </div>
    </CSSTransition>
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Metadata.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Metadata;
