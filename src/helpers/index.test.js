import * as helpers from './index';
import { getBlockPosition, getImageScale } from './blocks';
import {
  cleanSVG,
  extractDataProvenance,
  extractMetadata,
  extractSvg,
  extractTemporal,
  flattenToContentURL,
  isChartImage,
  isInternalContentURL,
  isPNGImage,
  isSVGImage,
  isTableImage,
  validateHostname,
} from './Svg/Svg';

describe('helpers index', () => {
  it('re-exports the public helper API', () => {
    expect(helpers.cleanSVG).toBe(cleanSVG);
    expect(helpers.extractSvg).toBe(extractSvg);
    expect(helpers.extractTemporal).toBe(extractTemporal);
    expect(helpers.extractDataProvenance).toBe(extractDataProvenance);
    expect(helpers.extractMetadata).toBe(extractMetadata);
    expect(helpers.validateHostname).toBe(validateHostname);
    expect(helpers.isSVGImage).toBe(isSVGImage);
    expect(helpers.isPNGImage).toBe(isPNGImage);
    expect(helpers.isTableImage).toBe(isTableImage);
    expect(helpers.isChartImage).toBe(isChartImage);
    expect(helpers.isInternalContentURL).toBe(isInternalContentURL);
    expect(helpers.flattenToContentURL).toBe(flattenToContentURL);
    expect(helpers.getBlockPosition).toBe(getBlockPosition);
    expect(helpers.getImageScale).toBe(getImageScale);
  });
});
