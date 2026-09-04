import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MoreInfo from './MoreInfo';

vi.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => ({
  default: ({ children, ...props }) => (
    <a {...props} data-testid="universal-link">
      {children}
    </a>
  ),
}));

describe('MoreInfo', () => {
  test('renders a link when href is provided', () => {
    render(<MoreInfo href="https://example.com/more" />);

    const link = screen.getByTestId('universal-link');
    expect(link).toHaveAttribute('href', 'https://example.com/more');
    expect(screen.getByText('More info')).toBeInTheDocument();
  });

  test('renders fallback span when href is missing', () => {
    render(<MoreInfo />);

    expect(screen.getByText('More info')).toBeInTheDocument();
    expect(screen.queryByTestId('universal-link')).not.toBeInTheDocument();
  });
});
