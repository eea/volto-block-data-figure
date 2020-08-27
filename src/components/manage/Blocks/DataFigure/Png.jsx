/**
 * PNG/JPEG image block.
 * @module components/manage/Blocks/DataFigure/Png
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

/**
 * PNG image block class.
 * @class View
 * @extends Component
 */
const Png = ({ data, detached }) => (
  <p
    className={cx(
      'block image align',
      {
        center: !Boolean(data.align),
        detached,
      },
      data.align,
    )}
  >
    {data.url && (
      <>
        {(() => {
          const image = (
            <img
              className={cx({
                'full-width': data.align === 'full',
                large: data.size === 'l',
                medium: data.size === 'm',
                small: data.size === 's',
              })}
              src={
                isInternalURL(data.url)
                  ? // Backwards compat in the case that the block is storing the full server URL
                    (() => {
                      if (data.size === 'l')
                        return `${flattenToAppURL(data.url)}/@@images/image`;
                      if (data.size === 'm')
                        return `${flattenToAppURL(
                          data.url,
                        )}/@@images/image/preview`;
                      if (data.size === 's')
                        return `${flattenToAppURL(
                          data.url,
                        )}/@@images/image/mini`;
                      return `${flattenToAppURL(data.url)}/@@images/image`;
                    })()
                  : data.url
              }
              alt={data.alt || ''}
            />
          );
          if (data.href) {
            if (!isInternalURL(data.href)) {
              return (
                <a
                  target={data.openLinkInNewTab ? '_blank' : null}
                  href={data.href}
                >
                  {image}
                </a>
              );
            } else {
              return (
                <Link
                  to={flattenToAppURL(data.href)}
                  target={data.openLinkInNewTab ? '_blank' : null}
                >
                  {image}
                </Link>
              );
            }
          } else {
            return image;
          }
        })()}
      </>
    )}
  </p>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Png.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Png;
