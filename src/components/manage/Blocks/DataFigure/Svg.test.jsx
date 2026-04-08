import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Svg from './Svg';
import { useDispatch } from 'react-redux';
import { cleanSVG, isSVGImage } from '@eeacms/volto-block-data-figure/helpers';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getSVG } from '@eeacms/volto-block-data-figure/actions';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { getContent } from '@plone/volto/actions/content/content';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  cleanSVG: jest.fn((svg) => `<span>${svg}</span>`),
  isSVGImage: jest.fn(),
}));

jest.mock('@eeacms/volto-corsproxy/actions', () => ({
  getProxiedExternalContent: jest.fn((url, options) => ({
    type: 'proxy',
    url,
    options,
  })),
}));

jest.mock('@eeacms/volto-block-data-figure/actions', () => ({
  getSVG: jest.fn((download) => ({
    type: 'get-svg',
    download,
  })),
}));

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  isInternalURL: jest.fn(),
  flattenToAppURL: jest.fn((url) => `/app${url}`),
}));

jest.mock('@plone/volto/actions/content/content', () => ({
  getContent: jest.fn((url, expand, subrequest) => ({
    type: 'get-content',
    url,
    expand,
    subrequest,
  })),
}));

describe('Svg component', () => {
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn((action) => {
      if (action.type === 'proxy') {
        return Promise.resolve('external-svg');
      }
      if (action.type === 'get-content') {
        return Promise.resolve({
          image: { download: '/downloaded.svg' },
        });
      }
      if (action.type === 'get-svg') {
        return Promise.resolve('internal-svg');
      }
      return Promise.resolve();
    });
    useDispatch.mockReturnValue(dispatch);
    isSVGImage.mockReturnValue(true);
  });

  test('renders nothing when the URL is not an SVG image', () => {
    isSVGImage.mockReturnValue(false);
    const { container } = render(<Svg data={{ url: '/image.png' }} />);

    expect(container).toBeEmptyDOMElement();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('loads and renders external SVG content', async () => {
    isInternalURL.mockReturnValue(false);
    const { container } = render(
      <Svg data={{ url: 'https://example.com/image.svg', align: 'full' }} />,
    );

    await waitFor(() =>
      expect(container.querySelector('p')).toHaveTextContent('external-svg'),
    );

    expect(getProxiedExternalContent).toHaveBeenCalledWith(
      'https://example.com/image.svg',
      {
        headers: { Accept: 'image/svg+xml' },
      },
    );
    expect(cleanSVG).toHaveBeenCalledWith('external-svg');
    expect(container.querySelector('p')).toHaveClass('full');
  });

  test('loads and renders internal SVG content', async () => {
    isInternalURL.mockReturnValue(true);
    const { container } = render(
      <Svg data={{ url: '/internal/image.svg' }} id="block-id" detached />,
    );

    await waitFor(() =>
      expect(container.querySelector('p')).toHaveTextContent('internal-svg'),
    );

    expect(flattenToAppURL).toHaveBeenCalledWith('/internal/image.svg');
    expect(getContent).toHaveBeenCalledWith(
      '/app/internal/image.svg',
      null,
      'block-id-svg',
    );
    expect(getSVG).toHaveBeenCalledWith('/downloaded.svg');
    expect(cleanSVG).toHaveBeenCalledWith('internal-svg');
    expect(container.querySelector('p')).toHaveClass('detached');
  });
});
