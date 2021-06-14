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
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getSVG } from '@eeacms/volto-block-data-figure/actions';
import { isInternalURL, isSVGImage } from '@plone/volto/helpers';
/**
 * Svg block class.
 * @class Svg
 * @extends Component
 */
const Svg = ({ data, detached }) => {
  const [svg, setSVG] = React.useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isSVGImage(data.url)) {
      if (!isInternalURL(data.url)) {
        dispatch(
          getProxiedExternalContent(data.url, {
            headers: { Accept: 'image/svg+xml' },
          }),
        )
          .then((resp) => {
            setSVG(cleanSVG(resp));
          })
          .catch((err) => {
            setSVG(err);
          });
      } else {
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
