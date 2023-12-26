import Svg from './Svg';
import { render } from '@testing-library/react';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const store = mockStore({
  screen: {
    page: {
      width: 768,
    },
  },
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
});
describe('View component', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Svg data={{ url: '' }} />
      </Provider>,
    );
  });
});
