/**
 * Metadata View.
 * @module components/manage/Blocks/DataFigure/Metadata
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Menu, Sidebar, Grid } from 'semantic-ui-react';
import { TemporalWidgetView } from '@eeacms/volto-widget-temporal-coverage/components';
import { DataProvenanceWidgetView } from '@eeacms/volto-widget-dataprovenance/components';
import './less/public.less';

/**
 * Metadata  class.
 * @class Metadata
 * @extends Component
 */
const Metadata = ({ visible, data = {}, onHide }) => {
  const { data_provenance = {}, geolocation = [], temporal = [] } = data;

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
        {data_provenance?.data?.length ? (
          <Segment>
            <Header as="h3" className={'data-figure-block-header'}>
              Data Sources:
            </Header>
            <DataProvenanceWidgetView value={data_provenance} />
          </Segment>
        ) : null}
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
        {temporal?.length ? (
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
