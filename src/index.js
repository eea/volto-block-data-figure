import {
  DataFigureBlockEdit,
  DataFigureBlockView,
  DataFigureBlockSchema,
} from './components';
import iconSVG from '@plone/volto/icons/image.svg';
import { datafigure } from './reducers';

const applyConfig = (config) => {
  // blocks
  config.blocks.blocksConfig.dataFigure = {
    id: 'dataFigure',
    title: 'Data Figure',
    icon: iconSVG,
    group: 'media',
    view: DataFigureBlockView,
    edit: DataFigureBlockEdit,
    schema: DataFigureBlockSchema,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    type: ['DavizVisualization', 'EEAFigure'],
    minResolution: '1400x600',
    imageScale: 'large',
    imageScaleRanges: {
      400: 'preview',
      1023: 'large',
      1279: 'xlarge',
      5000: 'landscape',
    },
  };

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    datafigure,
  };

  // Default CORS: www.eea.europa.eu
  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'www.eea.europa.eu',
  ];

  config.settings.externalDataFigureApiPath = '/api/SITE';

  return config;
};

export default applyConfig;
