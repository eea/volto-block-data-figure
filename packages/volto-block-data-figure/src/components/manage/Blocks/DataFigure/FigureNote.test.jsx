import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import FigureNote, { serializeText } from './FigureNote';

vi.mock('@plone/volto-slate/editor/render', () => ({
  serializeNodes: vi.fn(() => <strong>Serialized note</strong>),
  serializeNodesToText: vi.fn(() => 'serialized-text'),
}));

vi.mock('semantic-ui-react', () => ({
  Popup: ({ trigger, content, onOpen, onClose }) => (
    <div>
      <button onClick={onOpen}>open-popup</button>
      <button onClick={onClose}>close-popup</button>
      {trigger}
      <div>{content}</div>
    </div>
  ),
}));

describe('FigureNote', () => {
  test('serializeText handles string and empty values', () => {
    expect(serializeText('Simple note')).toBe('Simple note');
    render(<div>{serializeText(null)}</div>);
    expect(
      screen.getByText('There are no notes set for this visualization'),
    ).toBeInTheDocument();
  });

  test('serializeText handles slate node arrays', () => {
    render(
      <div>
        {serializeText([{ type: 'paragraph', children: [{ text: 'x' }] }])}
      </div>,
    );
    expect(screen.getByText('Serialized note')).toBeInTheDocument();
  });

  test('renders figure note trigger and popup content', () => {
    render(<FigureNote notes="Some note" />);

    fireEvent.click(screen.getByText('open-popup'));
    fireEvent.click(screen.getByText('close-popup'));
    expect(screen.getByText('Some note')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
  });
});
