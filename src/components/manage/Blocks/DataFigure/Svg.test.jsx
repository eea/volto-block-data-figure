import Svg from './Svg';
import { render } from '@testing-library/react';
describe('View component', () => {
  test('renders without crashing', () => {
    render(<Svg data={{ url: 'testUrl' }} />);
  });
});
