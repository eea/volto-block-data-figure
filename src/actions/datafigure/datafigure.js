/**
 * Controlpanels actions.
 * @module actions/datafigure/datafigure
 */

import { GET_SVG } from '@eeacms/volto-block-data-figure/constants/ActionTypes';
/**
 * Get SVG function.
 * @function getSVG
 * @param {url} url SVG URL.
 * @returns {Object} SVG Object.
 */
export function getSVG(url) {
  return {
    type: GET_SVG,
    request: {
      op: 'get',
      path: url,
      headers: {
        Accept: 'image/svg+xml',
      },
    },
  };
}
