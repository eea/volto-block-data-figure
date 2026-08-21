import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Sources from './Sources';

vi.mock('semantic-ui-react', () => ({
  Popup: ({ trigger, children, onOpen, onClose }) => (
    <div>
      <button onClick={onOpen}>open-popup</button>
      <button onClick={onClose}>close-popup</button>
      {trigger}
      <div>{children}</div>
    </div>
  ),
}));

vi.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => ({
  default: ({ children, ...props }) => (
    <a {...props} data-testid="universal-link">
      {children}
    </a>
  ),
}));

describe('Sources', () => {
  test('renders fallback message when no sources are available', () => {
    render(<Sources sources={[]} />);

    fireEvent.click(screen.getByText('open-popup'));
    fireEvent.click(screen.getByText('close-popup'));
    expect(
      screen.getByText('Data provenance is not set for this visualization.'),
    ).toBeInTheDocument();
  });

  test('renders list of source links and descriptions', () => {
    render(
      <Sources
        sources={[
          { chart_source_link: '/eurostat', chart_source: 'Eurostat' },
          { chart_source: 'Local source' },
          { title: 'No link source' },
          {
            title: 'EEA',
            link: '/eea',
            organisation: 'European Environment Agency',
          },
        ]}
      />,
    );

    expect(screen.getByText('Eurostat')).toBeInTheDocument();
    expect(screen.getByText('Local source')).toBeInTheDocument();
    expect(screen.getByText('No link source')).toBeInTheDocument();
    expect(screen.getByText('EEA')).toBeInTheDocument();
    expect(screen.getByText('European Environment Agency')).toBeInTheDocument();
  });
});
