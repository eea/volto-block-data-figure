import { datafigure } from './index';
import reducer from './datafigure/datafigure';

describe('reducers index', () => {
  it('re-exports the datafigure reducer', () => {
    expect(datafigure).toBe(reducer);
  });
});
