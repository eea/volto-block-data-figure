import { EditDataFigureBlock } from './components';
import { ViewDataFigureBlock } from './components';
import iconSVG from '@plone/volto/icons/image.svg';

const applyConfig = (config) => {
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
  };

  return config;
};

export default applyConfig;
