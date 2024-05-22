/**
 * Table image block.
 * @module components/manage/Blocks/DataFigure/Svg
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
/**
 * Svg block class.
 * @class Svg
 * @extends Component
 */
const DataTable = ({ data }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let headers = data?.tabledata?.properties || {};

  const [headersSorted, setHeadersSorted] = React.useState([]);

  React.useEffect(() => {
    setHeadersSorted(
      Object.keys(headers)
        .map((key) => ({
          key: key,
          ...headers[key],
        }))

        .sort((a, b) => a.order - b.order),
    );
  }, [headers]);

  const rows = data?.tabledata?.items || [];

  return headers ? (
    <>
      <Table compact striped className="responsive">
        <Table.Header>
          <Table.Row>
            {headersSorted.map((item) => (
              <Table.HeaderCell>{item.label || item.key}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, idx) => (
            <Table.Row key={`tabledata-${idx}`}>
              {headersSorted.map((header) => (
                <Table.Cell data-label={header.label}>
                  {row[header.key] !== null && row[header.key] !== undefined
                    ? row[header.key]
                    : ''}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  ) : (
    <div>
      Data table is not directly available for this figure, please consult Data
      sources.
    </div>
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DataTable.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DataTable;
