/**
 * SVG image block.
 * @module components/manage/Blocks/DataFigure/Svg
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './less/public.less';

import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

/**
 * Svg block class.
 * @class Svg
 * @extends Component
 */
const Table = ({ data, detached }) => {
    const [table, setTable] = React.useState();
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (data.href) {
            dispatch(getProxiedExternalContent(data.href))
                .then((resp) => {
                    setTable(resp);
                })
                .catch((err) => {
                    setTable(err);
                });
        }
    }, [dispatch, data])

    return table ? (
        <div dangerouslySetInnerHTML={{
            __html: table,
        }} />
    ) : (
            ''
        );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Table.propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Table;
