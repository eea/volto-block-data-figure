import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu, Sidebar } from 'semantic-ui-react';

const DownloadData = ({ data, isLeftClicked }) => {
  return (
    <Sidebar
      as={Menu}
      className="metadata-sidebar"
      animation={'overlay left'}
      vertical
      visible={isLeftClicked}
      width="very wide"
    >
      <Segment secondary attached>
        <div
          dangerouslySetInnerHTML={{
            __html: data.metadata?.downloadData,
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
DownloadData.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isLeftClicked: PropTypes.bool,
};

export default DownloadData;
