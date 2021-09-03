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
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    type: ['DavizVisualization', 'EEAFigure'],
    minResolution: '1400x600',
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

  return config;
};

export default applyConfig;
