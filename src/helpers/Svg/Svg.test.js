import {
  cleanSVG,
  extractSvg,
  cleanUrl,
  isSVGImage,
  isPNGImage,
  isTableImage,
  isChartSVGImage,
  isChartImage,
  extractTemporal,
  extractDataProvenance,
  extractMetadata,
} from './Svg.js'; // replace with your actual file name

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('cleanSVG', () => {
  it('should clean and adjust SVG attributes', () => {
    const svgData = '<svg width="500" height="300"></svg>';
    const encodedData = btoa(svgData);
    const cleanedSVG = cleanSVG(encodedData);
    expect(cleanedSVG).toContain('width="100%"');
    expect(cleanedSVG).toContain('height="100%"');
    expect(cleanedSVG).toContain('preserveAspectRatio="xMinYMin meet"');
    expect(cleanedSVG).toContain('viewBox="0 0 500 300"');
  });

  it('should return the original text if not a valid SVG', () => {
    const nonSvgData = 'not-svg-data';
    const result = cleanSVG(nonSvgData);
    expect(result).toBe(nonSvgData);
  });
});

describe('extractSvg', () => {
  it('should extract items that are SVG images', () => {
    const data = {
      items: [
        { '@id': 'image1.svg' },
        { '@id': 'image2.png' },
        { '@id': 'image3.svg' },
      ],
    };
    const result = extractSvg(data);
    expect(result).toHaveLength(2);
    expect(result[0]['@id']).toBe('image1.svg');
    expect(result[1]['@id']).toBe('image3.svg');
  });

  it('should return an empty array if no items are SVG images', () => {
    const data = {
      items: [{ '@id': 'image1.png' }, { '@id': 'image2.jpg' }],
    };
    const result = extractSvg(data);
    expect(result).toHaveLength(0);
  });
});

describe('cleanUrl', () => {
  it('should remove query parameters and fragments from a URL', () => {
    const url = 'http://example.com/page?query=1#section';
    const cleanedUrl = cleanUrl(url);
    expect(cleanedUrl).toBe('http://example.com/page');
  });

  it('should return the original URL if no query parameters or fragments', () => {
    const url = 'http://example.com/page';
    const cleanedUrl = cleanUrl(url);
    expect(cleanedUrl).toBe(url);
  });
});

describe('isSVGImage', () => {
  it('should return true for SVG URLs', () => {
    expect(isSVGImage('http://example.com/image.svg')).toBe(true);
  });

  it('should return false for non-SVG URLs', () => {
    expect(isSVGImage('http://example.com/image.png')).toBe(false);
  });
});

describe('isPNGImage', () => {
  it('should return true for DPI PNG URLs', () => {
    expect(isPNGImage('http://example.com/image.dpi.png')).toBe(true);
  });

  it('should return false for non-DPI PNG URLs', () => {
    expect(isPNGImage('http://example.com/image.png')).toBe(false);
  });
});

describe('isTableImage', () => {
  it('should return true for table preview PNG URLs', () => {
    expect(isTableImage('http://example.com/table.preview.png')).toBe(true);
  });

  it('should return false for non-table preview PNG URLs', () => {
    expect(isTableImage('http://example.com/image.png')).toBe(false);
  });
});

describe('isChartSVGImage', () => {
  it('should return true for chart SVG URLs', () => {
    expect(isChartSVGImage('http://example.com/embed-chart.svg')).toBe(true);
  });

  it('should return false for non-chart SVG URLs', () => {
    expect(isChartSVGImage('http://example.com/image.svg')).toBe(false);
  });
});

describe('isChartImage', () => {
  it('should return true for chart SVG or table image URLs', () => {
    expect(isChartImage('http://example.com/embed-chart.svg')).toBe(true);
    expect(isChartImage('http://example.com/table.preview.png')).toBe(true);
  });

  it('should return false for other image URLs', () => {
    expect(isChartImage('http://example.com/image.svg')).toBe(false);
    expect(isChartImage('http://example.com/image.png')).toBe(false);
  });
});

describe('extractTemporal', () => {
  it('should return temporal coverage data if available', () => {
    const data = { temporalCoverage: ['2020', '2021'] };
    const result = extractTemporal(data);
    expect(result).toEqual(['2020', '2021']);
  });

  it('should return an empty array if no temporal coverage data', () => {
    const result = extractTemporal({});
    expect(result).toEqual([]);
  });
});

describe('extractDataProvenance', () => {
  it('should extract and format data provenance information', () => {
    const data = {
      '@components': {
        provenances: {
          items: [
            { link: 'link1', title: 'title1', organisation: 'org1' },
            {
              link: 'link2',
              title: 'title2',
              owner: 'http://www.eea.europa.eu',
            },
          ],
        },
      },
    };
    const result = extractDataProvenance(data);
    expect(result.data).toHaveLength(2);
    expect(result.data[0]['@id']).toBe('mock-uuid');
    expect(result.data[1].organisation).toBe(
      'European Environment Agency (EEA)',
    );
  });

  it('should return an empty array if no provenance data is available', () => {
    const result = extractDataProvenance({});
    expect(result.data).toHaveLength(0);
  });
});

describe('extractMetadata', () => {
  it('should extract metadata for DavizVisualization', () => {
    const data = { '@type': 'DavizVisualization', '@id': 'id' };
    const result = extractMetadata(data);
    expect(result.downloadData.html).toBe('id/download.table');
    expect(result.downloadData.csv).toBe('id/download.csv');
  });

  it('should extract metadata items if not DavizVisualization', () => {
    const data = { items: [{ url: 'url1' }, { url: 'url2' }] };
    const result = extractMetadata(data);
    expect(result.downloadData).toEqual(['url1', 'url2']);
  });
});
