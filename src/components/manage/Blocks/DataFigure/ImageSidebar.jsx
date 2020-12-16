import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Segment } from 'semantic-ui-react';
import SlateRichTextWidget from 'volto-slate/widgets/RichTextWidget';
import { serializeNodesToText } from 'volto-slate/editor/render';

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { CheckboxWidget, Icon, TextWidget } from '@plone/volto/components';
import { isArray } from 'lodash';

import { GeolocationWidget } from '@eeacms/volto-widget-geolocation/components';
import { TemporalWidget } from '@eeacms/volto-widget-temporal-coverage/components';
import { getParsedValue } from '@eeacms/volto-block-data-figure/helpers';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

import './less/public.less';

import imageSVG from '@plone/volto/icons/image.svg';
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
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
  NoImageSelected: {
    id: 'No image selected',
    defaultMessage: 'No image selected',
  },
  externalURL: {
    id: 'External URL',
    defaultMessage: 'External URL',
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
}) => {
  const { metadata } = data;
  const getDefaultValue = () => {
    return metadata?.dataSources?.provenances
      ? getParsedValue(metadata?.dataSources?.provenances)
      : [
          {
            type: 'p',
            children: [{ text: '' }],
          },
        ];
  };

  const [activeAccIndex, setActiveAccIndex] = useState(0);

  function handleAccClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeAccIndex === index ? -1 : index;

    setActiveAccIndex(newIndex);
  }

  return (
    <Segment.Group raised>
      <header className="header pulled">
        <h2>
          <FormattedMessage id="Image" defaultMessage="Image" />
        </h2>
      </header>

      {!data.url && (
        <>
          <Segment className="sidebar-metadata-container" secondary>
            <FormattedMessage
              id="No image selected"
              defaultMessage="No image selected"
            />
            <Icon name={imageSVG} size="100px" color="#b8c6c8" />
          </Segment>
        </>
      )}
      {data.url && (
        <>
          <Segment className="sidebar-metadata-container" secondary>
            {isInternalURL(data.url) && data.url.split('/').slice(-1)[0]}
            {isInternalURL(data.url) && (
              <img
                width="100%"
                src={`${flattenToAppURL(data.url)}/@@images/image/mini`}
                alt={data.alt}
              />
            )}
            {!isInternalURL(data.url) && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {isArray(svgs) && svgs.length > 0 ? (
                  svgs.map((it, ind) => (
                    <div key={ind}>
                      <p>Image {ind + 1}</p>
                      <img
                        src={it.url}
                        key={ind}
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
                      src={data.url}
                      alt={data.alt}
                      style={{ width: '50%', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            )}
          </Segment>
          <Segment className="form sidebar-image-data">
            {isInternalURL(data.url) && (
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
                        onChangeBlock(block, {
                          ...data,
                          url: '',
                        });
                      }
                    : () => openObjectBrowser()
                }
                onChange={() => {}}
              />
            )}
            {!isInternalURL(data.url) && (
              <TextWidget
                id="external"
                title={intl.formatMessage(messages.externalURL)}
                required={false}
                value={data.url}
                icon={clearSVG}
                iconAction={() => {
                  resetSubmitUrl();

                  onChangeBlock(block, {
                    ...data,
                    url: '',
                  });
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
                  data={data}
                  block={block}
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      geolocation: isArray(name)
                        ? name.map((item) => {
                            return { label: item.label, value: item.value };
                          })
                        : null,
                    });
                  }}
                  onChangeSchema={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      [value]: name,
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
                  data={data}
                  block={block}
                  onChange={(name, value) => {
                    onChangeBlock(block, {
                      ...data,
                      temporal: name
                        ? name.map((item) => {
                            return { label: item.label, value: item.value };
                          })
                        : null,
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
                          ...(data.metadata?.dataSources || {}),
                          value:
                            value.length > 0
                              ? value
                              : [
                                  {
                                    type: 'p',
                                    children: [{ text: '' }],
                                  },
                                ],
                        },
                      },
                    });
                  }}
                  className="data-source-toolbar"
                  block={block}
                  properties={data}
                  value={metadata?.dataSources?.value || getDefaultValue()}
                  placeholder="Enter Data Sources"
                />
              </div>
            </Accordion.Content>
          </Accordion>
        </>
      )}
    </Segment.Group>
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
