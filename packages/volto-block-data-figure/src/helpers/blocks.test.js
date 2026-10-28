import config from '@plone/volto/registry';
import { getBlockPosition, getImageScale } from './blocks';

describe('block helpers', () => {
  const originalDataFigureConfig = config.blocks.blocksConfig.dataFigure;

  beforeAll(() => {
    config.blocks.blocksConfig.dataFigure = {
      imageScaleRanges: {
        400: 'preview',
        1023: 'large',
        1279: 'xlarge',
        5000: 'landscape',
      },
    };
  });

  afterAll(() => {
    config.blocks.blocksConfig.dataFigure = originalDataFigureConfig;
  });

  beforeEach(() => {
    global.__CLIENT__ = false;
  });

  it('returns the 1-based position of the matching data figure block', () => {
    const metadata = {
      blocks: {
        'figure-1': { '@type': 'dataFigure' },
        'figure-2': { '@type': 'dataFigure' },
        'text-1': { '@type': 'text' },
      },
      blocks_layout: {
        items: ['figure-1', 'figure-2', 'text-1'],
      },
    };

    expect(getBlockPosition(metadata, 'figure-2')).toBe(2);
  });

  it('falls back to 1 when the target block is first or missing', () => {
    const metadata = {
      blocks: {
        'figure-1': { '@type': 'dataFigure' },
      },
      blocks_layout: {
        items: ['figure-1'],
      },
    };

    expect(getBlockPosition(metadata, 'figure-1')).toBe(1);
    expect(getBlockPosition(metadata, 'missing')).toBe(1);
  });

  it('uses the provided page width to resolve the image scale', () => {
    expect(getImageScale({ width: 800 })).toBe('large');
  });

  it('falls back to the client width and then the default width', () => {
    global.__CLIENT__ = true;
    window.innerWidth = 320;
    expect(getImageScale()).toBe('preview');

    global.__CLIENT__ = false;
    expect(getImageScale()).toBe('landscape');
  });
});
