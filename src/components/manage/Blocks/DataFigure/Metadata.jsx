/**
 * Metadata View.
 * @module components/manage/Blocks/DataFigure/Metadata
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Menu, Sidebar, Grid } from 'semantic-ui-react';
import { serializeNodes } from 'volto-slate/editor/render';
import { TemporalWidgetView } from '@eeacms/volto-widget-temporal-coverage/components';
import './less/public.less';

/**
 * Metadata  class.
 * @class Metadata
 * @extends Component
 */
const Metadata = ({ visible, data, onHide }) => {
  const { metadata = {} } = data;
  const { dataSources = {} } = metadata;
  const { value, plaintext = '' } = dataSources;

  let geolocation = data.geolocation || [];

  return (
    <Sidebar
      as={Menu}
      className="metadata-sidebar"
      animation={'overlay'}
      direction={'right'}
      vertical
      onHide={onHide}
      visible={visible}
      width="very wide"
    >
      <Segment.Group raised>
        <Segment>
          <Header as="h2" className={'data-figure-block-header'}>
            Metadata
          </Header>
        </Segment>
        {!value ? (
          <Segment>
            <div
              dangerouslySetInnerHTML={{
                __html: plaintext,
              }}
            />
          </Segment>
        ) : (
          <Segment>
            <Header as="h3" className={'data-figure-block-header'}>
              Data Sources:
            </Header>
            {serializeNodes(value || [])}
          </Segment>
        )}
        {geolocation.length ? (
          <Segment>
            <Header as="h3" className={'data-figure-block-header'}>
              Geographic coverage:
            </Header>
            <ul>
              <Grid columns={2}>
                <Grid.Row>
                  {geolocation?.map((item, index) => (
                    <Grid.Column key={index}>
                      <li key={index}>{item.label}</li>
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </ul>
          </Segment>
        ) : null}
        {data?.temporal?.length ? (
          <Segment>
            <Header as="h3" className={'data-figure-block-header'}>
              Temporal coverage:
            </Header>
            <TemporalWidgetView value={data} />
          </Segment>
        ) : null}
      </Segment.Group>
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
  visible: PropTypes.bool,
  onHide: PropTypes.func,
};

export default Metadata;
