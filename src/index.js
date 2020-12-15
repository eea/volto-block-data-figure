import { EditDataFigureBlock } from './components';
import { ViewDataFigureBlock } from './components';
import iconSVG from '@plone/volto/icons/image.svg';
import { datafigure } from './reducers';

const applyConfig = (config) => {
  // blocks
  config.blocks.blocksConfig.dataFigure = {
    id: 'dataFigure',
    title: 'Data Figure',
    icon: iconSVG,
    group: 'media',
    view: ViewDataFigureBlock,
    edit: EditDataFigureBlock,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    type: ['DavizVisualization', 'EEAFigure'],
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
    'alin.dev2aws.eea.europa.eu',
  ];

  return config;
};

export default applyConfig;
