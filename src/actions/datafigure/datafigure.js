/**
 * Controlpanels actions.
 * @module actions/datafigure/datafigure
 */

import { GET_SVG, GET_PARSED_SVG, GET_TABLE } from '@eeacms/volto-block-data-figure/constants/ActionTypes';
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

export function getParsedSVG(url) {
  return {
    type: GET_PARSED_SVG,
    request: {
      op: 'get',
      path: url,
      headers: {

        Accept: 'text/html',
      },
    },
  };
}

export function getTable(url) {
  return {
    type: GET_TABLE,
    request: {
      op: 'get',
      path: url,
      headers: {
        Accept: 'text/html',
      },
    },
  };
};