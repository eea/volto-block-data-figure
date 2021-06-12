import { getAllBlocks } from 'volto-slate/utils';

export const getBlockPosition = (metadata, block) => {
  const blocks = [];
  getAllBlocks(metadata, blocks);
  const position = blocks
    .filter((b) => b['@type'] === 'dataFigure')
    .map((b) => b['id'])
    .indexOf(block);
  return position > 0 ? position + 1 : 1;
};
