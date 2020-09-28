/**
 * SVG image block.
 * @module components/manage/Blocks/DataFigure/Svg
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './less/public.less';
import { settings } from '@plone/volto/config';
import { getTable } from '@eeacms/volto-block-data-figure/actions';
import {
    isInternalURL,
} from '@plone/volto/helpers';
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
            dispatch(getTable(`http://${settings.host}:${settings.port}/cors-proxy/${data.href}`))
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
