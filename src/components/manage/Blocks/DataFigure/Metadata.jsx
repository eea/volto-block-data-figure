/**
 * Metadata View.
 * @module components/manage/Blocks/DataFigure/Metadata
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Icon,
  Image,
  Segment,
  Menu,
  Sidebar,
  Container,
} from 'semantic-ui-react';

/**
 * Metadata  class.
 * @class Metadata
 * @extends Component
 */
const Metadata = ({ visible, data }) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay right"
      onHide={() => {}}
      vertical
      visible={visible}
      width="very wide"
    >
      <Segment basic>
        <div
          dangerouslySetInnerHTML={{
            __html: data.metadata?.dataSources,
          }}
        />
        <Header>Geographic coverage</Header>
        <div
          dangerouslySetInnerHTML={{
            __html: data.metadata?.geoCoverage,
          }}
        />

        <Header>Temporal coverage</Header>
        <div
          dangerouslySetInnerHTML={{
            __html: data.temporal.label,
          }}
        />
      </Segment>
    </Sidebar>
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
