import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import Metadata from './Metadata';
import voltoPackageJson from '@plone/volto/../package.json';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@eeacms/volto-widget-temporal-coverage/components', () => ({
  TemporalWidgetView: () => <div>TemporalWidgetView</div>,
}));

const mockStore = configureStore([]);

const store = mockStore({
  screen: {
    page: {
      width: 768,
    },
  },
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
});

const voltoVersion = voltoPackageJson.version;
const volto17 = voltoVersion.startsWith('17');

describe('<Metadata />', () => {
  it(`renders without crashing ${volto17 ? 'Volto17' : 'Volto16'}`, () => {
    const data = {
      data_provenance: {
        data: [
          {
            '@id': '1',
            link: 'https://www.example.com',
            title: 'Data source',
            organization: 'Example Organization',
          },
        ],
      },
      geolocation: [],
      temporal: [],
    };
    const { container } = render(
      <Provider store={store}>
        <Metadata data={data} visible={true} />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it(`renders data sources correctly ${
    volto17 ? 'Volto17' : 'Volto16'
  }`, () => {
    const data = {
      data_provenance: {
        data: [
          {
            '@id': '1',
            link: 'https://www.example.com/1',
            title: 'Data source 1',
            organization: 'Example Organization',
          },
          {
            '@id': '2',
            link: 'https://www.example.com/2',
            title: 'Data source 2',
            organization: 'Example Organization',
          },
        ],
      },
      geolocation: [{ label: 'Location 1' }, { label: 'Location 2' }],
      temporal: ['2023-01-01', '2023-12-31'],
    };
    const { container } = render(
      <Provider store={store}>
        <Metadata data={data} visible={true} />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without crashing without metadata', () => {
    const data = {
      metadata: undefined,
      geolocation: [],
      temporal: [],
    };
    const { container } = render(
      <Provider store={store}>
        <Metadata data={data} visible={true} />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without crashing without data_provenance', () => {
    const data = {
      data_provenance: undefined,
      geolocation: [],
      temporal: [],
    };
    const { container } = render(
      <Provider store={store}>
        <Metadata data={data} visible={true} />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders without crashing without links', () => {
    const data = {
      data_provenance: {
        data: [
          {
            '@id': '1',
            title: 'Test Data Sources',
            link: undefined,
          },
        ],
      },
      geolocation: undefined,
      temporal: [],
    };
    const { container } = render(
      <Provider store={store}>
        <Metadata data={data} visible={true} />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
