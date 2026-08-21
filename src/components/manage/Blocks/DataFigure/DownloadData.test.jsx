import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import DownloadData from './DownloadData';

vi.mock('@plone/volto/helpers/Url/Url', () => ({
  getParentUrl: vi.fn(() => '/parent'),
}));

vi.mock('semantic-ui-react', () => {
  const List = ({ children }) => <ul>{children}</ul>;
  List.Item = ({ children, href }) => <a href={href}>{children}</a>;

  return {
    Popup: ({ trigger, content, onOpen, onClose }) => (
      <div>
        <button onClick={onOpen}>open-popup</button>
        <button onClick={onClose}>close-popup</button>
        {trigger}
        <div>{content}</div>
      </div>
    ),
    Header: ({ children }) => <h5>{children}</h5>,
    List,
  };
});

describe('DownloadData', () => {
  test('renders DavizVisualization download formats', () => {
    render(
      <DownloadData
        data={{
          figureType: 'DavizVisualization',
          metadata: {
            downloadData: {
              html: '/html',
              csv: '/csv',
              tsv: '/tsv',
              json: '/json',
              exhibit: '/exhibit',
              xml: '/xml',
              xmlSchema: '/xml-schema',
            },
          },
        }}
      />,
    );

    fireEvent.click(screen.getByText('open-popup'));
    fireEvent.click(screen.getByText('close-popup'));
    expect(
      screen.getByText('Formats suitable for human consumption'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Formats suitable for machine-to-machine communication'),
    ).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
  });

  test('renders EEAFigure original format for zoom links', () => {
    render(
      <DownloadData
        data={{
          figureType: 'EEAFigure',
          metadata: { downloadData: ['https://example.com/file.zoom'] },
        }}
      />,
    );

    expect(screen.getByText('ORIGINAL')).toBeInTheDocument();
    expect(screen.getByText('ORIGINAL').closest('a')).toHaveAttribute(
      'href',
      '/parent/at_download/file',
    );
  });

  test('renders fallback when data is unavailable', () => {
    render(
      <DownloadData
        data={{
          figureType: 'UnknownFigure',
          metadata: {},
        }}
      />,
    );

    expect(screen.getByText('Data not available')).toBeInTheDocument();
  });
});
