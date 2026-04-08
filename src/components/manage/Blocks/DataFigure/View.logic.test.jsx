import View from './View';

describe('View logic', () => {
  const RawView = View.WrappedComponent;

  test('hasValidText handles arrays, objects and strings', () => {
    const instance = new RawView({
      data: {},
      id: 'block-id',
      metadata: {},
      properties: {},
      screen: {},
    });

    expect(instance.hasValidText(' text ')).toBe(true);
    expect(instance.hasValidText('   ')).toBe(false);
    expect(
      instance.hasValidText([
        { type: 'paragraph', children: [{ text: 'ok' }] },
      ]),
    ).toBe(true);
    expect(
      instance.hasValidText([{ type: 'paragraph', children: [{ text: ' ' }] }]),
    ).toBe(false);
    expect(instance.hasValidText({ children: [{ text: 'nested' }] })).toBe(
      true,
    );
    expect(instance.hasValidText(null)).toBe(false);
  });

  test('componentWillReceiveProps toggles mobile state based on width', () => {
    const instance = new RawView({
      data: {},
      id: 'block-id',
      metadata: {},
      properties: {},
      screen: { page: { width: 800 } },
    });

    instance.setState = (update) => {
      const nextState =
        typeof update === 'function'
          ? update(instance.state, instance.props)
          : update;
      instance.state = { ...instance.state, ...nextState };
    };

    instance.state = {
      ...instance.state,
      mobile: false,
      ref: { current: { parentElement: { offsetWidth: 500 } } },
    };

    instance.componentWillReceiveProps({
      screen: { page: { width: 500 } },
    });
    expect(instance.state.mobile).toBe(true);

    instance.state = {
      ...instance.state,
      mobile: true,
      ref: { current: { parentElement: { offsetWidth: 700 } } },
    };

    instance.componentWillReceiveProps({
      screen: { page: { width: 700 } },
    });
    expect(instance.state.mobile).toBe(false);
  });
});
