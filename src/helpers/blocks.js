import { getAllBlocks } from '@plone/volto-slate/utils';
import { isInternalContentURL } from '@eeacms/volto-block-data-figure/helpers';
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

export const setImageSize = (image, imageParams, size) => {
  const imageScaled = isInternalContentURL(image)
    ? (() => {
        if (imageParams) {
          const { scales = null } = imageParams;
          if (scales) {
            if (size === 'h') return scales.huge;
            if (size === 'l') return scales.large;
            if (size === 'm') return scales.preview;
            if (size === 's') return scales.thumb;
            return scales.large;
          } else
            return {
              download: imageParams?.download,
              width: imageParams?.width,
              height: imageParams?.height,
            };
        }
      })()
    : { download: image, width: '100%', height: '100%' };

  return imageScaled;
};
