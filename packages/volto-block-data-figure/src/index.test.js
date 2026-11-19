import applyConfig from './index';
import { datafigure } from './reducers';

describe('applyConfig', () => {
  it('registers the block, reducer, and settings', () => {
    const config = {
      addonReducers: {
        existing: 'existingReducer',
      },
      blocks: {
        blocksConfig: {},
      },
      settings: {
        allowed_cors_destinations: ['existing.example.com'],
      },
    };

    const result = applyConfig(config);
    const blockConfig = result.blocks.blocksConfig.dataFigure;

    expect(blockConfig.id).toBe('dataFigure');
    expect(blockConfig.title).toBe('Data Figure');
    expect(blockConfig.group).toBe('media');
    expect(blockConfig.view).toBeDefined();
    expect(blockConfig.edit).toBeDefined();
    expect(blockConfig.schema).toEqual(
      expect.objectContaining({
        title: expect.any(String),
      }),
    );
    expect(blockConfig.minResolution).toBe('1400x600');
    expect(blockConfig.imageScale).toBe('large');
    expect(blockConfig.sidebarTab).toBe(1);
    expect(blockConfig.security).toEqual({
      addPermission: [],
      view: [],
    });
    expect(blockConfig.type).toEqual(['DavizVisualization', 'EEAFigure']);
    expect(result.addonReducers).toEqual({
      existing: 'existingReducer',
      datafigure,
    });
    expect(result.settings.allowed_cors_destinations).toEqual([
      'existing.example.com',
      'www.eea.europa.eu',
    ]);
    expect(result.settings.externalDataFigureApiPath).toBe('/api/SITE');
  });

  it('initializes allowed cors destinations when none are configured', () => {
    const result = applyConfig({
      addonReducers: {},
      blocks: {
        blocksConfig: {},
      },
      settings: {},
    });

    expect(result.settings.allowed_cors_destinations).toEqual([
      'www.eea.europa.eu',
    ]);
  });
});
