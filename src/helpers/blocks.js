import { getAllBlocks } from 'volto-slate/utils';
import config from '@plone/volto/registry';

export const getBlockPosition = (metadata, block) => {
  const blocks = getAllBlocks(metadata, []);
  const position = blocks
    .filter((b) => b['@type'] === 'dataFigure')
    .map((b) => b['id'])
    .indexOf(block);
  return position > 0 ? position + 1 : 1;
};

export const getImageScale = (page) => {
  const scale_range = config.blocks.blocksConfig['dataFigure'].imageScaleRanges;
  const page_width = page?.width || (__CLIENT__ && window.innerWidth) || 1300;
  const scale = Object.keys(scale_range).filter(
    (value) => value > page_width,
  )[0];
  const scale_name = scale_range[scale];
  return scale_name;
};
