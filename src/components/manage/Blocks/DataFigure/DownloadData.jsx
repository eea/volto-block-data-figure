import React from 'react';
import PropTypes from 'prop-types';
import { getParentUrl } from '@plone/volto/helpers';
import { Popup } from 'semantic-ui-react';
import cx from 'classnames';
import { Header, List } from 'semantic-ui-react';
import './less/public.less';

const DownloadData = ({ data, visible, onHide }) => {
  const { downloadData } = data.metadata || {};
  const ref = React.useRef();
  const [open, setOpen] = React.useState(false);
  return (
    <Popup
      popper={{ id: 'vis-toolbar-popup', className: 'download-popup' }}
      position="bottom left"
      on="click"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      trigger={
        <div className="download">
          <button className={cx('trigger-button', { open })}>
            <i className="ri-download-fill" />
            <span>Download</span>
          </button>
        </div>
      }
      content={
        //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div ref={ref} tabIndex={0}>
          {downloadData && data.figureType === 'DavizVisualization' ? (
            <div>
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
              </List>
              <List horizontal className="download-data">
                <List.Item href={downloadData.xml}>XML</List.Item>
                <List.Item href={downloadData.xmlSchema}>
                  XML with Schema
                </List.Item>
              </List>
            </div>
          ) : data.figureType === 'EEAFigure' ? (
            <div>
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
            </div>
          ) : (
            <div>
              <Header as="h5">Data not available</Header>
            </div>
          )}
        </div>
      }
    />
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DownloadData.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  visible: PropTypes.bool,
  onHide: PropTypes.func,
};

export default DownloadData;
