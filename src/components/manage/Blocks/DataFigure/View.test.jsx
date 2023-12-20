import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import View from './View';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import * as helpers from '@eeacms/volto-block-data-figure/helpers';
import '@testing-library/jest-dom/extend-expect';

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

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  getBlockPosition: jest.fn(),
  isTableImage: jest.fn(),
  isSVGImage: jest.fn(),
}));

jest.mock('./Svg', () => jest.fn(() => <div>Svg</div>));

describe('View component', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <View data={{ url: 'testUrl' }} />
      </Provider>,
    );
  });

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <View data={{ url: 'testUrl', title: 'Title' }} />
      </Provider>,
    );
  });

  test('renders without crashing', () => {
    helpers.isTableImage.mockReturnValue(true);
    helpers.isSVGImage.mockReturnValue(true);
    render(
      <Provider store={store}>
        <View data={{ url: 'testUrl' }} />
      </Provider>,
    );
  });

  test('renders without crashing', () => {
    helpers.isTableImage.mockReturnValue(false);
    helpers.isSVGImage.mockReturnValue(true);
    render(
      <Provider store={store}>
        <View data={{ url: 'testUrl' }} />
      </Provider>,
    );
  });

  test('renders without crashing', () => {
    helpers.isTableImage.mockReturnValue(false);
    helpers.isSVGImage.mockReturnValue(true);
    const { container } = render(
      <Provider store={store}>
        <View data={{ url: 'testUrl', tabledata: 'Table Data' }} />
      </Provider>,
    );

    const tabledataButton = container.querySelector('.show-table button');
    fireEvent.click(tabledataButton);
  });

  test('shows metadata when button is clicked', async () => {
    helpers.isSVGImage.mockReturnValue(false);
    const { container } = render(
      <Provider store={store}>
        <View
          data={{
            url: 'testUrl',
            metadata: { test: 'test' },
            width: '768',
            height: '800',
            inLeftColumn: true,
            href: 'https://localhost:3000',
            openLinkInNewTab: true,
          }}
        />
      </Provider>,
    );

    const metadataButton = container.querySelector('.show-metadata button');
    fireEvent.click(metadataButton);

    const metadata = container.querySelector('.metadata-sidebar');
    expect(metadata).toBeInTheDocument();
  });

  test('shows metadata when button is clicked', async () => {
    helpers.isSVGImage.mockReturnValue(false);
    const { container } = render(
      <Provider store={store}>
        <View
          data={{
            url: 'testUrl',
            metadata: { downloadData: 'test' },
            width: '768',
            height: '800',
            inLeftColumn: true,
            href: 'https://localhost:3000',
            openLinkInNewTab: true,
          }}
        />
      </Provider>,
    );

    const metadataButton = container.querySelector('.show-table button');
    fireEvent.click(metadataButton);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });
});
