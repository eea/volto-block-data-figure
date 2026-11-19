import { GET_SVG } from '@eeacms/volto-block-data-figure/constants/ActionTypes';
import reducer from './datafigure';

describe('datafigure reducer', () => {
  it('returns the initial state by default', () => {
    expect(reducer(undefined, {})).toEqual({
      get: {
        loaded: false,
        loading: false,
        error: null,
      },
      subrequests: {},
    });
  });

  it('handles pending svg requests', () => {
    expect(reducer(undefined, { type: `${GET_SVG}_PENDING` })).toEqual({
      get: {
        loaded: false,
        loading: true,
        error: null,
      },
      subrequests: {},
    });
  });

  it('stores successful svg responses', () => {
    expect(
      reducer(undefined, {
        type: `${GET_SVG}_SUCCESS`,
        result: '<svg />',
      }),
    ).toEqual({
      get: {
        loaded: true,
        loading: false,
        error: null,
      },
      result: '<svg />',
      subrequests: {},
    });
  });

  it('stores request errors for failed svg responses', () => {
    const error = new Error('boom');

    expect(
      reducer(undefined, {
        type: `${GET_SVG}_FAIL`,
        error,
      }),
    ).toEqual({
      get: {
        loaded: false,
        loading: false,
        error,
      },
      subrequests: {},
    });
  });
});
