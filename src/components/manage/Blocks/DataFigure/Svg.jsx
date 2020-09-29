/**
 * SVG image block.
 * @module components/manage/Blocks/DataFigure/Svg
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './less/public.less';
import { cleanSVG } from '@eeacms/volto-block-data-figure/helpers';
import { settings } from '@plone/volto/config';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getSVG } from '@eeacms/volto-block-data-figure/actions';
import {
  isInternalURL,
} from '@plone/volto/helpers';
/**
 * Svg block class.
 * @class Svg
 * @extends Component
 */
const Svg = ({ data, detached }) => {
  const [svg, setSVG] = React.useState();
  const dispatch = useDispatch();
  const { corsProxyPath = '/cors-proxy', host, port } = settings;

  const base = __SERVER__
    ? `http://${host}:${port}`
    : `${window.location.protocol}//${window.location.host}`;

  const path = `${base}${corsProxyPath}/${data.url}`;

  React.useEffect(() => {
    if (data.url.includes('.svg')) {
      if (!isInternalURL(data.url)) {
        dispatch(getSVG(path))
          .then((resp) => {
            setSVG(cleanSVG(resp));
          })
          .catch((err) => {
            setSVG(err);
          })
      }
      else {
        dispatch(getSVG(data.url))
          .then((resp) => {
            setSVG(cleanSVG(resp));
          })
          .catch((err) => {
            setSVG(err);
          });
      }
    }
  }, [dispatch, data]);

  return svg ? (
    <p
      className={cx(
        'block data-figure align',
        {
          center: !Boolean(data.align),
          detached,
        },
        data.align,
      )}
      dangerouslySetInnerHTML={{
        __html: svg,
      }}
    ></p>
  ) : (
      ''
    );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Svg.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Svg;
