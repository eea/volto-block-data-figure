import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';
import { GET_SVG } from '@eeacms/volto-block-data-figure/constants/ActionTypes';
import { getSVG, getInternalContent } from './datafigure';

describe('data figure actions', () => {
  it('creates a getSVG action with the expected request payload', () => {
    expect(getSVG('/figure.svg')).toEqual({
      type: GET_SVG,
      request: {
        op: 'get',
        path: '/figure.svg',
        headers: {
          Accept: 'image/svg+xml',
        },
      },
    });
  });

  it('creates a getInternalContent action and merges extra request options', () => {
    expect(
      getInternalContent('/figure', {
        headers: { Authorization: 'Bearer token' },
      }),
    ).toEqual({
      type: GET_CONTENT,
      subrequest: '/figure',
      request: {
        op: 'get',
        path: '/figure?expand=charts,table,provenances',
        headers: { Authorization: 'Bearer token' },
      },
    });
  });
});
