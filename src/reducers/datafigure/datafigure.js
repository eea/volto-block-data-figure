/**
 * Data Figure reducer.
 * @module reducers/datafigure/datafigure
 */

import {
  GET_SVG,
  GET_CONTENT,
} from '@eeacms/volto-block-data-figure/constants/ActionTypes';
import { flattenToAppURL } from '@plone/volto/helpers';

const initialState = {
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  data: null,
  subrequests: {},
};

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Data figure reducer.
 * @function datafigure
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function datafigure(state = initialState, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${GET_SVG}_PENDING`:
    case `${GET_CONTENT}_PENDING`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                ...(state.subrequests[action.subrequest] || {
                  data: null,
                }),
                loaded: false,
                loading: true,
                error: null,
              },
            },
          }
        : {
            ...state,
            [getRequestKey(action.type)]: {
              loading: true,
              loaded: false,
              error: null,
            },
          };
    case `${GET_SVG}_SUCCESS`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
        result,
      };

    case `${GET_CONTENT}_SUCCESS`:
      return action.subrequest
        ? {
            ...state,
            subrequests: {
              ...state.subrequests,
              [action.subrequest]: {
                loading: false,
                loaded: true,
                error: null,
                data: result,
              },
            },
          }
        : {
            ...state,
            data: result,
            [getRequestKey(action.type)]: {
              loading: false,
              loaded: true,
              error: null,
            },
          };
    case `${GET_SVG}_FAIL`:
    case `${GET_CONTENT}_FAIL`:
      return {
        ...state,
        data: null,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
