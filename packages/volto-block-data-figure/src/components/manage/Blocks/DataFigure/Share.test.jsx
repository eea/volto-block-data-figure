import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Share from './Share';

vi.mock('semantic-ui-react', () => ({
  Popup: ({ trigger, content, onOpen, onClose }) => (
    <div>
      <button onClick={onOpen}>open-popup</button>
      <button onClick={onClose}>close-popup</button>
      {trigger}
      {content}
    </div>
  ),
  Input: (props) => (
    <input readOnly value={props.value} className={props.className} />
  ),
  Button: ({ children, onClick, className, primary }) => (
    <button data-primary={primary} className={className} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('Share', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('copies the URL and resets the button state', async () => {
    navigator.clipboard.writeText.mockResolvedValue(undefined);

    render(<Share href="https://example.com/figure" />);

    expect(
      screen.getByDisplayValue('https://example.com/figure'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('open-popup'));
    await act(async () => {
      fireEvent.click(screen.getByText('Copy'));
      await Promise.resolve();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://example.com/figure',
    );
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
    fireEvent.click(screen.getByText('close-popup'));
  });

  test('shows a failure message when copy fails', async () => {
    navigator.clipboard.writeText.mockRejectedValue(new Error('copy failed'));

    render(<Share href="https://example.com/figure" />);
    await act(async () => {
      fireEvent.click(screen.getByText('Copy'));
      await Promise.resolve();
    });

    expect(
      screen.getByText('Copy failed. Please try again.'),
    ).toBeInTheDocument();
  });
});
