/**
 * Metadata View.
 * @module components/manage/Blocks/DataFigure/Metadata
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Menu, Sidebar, Grid } from 'semantic-ui-react';
import './less/public.less';

/**
 * Metadata  class.
 * @class Metadata
 * @extends Component
 */
const Metadata = ({ visible, data, hideSidebar }) => {
  const { geolocation } = data;
  return (
    <Sidebar
      as={Menu}
      className="metadata-sidebar"
      animation={'overlay right'}
      vertical
      onHide={() => hideSidebar()}
      visible={visible}
      width="very wide"
    >
      <Segment.Group raised>
        <Segment>
          <Header style={{ color: '#517776' }} as="h2">
            Metadata
          </Header>
        </Segment>
        <Segment secondary>
          <p
            dangerouslySetInnerHTML={{
              __html: data.metadata?.dataSources,
            }}
          />
        </Segment>
        {geolocation && (
          <Segment secondary>
            <Header as="h3" style={{ color: '#517776' }}>
              Geographic coverage
            </Header>
            <ul>
              <Grid columns={2}>
                <Grid.Row>
                  {geolocation?.map((item, index) =>
                    index < geolocation.length / 2 ? (
                      <Grid.Column>
                        <li>{item.label}</li>
                      </Grid.Column>
                    ) : (
                      <Grid.Column>
                        <li>{item.label}</li>
                      </Grid.Column>
                    ),
                  )}
                </Grid.Row>
              </Grid>
            </ul>
          </Segment>
        )}
        {data.temporal && (
          <Segment secondary>
            <Header as="h3" style={{ color: '#517776' }}>
              Temporal coverage
            </Header>
            {data.temporal.map((item) => (
              <div style={{ textIndent: '15px' }}>{item.label}</div>
            ))}
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
Metadata.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  visible: PropTypes.bool,
};

export default Metadata;
