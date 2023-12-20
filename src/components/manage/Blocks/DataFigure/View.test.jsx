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

    const tabledataButton = container.querySelector('.data-figure-control');
    fireEvent.click(tabledataButton);
  });

  test('shows metadata when button is clicked', async () => {
    helpers.isSVGImage.mockReturnValue(false);
    const { container, getByText } = render(
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

    const metadataButtons = container.querySelectorAll('.show-metadata button');
    fireEvent.click(metadataButtons[1]);

    const metadata = getByText('Metadata');
    expect(metadata).toBeInTheDocument();
  });

  test('shows metadata when button is clicked', async () => {
    helpers.isSVGImage.mockReturnValue(false);
    const { container, getByText } = render(
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

    const metadataButtons = container.querySelectorAll(
      '.metadata-btn-group button.data-figure-control',
    );
    fireEvent.click(metadataButtons[3]);
    fireEvent.click(metadataButtons[4]);

    const metadata = getByText('Metadata');
    expect(metadata).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    helpers.isTableImage.mockReturnValue(false);
    helpers.isSVGImage.mockReturnValue(true);
    const { container, getAllByText } = render(
      <Provider store={store}>
        <View
          data={{
            url: 'testUrl',
            tabledata: {
              properties: {
                test_header: {
                  test1: 'test1',
                  test2: 'test2',
                },
                test1_header: {
                  test1: 'test1',
                  test2: 'test2',
                },
                test2_header: {
                  test1: 'test1',
                  test2: 'test2',
                },
              },
              items: [
                {
                  test_header: 'test_values',
                  test1_header: 'test1_values',
                  test2_header: 'test2_values',
                },
                {
                  test_header: 'test_values',
                  test1_header: 'test1_values',
                  test2_header: 'test2_values',
                },
                {
                  test_header: 'test_values',
                  test1_header: null,
                  test2_header: undefined,
                },
              ],
            },
          }}
        />
      </Provider>,
    );

    const tabledataButton = container.querySelector('.data-figure-control');
    fireEvent.click(tabledataButton);
    expect(getAllByText('test_values').length).toBe(3);
    expect(getAllByText('test1_values').length).toBe(2);
    expect(getAllByText('test2_values').length).toBe(2);
  });
});
