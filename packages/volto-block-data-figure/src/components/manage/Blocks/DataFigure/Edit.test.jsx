import React from 'react';
import { render } from '@testing-library/react';
import Edit from './Edit';
import { Provider } from 'react-intl-redux';
import * as helpers from '@eeacms/volto-block-data-figure/helpers';
import '@testing-library/jest-dom';

vi.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  getBlockPosition: vi.fn(),
  isTableImage: vi.fn(),
  isSVGImage: vi.fn(),
  isInternalContentURL: vi.fn(),
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
