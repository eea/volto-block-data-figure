import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu, Sidebar, Header } from 'semantic-ui-react';

const DownloadData = ({ data, isLeftClicked, hideSidebar }) => {
  const { downloadData } = data.metadata || {};
  return (
    <Sidebar
      as={Menu}
      className="metadata-sidebar"
      animation={'overlay'}
      direction={'left'}
      onHide={() => hideSidebar()}
      vertical
      visible={isLeftClicked}
      width="very wide"
    >
      <Segment secondary attached>
        <Header style={{ color: '#517776' }} as="h2">
          Download Data
        </Header>
        {downloadData && (
          <a href={downloadData?.download}>
            {downloadData?.filename || <span>Download in PDF</span>}
          </a>
        )}
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
