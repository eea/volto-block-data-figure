import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu, Sidebar, Header, List } from 'semantic-ui-react';
import './less/public.less';

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
      <Segment.Group attached>
        <Segment attached>
          <Header style={{ color: '#517776' }} as="h2">
            Download Data
          </Header>
        </Segment>
        {downloadData && (
          <Segment secondary attached>
            <Header as="h5">Formats suitable for human consumption</Header>
            <List horizontal relaxed className="download-data">
              <List.Item href={downloadData.html} style={{ margin: '2px' }}>
                HTML
              </List.Item>
              <List.Item href={downloadData.csv}>CSV</List.Item>
              <List.Item href={downloadData.tsv}>TSV</List.Item>
            </List>
            <Header as="h5">
              Formats suitable for machine-to-machine communication
            </Header>
            <List horizontal relaxed className="download-data">
              <List.Item href={downloadData.json} style={{ margin: '2px' }}>
                JSON
              </List.Item>
              <List.Item href={downloadData.exhibit}>Exhibit JSON</List.Item>
              <List.Item href={downloadData.xml}>XML</List.Item>
              <List.Item href={downloadData.xmlSchema}>
                XML with Schema
              </List.Item>
            </List>
          </Segment>
        )}
      </Segment.Group>
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
