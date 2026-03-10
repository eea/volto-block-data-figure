import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import installSlate from '@plone/volto-slate/index';
import applyConfig from './src';

var mockSemanticComponents = jest.requireActual('semantic-ui-react');
var mockComponents = jest.requireActual('@plone/volto/components');
var config = jest.requireActual('@plone/volto/registry').default;
var hasStandaloneVoltoSlate = fs.existsSync(
  path.join(process.cwd(), 'node_modules', '@plone', 'volto-slate', 'src'),
);
var blocksConfig = hasStandaloneVoltoSlate
  ? {}
  : jest.requireActual('@plone/volto/config/Blocks').blocksConfig;

config.blocks.blocksConfig = {
  ...blocksConfig,
  ...config.blocks.blocksConfig,
};

var testConfig = [installSlate, applyConfig].reduce(
  (acc, apply) => apply(acc),
  config,
);

jest.doMock('semantic-ui-react', () => ({
  __esModule: true,
  ...mockSemanticComponents,
  Popup: ({ content, trigger }) => {
    return (
      <div className="popup">
        <div className="trigger">{trigger}</div>
        <div className="content">{content}</div>
      </div>
    );
  },
}));

jest.doMock('@plone/volto/components', () => {
  return {
    __esModule: true,
    ...mockComponents,
    SidebarPortal: ({ children }) => <div id="sidebar">{children}</div>,
  };
});

jest.doMock('@plone/volto/registry', () =>
  testConfig,
);

const mockStore = configureStore([thunk]);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
);

global.store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
  content: {
    create: {},
    subrequests: [],
  },
  connected_data_parameters: {},
  screen: {
    page: {
      width: 768,
    },
  },
});
