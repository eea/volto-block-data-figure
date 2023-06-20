import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Metadata from './Metadata';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto-slate/editor/render', () => ({
  serializeNodes: jest.fn(() => 'Test Plain Text'),
}));

jest.mock('@eeacms/volto-widget-temporal-coverage/components', () => ({
  TemporalWidgetView: () => <div>TemporalWidgetView</div>,
}));

describe('<Metadata />', () => {
  it('renders without crashing', () => {
    const data = {
      metadata: {
        dataSources: {
          value: null,
          plaintext: 'Test Plain Text',
        },
      },
      geolocation: [],
      temporal: [],
    };
    const tree = renderer
      .create(<Metadata data={data} visible={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders data sources correctly', () => {
    const data = {
      metadata: {
        dataSources: {
          value: '<p>Test Data Sources</p>',
          plaintext: 'Test Plain Text',
        },
      },
      geolocation: [{ label: 'Location 1' }, { label: 'Location 2' }],
      temporal: ['2023-01-01', '2023-12-31'],
    };
    const { getByText } = render(<Metadata data={data} visible={true} />);
    expect(getByText('Test Plain Text')).toBeInTheDocument();
    expect(getByText('Geographic coverage:')).toBeInTheDocument();
    expect(getByText('Temporal coverage:')).toBeInTheDocument();
    expect(getByText('TemporalWidgetView')).toBeInTheDocument();
  });

  it('renders without crashing without metadata', () => {
    const data = {
      metadata: undefined,
      geolocation: [],
      temporal: [],
    };
    const tree = renderer
      .create(<Metadata data={data} visible={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders without crashing without dataSources', () => {
    const data = {
      metadata: {
        dataSources: undefined,
      },
      geolocation: [],
      temporal: [],
    };
    const tree = renderer
      .create(<Metadata data={data} visible={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders without crashing without plaintext', () => {
    const data = {
      metadata: {
        dataSources: {
          value: '<p>Test Data Sources</p>',
          plaintext: undefined,
        },
      },
      geolocation: undefined,
      temporal: [],
    };
    const tree = renderer
      .create(<Metadata data={data} visible={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
