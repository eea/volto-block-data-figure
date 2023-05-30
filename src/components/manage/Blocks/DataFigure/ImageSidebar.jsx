import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Segment } from 'semantic-ui-react';
import SlateRichTextWidget from '@plone/volto-slate/widgets/RichTextWidget';

import { defineMessages, injectIntl } from 'react-intl';
import { CheckboxWidget, Icon, TextWidget } from '@plone/volto/components';
import { isArray } from 'lodash';

import { GeolocationWidget } from '@eeacms/volto-widget-geolocation/components';
import { TemporalWidget } from '@eeacms/volto-widget-temporal-coverage/components';
import {
  isChartImage,
  isInternalContentURL,
  flattenToContentURL,
} from '@eeacms/volto-block-data-figure/helpers';
import { flattenToAppURL } from '@plone/volto/helpers';

import './less/public.less';

import clearSVG from '@plone/volto/icons/clear.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';

const messages = defineMessages({
  Image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  Origin: {
    id: 'Origin',
    defaultMessage: 'Origin',
  },
  Title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  Align: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  Link: {
    id: 'Interactive link ',
    defaultMessage: 'Interactive link',
  },
  LinkLabel: {
    id: 'Label ',
    defaultMessage: 'Label',
  },
  dataSources: {
    id: 'Data sources ',
    defaultMessage: 'Data sources',
  },
  institutionalMandate: {
    id: 'Institutional mandate',
    defaultMessage: 'Institutional mandate',
  },
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
  NoImageSelected: {
    id: 'No image selected',
    defaultMessage: 'No image selected',
  },
  externalURL: {
    id: 'URL',
    defaultMessage: 'URL',
  },
  size: {
    id: 'Size',
    defaultMessage: 'Size',
  },
});

