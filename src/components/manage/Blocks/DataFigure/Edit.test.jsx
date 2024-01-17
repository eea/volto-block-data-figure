import React from 'react';
import { render } from '@testing-library/react';
import Edit from './Edit';
import { Provider } from 'react-intl-redux';
import * as helpers from '@eeacms/volto-block-data-figure/helpers';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  getBlockPosition: jest.fn(),
  isTableImage: jest.fn(),
  isSVGImage: jest.fn(),
  isInternalContentURL: jest.fn(),
}));

test('test edit mode', async () => {
  helpers.isSVGImage.mockReturnValue(false);
  render(
    <Provider store={global.store}>
      <Edit
        data={{
          url: 'testUrl',
          metadata: { downloadData: ['google.com/zoomed'] },
          width: '768',
          tabledata: {
            properties: { test: 'test', mega: 'test' },
            items: [{ test: 'test' }],
          },
          height: '800',
          inLeftColumn: true,
          figureType: 'EEAFigure',
          href: 'https://localhost:3000',
          figure_note: 'FIGURE NOTE',
        }}
      />
    </Provider>,
  );
});
