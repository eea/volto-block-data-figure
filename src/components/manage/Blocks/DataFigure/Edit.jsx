/**
 * Edit image block.
 * @module components/manage/Blocks/Image/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';
import {
  Button,
  Dimmer,
  Input,
  Loader,
  Message,
  Header,
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import cx from 'classnames';
import Dropzone from 'react-dropzone';
import config from '@plone/volto/registry';

import ImageSidebar from './ImageSidebar';
import Svg from './Svg';
import {
  extractSvg,
  extractTemporal,
  extractMetadata,
  validateHostname,
  isInternalContentURL,
  flattenToContentURL,
  isSVGImage,
  getBlockPosition,
} from '@eeacms/volto-block-data-figure/helpers';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getInternalContent } from '@eeacms/volto-block-data-figure/actions';

import { Icon, SidebarPortal, Toast } from '@plone/volto/components';
import { createContent } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';
import { eeaCountries } from '@eeacms/volto-widget-geolocation/components';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';

const messages = defineMessages({
  ImageBlockInputPlaceholder: {
    id: 'Data Visualization URL or SVG/PNG image',
    defaultMessage: 'Data Visualization URL or SVG/PNG image',
  },
  Error: {
    id: 'Image(s) not found',
    defaultMessage: 'Image(s) not found.',
  },
  ErrorMessage: {
    id: 'Please use valid daviz url.',
    defaultMessage: 'Please use valid daviz url.',
  },
  thereWereSomeErrors: {
    id: 'There were some errors.',
    defaultMessage: 'There were some errors.',
  },
  disabledMessage: {
    id: 'You need to save the document before beeing able to edit this area.',
    defaultMessage:
      'You need to save the document before beeing able to edit this area.',
  },
  invalidImage: {
    id: 'Invalid Image',
    defaultMessage: 'Invalid Image',
  },
  imageNameError: {
    id:
      'Invalid image. Image name can NOT start with image_. Please rename it first.',
    defaultMessage:
      'Invalid image. Image name can NOT start with image_. Please rename it first.',
  },
});

/**
 * Edit image block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    content: PropTypes.objectOf(PropTypes.any),
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
  };

  state = {
    uploading: false,
    url: '',
    position: 0,
    data: {
      url: null,
      href: null,
      label: null,
      openLinkInNewTab: null,
      figureUrl: null,
      figureType: null,
      title: null,
      svgs: null,
      table: null,
      metadata: {},
      geolocation: null,
      temporal: null,
    },
  };

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.request.loading &&
      nextProps.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        ...this.state.data,
        url: nextProps.content['@id'],
        title: nextProps.content.title,
      });
    }

    if (!this.state.position) {
      // Block position in page
      this.setState({
        position: getBlockPosition(
          this.props.metadata || this.props.properties,
          this.props.block,
        ),
      });
    }

    // Invalid Daviz URL
    if (
      this.props.subrequests[this.state.url]?.loading &&
      nextProps.subrequests[this.state.url]?.error
    ) {
      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.invalidImage)}
          content={
            nextProps.subrequests[this.state.url]?.error?.response?.statusText
          }
        />,
      );
      this.setState({
        error: nextProps.subrequests[this.state.url].error,
        uploading: false,
      });
    }

    // Invalid Image Upload
    if (
      this.props.subrequests[this.props.block]?.loading &&
      nextProps.subrequests[this.props.block]?.error
    ) {
      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.invalidImage)}
          content={
            nextProps.subrequests[this.props.block]?.error?.response?.statusText
          }
        />,
      );
      this.setState({
        error:
          nextProps.subrequests[this.props.block]?.error?.response?.statusText,
        uploading: false,
      });
    }
  }

  onValidateImage = (image) => {
    // Empty image
    if (!image?.name) {
      return this.props.intl.formatMessage(messages.invalidImage);
    }

    // Avoid uploading scale images
    if (image?.name?.startsWith('image_')) {
      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.invalidImage)}
          content={this.props.intl.formatMessage(messages.imageNameError)}
        />,
      );
      return this.props.intl.formatMessage(messages.imageNameError);
    }
  };

  /**
   * Upload image handler
   * @method onUploadImage
   * @returns {undefined}
   */
  onUploadImage = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    const error = this.onValidateImage(file);
    if (error) {
      return;
    }

    this.setState({
      uploading: true,
    });

    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
        {
          '@type': 'Image',
          title: file.name,
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        },
        this.props.block,
      );
    });
  };

  /**
   * Change url handler
   * @method onChangeTargetUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeTargetUrl = ({ target }) => {
    this.setState({
      url: flattenToContentURL(target.value),
      error: null,
    });
  };

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {String} url URL string
   * @returns {undefined}
   */
  onChangeUrl = (url) => {
    this.setState({ url: url, error: null, uploading: false });
  };

  onClearUrl = () => {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      ...this.state.data,
    });
  };

  extractTable = async (data) => {
    let arr = [];
    const tableUrl = `${data['@id']}/download.table`;
    const url = flattenToContentURL(tableUrl);
    if (isInternalContentURL(url)) {
      try {
        await this.props.getInternalContent(url, {
          headers: { Accept: 'text/html' },
        });
      } catch (e) {
        toast.error(
          <Toast
            error
            title={this.props.intl.formatMessage(messages.thereWereSomeErrors)}
            content={this.props.intl.formatMessage({
              id: e.message,
              defaultMessage: e.message,
            })}
          />,
        );
      }
    } else {
      await this.props.getProxiedExternalContent(url, {
        headers: { Accept: 'text/html' },
      });
    }

    if (this.props.subrequests[url]?.error) {
      return arr;
    }
    for (const key in this.props.subrequests[url]?.data) {
      arr.push(this.props.subrequests[url].data[key]);
    }
    return arr;
  };

  extractAssets = async (arr) => {
    let url;
    if (arr['@type'] === 'EEAFigure') {
      const result = isInternalContentURL(arr.items[0].url)
        ? await this.internalURLContents(arr.items[0].url)
        : await this.externalURLContents(arr.items[0].url);
      const pngUrl = result.items.filter((item) =>
        item['@id'].includes('dpi.png'),
      );
      url = pngUrl;
    } else if (arr['@type'] === 'DavizVisualization') {
      const svgUrl = arr['@components']?.['charts']?.['items'] || [];
      url = svgUrl.map((item) => {
        return { url: item['fallback-image'], title: item['title'] };
      });
    } else {
      url = extractSvg(arr);
    }
    const metadata = extractMetadata(arr);
    const temporal = extractTemporal(arr);
    const title = arr.title;
    const figureType = arr['@type'];
    return [temporal, url, title, figureType, metadata];
  };

  getGeoNameWithIds(metadata) {
    const { geoCoverage } = metadata;
    const GeoNameWithIds = geoCoverage?.map((item) => {
      return eeaCountries.find((name) => name.label === item);
    });
    const filteredGeonames = GeoNameWithIds?.filter(
      (item) => item !== undefined,
    );
    return filteredGeonames;
  }

  internalURLContents = async (url) => {
    await this.props.getInternalContent(url);
    return this.props.subrequests[url]?.data;
  };

  externalURLContents = async (url) => {
    await this.props.getProxiedExternalContent(url, {
      headers: { Accept: 'application/json' },
    });
    return this.props.subrequests[url]?.data;
  };

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {object} e Event
   * @returns {undefined}
   */
  onSubmitUrl = async () => {
    this.setState({
      uploading: true,
    });

    const isValidUrl =
      isInternalContentURL(this.state.url) || validateHostname(this.state.url);
    if (isValidUrl) {
      let table,
        figureUrl = this.state.url;
      const arr = isInternalContentURL(this.state.url)
        ? await this.internalURLContents(this.state.url)
        : await this.externalURLContents(this.state.url);
      const [
        temporal,
        chartUrl = [],
        title,
        figureType,
        metadata = {},
      ] = await this.extractAssets(arr);
      if (arr['@type'] === 'DavizVisualization') {
        table = await this.extractTable(arr);
        table = table?.join('') || '';
        const parser = new DOMParser();
        const xml = parser.parseFromString(table, 'text/html');
        table = xml.getElementsByTagName('table')?.[0]?.outerHTML || '';
      }
      if (this.state.error) {
        this.setState({ uploading: false }, () =>
          toast.error(
            <Toast
              error
              title={this.props.intl.formatMessage(messages.Error)}
              content={this.props.intl.formatMessage(messages.ErrorMessage)}
            />,
          ),
        );
      } else if (
        config.blocks.blocksConfig['dataFigure'].type.some(
          (item) => item === arr['@type'],
        ) &&
        chartUrl.length > 0
      ) {
        this.setState(
          {
            url: chartUrl[0].url || chartUrl,
            uploading: false,
          },
          () =>
            this.props.onChangeBlock(this.props.block, {
              ...this.props.data,
              ...this.state.data,
              url: this.state.url,
              href: figureUrl,
              label: `explore ${title}`,
              openLinkInNewTab: true,
              figureUrl,
              figureType,
              title,
              svgs: chartUrl,
              table: table || '',
              metadata,
              geolocation: this.getGeoNameWithIds(metadata),
              temporal: temporal?.map((item) => ({
                value: item,
                label: item,
              })),
            }),
        );
      } else if (this.state.url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null) {
        this.props.onChangeBlock(this.props.block, {
          ...this.props.data,
          ...this.state.data,
          url: this.state.url,
        });
      } else {
        this.setState({ uploading: false }, () =>
          toast.error(
            <Toast
              error
              title={this.props.intl.formatMessage(messages.Error)}
              content={this.props.intl.formatMessage(messages.ErrorMessage)}
            />,
          ),
        );
      }
    } else {
      this.setState({ uploading: false }, () =>
        toast.error(
          <Toast
            error
            title={this.props.intl.formatMessage(messages.Error)}
            content={this.props.intl.formatMessage(messages.ErrorMessage)}
          />,
        ),
      );
    }
  };

  resetSubmitUrl = () => {
    this.setState({
      url: '',
      uploading: false,
    });
    this.onClearUrl();
  };

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  onDrop = (file) => {
    const error = this.onValidateImage(file[0]);
    if (error) {
      return;
    }

    this.setState({
      uploading: true,
    });

    readAsDataURL(file[0]).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
        {
          '@type': 'Image',
          title: file[0].name,
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file[0].name,
          },
        },
        this.props.block,
      );
    });
  };

  /**
   * Keydown handler on Variant Menu Form
   * This is required since the ENTER key is already mapped to a onKeyDown
   * event and needs to be overriden with a child onKeyDown.
   * @method onKeyDownVariantMenuForm
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDownVariantMenuForm = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // TODO: Do something on ESC key
    }
  };

  node = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { data, detached, formDescription } = this.props;
    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.ImageBlockInputPlaceholder);

    // Get editing instructions from block settings or props
    let instructions = data?.instructions?.data || data?.instructions;
    if (!instructions || instructions === '<p><br/></p>') {
      instructions = formDescription;
    }

    return (
      <div
        className={cx(
          'block image align data-figure-edit',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
        data-disabled-msg={
          data.disabledMessage ||
          this.props.intl.formatMessage(messages.disabledMessage)
        }
      >
        {data.title && (
          <Header>
            Figure {this.state.position}. {data.title}
          </Header>
        )}
        {data.url && data.url.includes('.svg') ? (
          <Svg data={data} detached={detached} />
        ) : data.url ? (
          <img
            src={
              isInternalContentURL(data.url)
                ? // Backwards compat in the case that the block is storing the full server URL
                  (() => {
                    return isSVGImage(data.url)
                      ? `${flattenToContentURL(data.url)}`
                      : `${flattenToContentURL(data.url)}/@@images/image`;
                  })()
                : data.url
            }
            alt={data.title || ''}
          />
        ) : (
          <div>
            <Dropzone noClick onDrop={this.onDrop} className="dropzone">
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <Message>
                    {this.state.uploading && (
                      <Dimmer active>
                        <Loader indeterminate>Uploading image</Loader>
                      </Dimmer>
                    )}
                    <div className="no-image-wrapper">
                      <img src={imageBlockSVG} alt="" />
                      <div className="toolbar-inner">
                        <Button.Group>
                          <Button
                            basic
                            icon
                            onClick={(e) => {
                              e.stopPropagation();
                              this.props.openObjectBrowser({
                                mode: 'daviz',
                                selectableTypes: [
                                  'DavizVisualization',
                                  'EEAFigure',
                                  'Image',
                                ],
                                onSelectItem: (url, item) => {
                                  this.onChangeUrl(url);
                                  this.props.closeObjectBrowser();
                                },
                              });
                            }}
                          >
                            <Icon name={navTreeSVG} size="24px" />
                          </Button>
                        </Button.Group>
                        <Button.Group>
                          <label className="ui button basic icon">
                            <Icon name={uploadSVG} size="24px" />
                            <input
                              {...getInputProps({
                                type: 'file',
                                onChange: this.onUploadImage,
                                style: { display: 'none' },
                              })}
                            />
                          </label>
                        </Button.Group>
                        <Input
                          onKeyDown={this.onKeyDownVariantMenuForm}
                          onChange={this.onChangeTargetUrl}
                          placeholder={placeholder}
                          value={this.state.url}
                          // Prevents propagation to the Dropzone and the opening
                          // of the upload browser dialog
                          onClick={(e) => e.stopPropagation()}
                        />
                        {this.state.url && (
                          <Button.Group>
                            <Button
                              basic
                              className="cancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.resetSubmitUrl();
                              }}
                            >
                              <Icon name={clearSVG} size="30px" />
                            </Button>
                          </Button.Group>
                        )}
                        <Button.Group>
                          <Button
                            basic
                            primary
                            disabled={!this.state.url}
                            onClick={(e) => {
                              e.stopPropagation();
                              this.onSubmitUrl();
                            }}
                          >
                            <Icon name={aheadSVG} size="30px" />
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                  </Message>
                </div>
              )}
            </Dropzone>
          </div>
        )}
        <SidebarPortal selected={this.props.selected}>
          <ImageSidebar
            {...this.props}
            svgs={this.props.data.svgs}
            instructions={instructions}
            resetSubmitUrl={this.resetSubmitUrl}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, ownProps) => ({
      request: state.content.subrequests[ownProps.block] || {},
      content: state.content.subrequests[ownProps.block]?.data,
      subrequests: state.content.subrequests,
    }),
    {
      getInternalContent,
      createContent,
      getProxiedExternalContent,
    },
  ),
)(Edit);