const ImageSidebar = ({
  data,
  block,
  onChangeBlock,
  openObjectBrowser,
  resetSubmitUrl,
  intl,
  svgs,
  instructions,
}) => {
  const { metadata } = data;
  const getDefaultValue = () => {
    return [
      {
        type: 'p',
        children: [{ text: '' }],
      },
    ];
  };
  const isImageData = data['@type'] === 'Image';

  const [activeAccIndex, setActiveAccIndex] = useState(0);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

  return (
    <div className="ui form">
      {!data.url && instructions && (
        <>
          <Segment attached>
            <div dangerouslySetInnerHTML={{ __html: instructions }} />
          </Segment>
        </>
      )}
      {data.url && (
        <>
          <Segment className="sidebar-metadata-container" secondary>
            {isImageData && data.url.split('/').slice(-1)[0]}
            {isImageData && (
              <img
                width="100%"
                src={`${flattenToAppURL(data.url)}/@@images/image`}
                alt={data.alt}
              />
            )}
            {!isImageData && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {isArray(svgs) && svgs.length > 0 ? (
                  svgs.map((it, idx) => (
                    <div key={idx}>
                      <p>{it.title}</p>
                      <img
                        src={
                          isChartImage(it.url)
                            ? it.url
                            : `${it.url}/@@images/image`
                        }
                        key={idx}
                        alt={it.alt}
                        style={{ width: '50%', cursor: 'pointer' }}
                        aria-hidden="true"
                        onClick={() => {
                          onChangeBlock(block, {
                            ...data,
                            url: it.url,
                          });
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <p>Image</p>
                    <img
                      src={
                        isInternalContentURL(data.url)
                          ? // Backwards compat in the case that the block is storing the full server URL
                            (() => {
                              return isChartImage(data.url)
                                ? `${flattenToContentURL(data.url)}`
                                : `${flattenToContentURL(
                                    data.url,
                                  )}/@@images/image`;
                            })()
                          : data.url
                      }
                      alt={data.alt}
                      style={{ width: '50%', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            )}
          </Segment>
          <Segment className="form sidebar-image-data">
            {isImageData && (
              <TextWidget
                id="Origin"
                title={intl.formatMessage(messages.Origin)}
                required={false}
                value={data.url.split('/').slice(-1)[0]}
                icon={data.url ? clearSVG : navTreeSVG}
                iconAction={
                  data.url
                    ? () => {
                        resetSubmitUrl();
                      }
                    : () => openObjectBrowser()
                }
                onChange={() => {}}
              />
            )}
            {!isImageData && (
              <TextWidget
                id="external"
                title={intl.formatMessage(messages.externalURL)}
                required={false}
                value={data.url}
                icon={clearSVG}
                iconAction={() => {
                  resetSubmitUrl();
                }}
                onChange={() => {}}
              />
            )}

            <TextWidget
              id="title"
              title={intl.formatMessage(messages.Title)}
              required={false}
              value={data.title}
              icon={data.title ? clearSVG : null}
              iconAction={() =>
                onChangeBlock(block, {
                  ...data,
                  title: '',
                })
              }
              onChange={(name, value) => {
                onChangeBlock(block, {
                  ...data,
                  title: value,
                });
              }}
            />
          </Segment>
          <Accordion fluid styled className="form">
            <Accordion.Title
              active={activeAccIndex === 0}
              index={0}
              onClick={handleAccClick}
            >
              Link Settings
              {activeAccIndex === 0 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 0}>
              <TextWidget
                id="link"
                title={intl.formatMessage(messages.Link)}
                required={false}
                value={data.href}
                icon={data.href ? clearSVG : navTreeSVG}
                iconAction={
                  data.href
                    ? () => {
                        onChangeBlock(block, {
                          ...data,
                          href: '',
                        });
                      }
                    : () => openObjectBrowser({ mode: 'link' })
                }
                onChange={(name, value) => {
                  onChangeBlock(block, {
                    ...data,
                    href: value,
                  });
                }}
              />
              <TextWidget
                id="link-label"
                title={intl.formatMessage(messages.LinkLabel)}
                required={false}
                value={data.label}
                icon={data.label && clearSVG}
                iconAction={() => {
                  onChangeBlock(block, {
                    ...data,
                    label: null,
                  });
                }}
                onChange={(name, value) => {
                  onChangeBlock(block, {
                    ...data,
                    label: value,
                  });
                }}
              />
              <CheckboxWidget
                id="openLinkInNewTab"
                title={intl.formatMessage(messages.openLinkInNewTab)}
                value={data.openLinkInNewTab ? data.openLinkInNewTab : false}
                onChange={(name, value) => {
                  onChangeBlock(block, {
                    ...data,
                    openLinkInNewTab: value,
                  });
                }}
              />
            </Accordion.Content>
            <Accordion.Title
              active={activeAccIndex === 1}
              index={1}
              onClick={handleAccClick}
            >
              Geographical Settings
              {activeAccIndex === 0 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 1}>
              <div className="sidebar-geo-data">
                <GeolocationWidget
                  value={data}
                  block={block}
                  id="geolocation"
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      [name]: value?.[name] || value,
                    });
                  }}
                  onChangeSchema={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      [name]: value?.[name] || value,
                    });
                  }}
                  intl={intl}
                />
              </div>
            </Accordion.Content>
            <Accordion.Title
              active={activeAccIndex === 2}
              index={2}
              onClick={handleAccClick}
            >
              Temporal Settings
              {activeAccIndex === 2 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 2}>
              <div className="sidebar-geo-data">
                <TemporalWidget
                  value={data}
                  block={block}
                  id="temporal"
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      [name]: value?.[name] || value,
                    });
                  }}
                  intl={intl}
                />
              </div>
            </Accordion.Content>
            <Accordion.Title
              active={activeAccIndex === 3}
              index={3}
              onClick={handleAccClick}
            >
              Data sources
              {activeAccIndex === 3 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 3}>
              <div>
                <SlateRichTextWidget
                  id="data_sources"
                  title={intl.formatMessage(messages.dataSources)}
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      metadata: {
                        ...data.metadata,
                        dataSources: {
                          ...(data?.metadata?.dataSources || {}),
                          value,
                        },
                      },
                    });
                  }}
                  className="data-source-toolbar"
                  block={block}
                  properties={data}
                  value={
                    metadata?.dataSources?.value?.length
                      ? metadata?.dataSources?.value
                      : getDefaultValue()
                  }
                  placeholder="Enter Data Sources"
                />
              </div>
            </Accordion.Content>
            <Accordion.Title
              active={activeAccIndex === 4}
              index={4}
              onClick={handleAccClick}
            >
              Institutional mandate
              {activeAccIndex === 4 ? (
                <Icon name={upSVG} size="20px" />
              ) : (
                <Icon name={downSVG} size="20px" />
              )}
            </Accordion.Title>
            <Accordion.Content active={activeAccIndex === 4}>
              <div>
                <SlateRichTextWidget
                  id="institutional_mandate"
                  title={intl.formatMessage(messages.institutionalMandate)}
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      metadata: {
                        ...data.metadata,
                        institutionalMandate: {
                          ...(data?.metadata?.institutionalMandate || {}),
                          value,
                        },
                      },
                    });
                  }}
                  className="institutional-mandate-toolbar"
                  block={block}
                  properties={data}
                  value={
                    metadata?.institutionalMandate?.value?.length
                      ? metadata?.institutionalMandate?.value
                      : getDefaultValue()
                  }
                  placeholder="Enter Institutional Mandate"
                />
              </div>
            </Accordion.Content>
          </Accordion>
        </>
      )}
    </div>
  );
};

ImageSidebar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  openObjectBrowser: PropTypes.func.isRequired,
  resetSubmitUrl: PropTypes.func.isRequired,
};

export default injectIntl(ImageSidebar);
