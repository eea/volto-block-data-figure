import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Metadata from './Metadata';
import '@testing-library/jest-dom/extend-expect';

const MetadataWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Initially open

  const handleCloseClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <button onClick={handleCloseClick}>Close Sidebar</button>
      {isSidebarOpen && children}
    </div>
  );
};

const mockData = {
  data_provenance: { data: [{ source: 'Test Source' }] },
  geolocation: [{ label: 'Europe' }],
  temporal: [{ start_date: '2023-01-01' }],
};

describe('Metadata Component', () => {
  it('Renders the Sidebar', () => {
    render(<Metadata visible={true} data={mockData} onHide={jest.fn()} />);
    const sidebarHeader = screen.getByRole('heading', { name: /Metadata/i });
    expect(sidebarHeader).toBeInTheDocument();
  });

  it('Renders the Data Provenance Widget', () => {
    render(<Metadata visible={true} data={mockData} onHide={jest.fn()} />);
    const dataProvenanceHeader = screen.getByText('Data Sources:');
    expect(dataProvenanceHeader).toBeInTheDocument();
  });

  it('Renders the geographic coverage list', () => {
    render(<Metadata visible={true} data={mockData} onHide={jest.fn()} />);
    const lists = screen.getAllByRole('list');
    const geoList = lists[1];
    const geoListItem = screen.getByText('Europe', { selector: 'li' });
    expect(geoList).toBeInTheDocument();
    expect(geoListItem).toBeInTheDocument();
  });

  it('Renders the Temporal Widget', () => {
    render(<Metadata visible={true} data={mockData} onHide={jest.fn()} />);
    const temporalHeader = screen.getByText('Temporal coverage:');
    expect(temporalHeader).toBeInTheDocument();
  });

  it('Calls onHide when the sidebar is closed', () => {
    const mockOnHide = jest.fn();
    render(
      <MetadataWrapper>
        <Metadata visible data={mockData} onHide={mockOnHide} />
      </MetadataWrapper>,
    );

    const closeButton = screen.getByText('Close Sidebar');
    fireEvent.click(closeButton);

    expect(mockOnHide).toHaveBeenCalled();
  });
});
