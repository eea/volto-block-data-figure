import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-intl-redux';
import ImageSidebar from './ImageSidebar';
import * as helpers from '@eeacms/volto-block-data-figure/helpers';

jest.mock('@eeacms/volto-widget-dataprovenance/components', () => ({
  DataProvenance: () => <div data-testid="data-provenance" />,
}));

jest.mock('@eeacms/volto-widget-geolocation/components', () => ({
  GeolocationWidget: () => <div data-testid="geolocation-widget" />,
}));

jest.mock('@eeacms/volto-widget-temporal-coverage/components', () => ({
  TemporalWidget: () => <div data-testid="temporal-widget" />,
}));

jest.mock('@plone/volto-slate/widgets/RichTextWidget', () => () => (
  <div data-testid="richtext-widget" />
));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => () => (
  <span data-testid="icon" />
));

jest.mock('@plone/volto/components/manage/Widgets/CheckboxWidget', () => () => (
  <div data-testid="checkbox-widget" />
));

jest.mock(
  '@plone/volto/components/manage/Widgets/TextWidget',
  () => (props) => (
    <button data-testid={`text-widget-${props.id}`} onClick={props.iconAction}>
      {props.id}
    </button>
  ),
);

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  isChartImage: jest.fn(),
  isInternalContentURL: jest.fn(),
  flattenToContentURL: jest.fn(),
  isTableImage: jest.fn(),
}));

describe('ImageSidebar', () => {
  beforeEach(() => {
    helpers.isChartImage.mockReturnValue(false);
    helpers.isInternalContentURL.mockReturnValue(false);
    helpers.flattenToContentURL.mockImplementation((url) => url);
    helpers.isTableImage.mockReturnValue(false);
  });

  const baseProps = {
    block: 'block-id',
    onChangeBlock: jest.fn(),
    openObjectBrowser: jest.fn(),
    resetSubmitUrl: jest.fn(),
    svgs: [],
    instructions: '<p>Pick an image</p>',
  };

  test('renders instructions when url is missing', () => {
    render(
      <Provider store={global.store}>
        <ImageSidebar
          {...baseProps}
          data={{ '@type': 'Image', title: 'Title', alt: 'Alt' }}
        />
      </Provider>,
    );

    expect(screen.getByText('Pick an image')).toBeInTheDocument();
  });

  test('toggles accordion and updates image from svg list', () => {
    const onChangeBlock = jest.fn();
    helpers.isTableImage.mockReturnValue(true);
    helpers.isChartImage.mockReturnValue(true);

    render(
      <Provider store={global.store}>
        <ImageSidebar
          {...baseProps}
          onChangeBlock={onChangeBlock}
          data={{
            '@type': 'File',
            url: '/content/original-image',
            alt: 'Alt text',
            title: 'Figure title',
          }}
          svgs={[{ url: '/content/preview-image', title: 'Chart', alt: 'svg' }]}
        />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Geographical Settings'));
    fireEvent.click(screen.getByAltText('svg'));

    expect(onChangeBlock).toHaveBeenCalledWith('block-id', {
      '@type': 'File',
      url: '/content/preview-image',
      alt: 'Alt text',
      title: 'Figure title',
    });
  });
});
