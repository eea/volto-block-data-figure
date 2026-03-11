import config from '@plone/volto/registry';
import {
  cleanSVG,
  extractDataProvenance,
  extractMetadata,
  flattenToContentURL,
  isInternalContentURL,
  validateHostname,
} from './Svg';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('Svg extra helpers', () => {
  const originalAllowedCorsDestinations =
    config.settings.allowed_cors_destinations;

  beforeEach(() => {
    jest.clearAllMocks();
    config.settings.allowed_cors_destinations = [
      'allowed.example.com',
      'www.eea.europa.eu',
    ];
  });

  afterAll(() => {
    config.settings.allowed_cors_destinations = originalAllowedCorsDestinations;
  });

  it('derives the viewBox dimensions when the svg has only a viewBox', () => {
    const svgData = '<svg viewBox="0 0 640 480"></svg>';

    const cleanedSVG = cleanSVG(svgData);

    expect(cleanedSVG).toContain('width="100%"');
    expect(cleanedSVG).toContain('height="100%"');
    expect(cleanedSVG).toContain('viewBox="0 0 640 480"');
  });

  it('falls back to top-level provenances and owner mapping', () => {
    const result = extractDataProvenance({
      provenances: [
        {
          link: 'https://example.com/source',
          title: 'Source',
          owner: 'https://www.eea.europa.eu/',
        },
      ],
    });

    expect(result).toEqual({
      data: [
        {
          '@id': 'mock-uuid',
          link: 'https://example.com/source',
          title: 'Source',
          organisation: 'European Environment Agency (EEA)',
        },
      ],
    });
  });

  it('includes geoCoverage and item urls for non-Daviz metadata', () => {
    expect(
      extractMetadata({
        location: 'Europe',
        items: [
          { url: 'https://example.com/a' },
          { url: 'https://example.com/b' },
        ],
      }),
    ).toEqual({
      geoCoverage: 'Europe',
      downloadData: ['https://example.com/a', 'https://example.com/b'],
    });
  });

  it('validates hostnames against the allowed cors destinations', () => {
    expect(
      validateHostname(
        'https://allowed.example.com/chart.svg?download=1#figure',
      ),
    ).toBe(true);
    expect(validateHostname('https://blocked.example.com/chart.svg')).toBe(
      false,
    );
  });

  it('delegates internal url detection to Volto helpers runtime behavior', () => {
    expect(isInternalContentURL('/internal/path')).toBe(true);
    expect(
      isInternalContentURL(`${config.settings.apiPath}/internal/path`),
    ).toBe(true);
    expect(isInternalContentURL('https://external.example.com/path')).toBe(
      false,
    );
  });

  it('flattens and cleans internal urls', () => {
    expect(
      flattenToContentURL(`${config.settings.apiPath}/path?expand=1#section`),
    ).toBe('/path');
    expect(
      flattenToContentURL(
        `${config.settings.publicURL}/another-path?query=1#hash`,
      ),
    ).toBe('/another-path');
  });

  it('only cleans external urls when flattening content urls', () => {
    expect(
      flattenToContentURL(
        'https://external.example.com/chart.svg?download=1#hash',
      ),
    ).toBe('https://external.example.com/chart.svg');
    expect(
      flattenToContentURL('https://external.example.com/chart.svg#hash'),
    ).toBe('https://external.example.com/chart.svg');
  });

  it('keeps already flattened internal paths stable', () => {
    expect(flattenToContentURL('/already-flat/path?expand=1#hash')).toBe(
      '/already-flat/path',
    );
  });
});
