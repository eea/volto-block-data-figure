import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-intl-redux';
import ImageSidebar from './ImageSidebar';
import * as helpers from '@eeacms/volto-block-data-figure/helpers';

jest.mock('@eeacms/volto-widget-dataprovenance/components', () => ({
  DataProvenance: (props) => (
    <button
      data-testid="data-provenance"
      onClick={() =>
        props.onChange('data_provenance', { data: [{ chart_source: 'EEA' }] })
      }
    />
  ),
}));

jest.mock('@eeacms/volto-widget-geolocation/components', () => ({
  GeolocationWidget: (props) => (
    <button
      data-testid="geolocation-widget"
      onClick={() => {
        props.onChange('geolocation', { geolocation: { lat: 1 } });
        props.onChangeSchema('geolocation_schema', {
          geolocation_schema: { zoom: 3 },
        });
      }}
    />
  ),
}));

jest.mock('@eeacms/volto-widget-temporal-coverage/components', () => ({
  TemporalWidget: (props) => (
    <button
      data-testid="temporal-widget"
      onClick={() => props.onChange('temporal', { temporal: '2024' })}
    />
  ),
}));

jest.mock('@plone/volto-slate/widgets/RichTextWidget', () => (props) => (
  <button
    data-testid="richtext-widget"
    onClick={() =>
      props.onChange('figure_note', [{ type: 'paragraph', children: [] }])
    }
  />
));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => () => (
  <span data-testid="icon" />
));

jest.mock(
  '@plone/volto/components/manage/Widgets/CheckboxWidget',
  () => (props) => (
    <button
      data-testid={`checkbox-widget-${props.id}`}
      onClick={() => props.onChange(props.id, !props.value)}
    />
  ),
);

jest.mock(
  '@plone/volto/components/manage/Widgets/TextWidget',
  () => (props) => (
    <div>
      <button
        data-testid={`text-widget-${props.id}-icon`}
        onClick={props.iconAction}
      >
        {props.id}-icon
      </button>
      <button
        data-testid={`text-widget-${props.id}-change`}
        onClick={() => props.onChange?.(props.id, `changed-${props.id}`)}
      >
        {props.id}-change
      </button>
      <span>{props.value}</span>
    </div>
  ),
);

jest.mock('@eeacms/volto-block-data-figure/helpers', () => ({
  isChartImage: jest.fn(),
  isInternalContentURL: jest.fn(),
  flattenToContentURL: jest.fn(),
  isTableImage: jest.fn(),
}));

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  flattenToAppURL: jest.fn((url) => `/app${url}`),
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

  test('handles field callbacks for image data', () => {
    const onChangeBlock = jest.fn();
    const resetSubmitUrl = jest.fn();
    const openObjectBrowser = jest.fn();

    render(
      <Provider store={global.store}>
        <ImageSidebar
          {...baseProps}
          onChangeBlock={onChangeBlock}
          resetSubmitUrl={resetSubmitUrl}
          openObjectBrowser={openObjectBrowser}
          data={{
            '@type': 'Image',
            url: '/content/figure',
            alt: 'Alt text',
            title: 'Figure title',
            href: '/info',
            label: 'Info label',
            openLinkInNewTab: false,
            data_provenance: {},
          }}
        />
      </Provider>,
    );

    expect(screen.getByAltText('Alt text')).toHaveAttribute(
      'src',
      '/app/content/figure/@@images/image',
    );

    fireEvent.click(screen.getByTestId('text-widget-Origin-icon'));
    expect(resetSubmitUrl).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('text-widget-title-change'));
    expect(onChangeBlock).toHaveBeenCalledWith('block-id', {
      '@type': 'Image',
      url: '/content/figure',
      alt: 'Alt text',
      title: 'changed-title',
      href: '/info',
      label: 'Info label',
      openLinkInNewTab: false,
      data_provenance: {},
    });

    fireEvent.click(screen.getByTestId('text-widget-title-icon'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ title: '' }),
    );

    fireEvent.click(screen.getByTestId('richtext-widget'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({
        figure_note: [{ type: 'paragraph', children: [] }],
      }),
    );

    fireEvent.click(screen.getByTestId('text-widget-link-change'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ href: 'changed-link' }),
    );

    fireEvent.click(screen.getByTestId('text-widget-link-icon'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ href: '' }),
    );

    fireEvent.click(screen.getByTestId('text-widget-link-label-change'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ label: 'changed-link-label' }),
    );

    fireEvent.click(screen.getByTestId('text-widget-link-label-icon'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ label: null }),
    );

    fireEvent.click(screen.getByTestId('checkbox-widget-openLinkInNewTab'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ openLinkInNewTab: true }),
    );

    fireEvent.click(screen.getByText('Geographical Settings'));
    fireEvent.click(screen.getByTestId('geolocation-widget'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ geolocation: { lat: 1 } }),
    );
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ geolocation_schema: { zoom: 3 } }),
    );

    fireEvent.click(screen.getByText('Temporal Settings'));
    fireEvent.click(screen.getByTestId('temporal-widget'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({ temporal: '2024' }),
    );

    fireEvent.click(screen.getByText('Data sources'));
    fireEvent.click(screen.getByTestId('data-provenance'));
    expect(onChangeBlock).toHaveBeenCalledWith(
      'block-id',
      expect.objectContaining({
        data_provenance: { data: [{ chart_source: 'EEA' }] },
      }),
    );
  });

  test('renders non-image previews for internal content without svg options', () => {
    helpers.isInternalContentURL.mockReturnValue(true);
    helpers.isChartImage.mockReturnValue(false);

    render(
      <Provider store={global.store}>
        <ImageSidebar
          {...baseProps}
          data={{
            '@type': 'File',
            url: '/content/chart',
            alt: 'Chart alt',
            title: 'Chart title',
          }}
        />
      </Provider>,
    );

    expect(screen.getByAltText('Chart alt')).toHaveAttribute(
      'src',
      '/content/chart/@@images/image',
    );
  });
});
