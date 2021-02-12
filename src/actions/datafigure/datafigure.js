/**
 * Controlpanels actions.
 * @module actions/datafigure/datafigure
 */

import { GET_SVG } from '@eeacms/volto-block-data-figure/constants/ActionTypes';
import {
  GET_CONTENT,
  CREATE_CONTENT,
} from '@plone/volto/constants/ActionTypes';
import { nestContent } from '@plone/volto/helpers';
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

export function getInternalContent(url, request = {}) {
  return {
    type: GET_CONTENT,
    subrequest: url,
    request: {
      op: 'get',
      path: url,
      ...request,
    },
  };
}

export function createImageContent(url, content, subrequest) {
  const { image } = content;
  return {
    type: CREATE_CONTENT,
    subrequest,
    mode: 'serial',
    request: Array.isArray(content)
      ? content.map((item) => ({
          op: 'post',
          path: url,
          data: item,
          headers: {
            Accept: image['content-type'],
          },
        }))
      : {
          op: 'post',
          path: url,
          data: nestContent(content),
          headers: {
            Accept: image['content-type'],
          },
        },
  };
}
