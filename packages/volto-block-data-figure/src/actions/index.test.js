import * as actions from './index';
import {
  getSVG,
  getInternalContent,
} from '@eeacms/volto-block-data-figure/actions/datafigure/datafigure';

describe('actions index', () => {
  it('re-exports the public action creators', () => {
    expect(actions.getSVG).toBe(getSVG);
    expect(actions.getInternalContent).toBe(getInternalContent);
  });
});
