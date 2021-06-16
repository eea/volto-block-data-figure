import React from 'react';
import PropTypes from 'prop-types';
import { getParentUrl } from '@plone/volto/helpers';
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
      <Segment.Group>
        <Segment attached>
          <Header style={{ color: '#517776' }} as="h2">
            Download
          </Header>
        </Segment>
        {downloadData && data.figureType === 'DavizVisualization' ? (
          <Segment secondary attached>
            <Header as="h5">Formats suitable for human consumption</Header>
            <List horizontal className="download-data">
              <List.Item href={downloadData.html}>HTML</List.Item>
              <List.Item href={downloadData.csv}>CSV</List.Item>
              <List.Item href={downloadData.tsv}>TSV</List.Item>
            </List>
            <Header as="h5">
              Formats suitable for machine-to-machine communication
            </Header>
            <List horizontal className="download-data">
              <List.Item href={downloadData.json}>JSON</List.Item>
              <List.Item href={downloadData.exhibit}>Exhibit JSON</List.Item>
              <List.Item href={downloadData.xml}>XML</List.Item>
              <List.Item href={downloadData.xmlSchema}>
                XML with Schema
              </List.Item>
            </List>
          </Segment>
        ) : data.figureType === 'EEAFigure' ? (
          <Segment secondary attached>
            <Header as="h5">Image formats</Header>
            <List horizontal relaxed className="download-data">
              {downloadData.map((item) => {
                let title, url;
                if (item.includes('zoom')) {
                  title = 'original';
                  url = getParentUrl(item) + '/at_download/file';
                } else {
                  title = item.split('.').pop().toUpperCase();
                  url = item;
                }
                return (
                  <List.Item key={url} href={url}>
                    {title.toUpperCase()}
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        ) : (
          <Segment>
            <Header as="h5">Data not available</Header>
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
