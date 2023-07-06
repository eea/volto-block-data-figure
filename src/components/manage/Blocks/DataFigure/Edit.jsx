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
import loadable from '@loadable/component';
import { toast } from 'react-toastify';
import cx from 'classnames';
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
  isPNGImage,
  isTableImage,
  getBlockPosition,
  setImageSize,
} from '@eeacms/volto-block-data-figure/helpers';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import { getInternalContent } from '@eeacms/volto-block-data-figure/actions';

import { Icon, SidebarPortal, Toast } from '@plone/volto/components';
import { createContent } from '@plone/volto/actions';
import { getBaseUrl, flattenToAppURL } from '@plone/volto/helpers';
import { eeaCountries } from '@eeacms/volto-widget-geolocation/components';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';

import DataTable from './Table';

const Dropzone = loadable(() => import('react-dropzone'));

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
    id: 'You need to save the document before being able to edit this area.',
    defaultMessage:
      'You need to save the document before being able to edit this area.',
  },
  invalidImage: {
    id: 'Invalid Image',
    defaultMessage: 'Invalid Image',
  },
  invalidResolution: {
    id: 'Minimum image resolution should be {resolution}.',
    defaultMessage: 'Minimum image resolution should be {resolution}.',
  },
  imageNameError: {
    id:
      'Invalid image. Image name can NOT start with image_. Please rename it first.',
    defaultMessage:
      'Invalid image. Image name can NOT start with image_. Please rename it first.',
  },
  duplicateImageError: {
    id: 'Image already exists.',
    defaultMessage: 'Image already exists.',
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
    dragging: false,
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
      tabledata: null,
      metadata: {},
      geolocation: null,
      temporal: [],
    },
    scaledImage: '',
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
        dragging: false,
      });
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        ...this.state.data,
        url: nextProps.content['@id'],
        title: nextProps.content.title,
      });
    }
    if (this.props?.data?.url !== nextProps?.data?.url) {
      this.internalURLContents(nextProps.block, nextProps?.data?.url);
    }

    if (this.props?.scales !== nextProps?.scales) {
      const scaledImage =
        this.props?.data?.url && nextProps?.scales
          ? setImageSize(
              this.props?.data?.url,
              nextProps.scales,
              this.props?.data?.align === 'full' ? 'h' : this.props?.data?.size,
            )
          : '';
      this.setState({
        scaledImage,
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
        dragging: false,
      });
    }

    // Invalid Image Upload
    if (
      this.props.subrequests[this.props.block]?.loading &&
      nextProps.subrequests[this.props.block]?.error
    ) {
      let content =
        nextProps.subrequests[this.props.block]?.error?.response?.statusText;
      if (
        this.isDuplicateImageError(
          nextProps.subrequests[this.props.block]?.error?.response,
        )
      ) {
        content = this.props.intl.formatMessage(messages.duplicateImageError);
      }

      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.invalidImage)}
          content={content}
        />,
      );
      this.setState({
        error:
          nextProps.subrequests[this.props.block]?.error?.response?.statusText,
        uploading: false,
        dragging: false,
      });
    }
  }

  isDuplicateImageError = (errorResponse) => {
    if (errorResponse === undefined) {
      return false;
    }

    try {
      const jsonResponse = JSON.parse(errorResponse.text);
      return (
        jsonResponse?.message &&
        jsonResponse?.message.includes('it is already in use')
      );
    } catch {
      return false;
    }
  };

  getImageAndValidate = async (file, data) => {
    const fields = data.match(/^data:(.*);(.*),(.*)$/);
    let localImageUrl = window.URL.createObjectURL(file);
    try {
      await new Promise((resolve, reject) => {
        let imageObject = new Image();
        imageObject.onload = () => {
          file.width = imageObject.naturalWidth;
          file.height = imageObject.naturalHeight;
          window.URL.revokeObjectURL(localImageUrl);
          resolve();
        };
        imageObject.onerror = reject;
        imageObject.src = localImageUrl;
      });
    } catch (e) {
      file.width = 0;
      file.height = 0;
      window.URL.revokeObjectURL(localImageUrl);
    }

    if (this.isValidImage(file)) {
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
    } else {
      this.setState(
        {
          uploading: false,
          dragging: false,
        },
        () =>
          toast.error(
            <Toast
              error
              title={this.props.intl.formatMessage(messages.invalidImage)}
              content={this.props.intl.formatMessage(
                messages.invalidResolution,
                {
                  resolution:
                    config.blocks.blocksConfig['dataFigure'].minResolution,
                },
              )}
            />,
          ),
      );
    }
  };

  onDragEnter = () => {
    this.setState({ dragging: true });
  };
  onDragLeave = () => {
    this.setState({ dragging: false });
  };

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
    let file = e.target.files[0];
    const error = this.onValidateImage(file);
    if (error) {
      return;
    }

    this.setState({
      uploading: true,
    });

    readAsDataURL(file).then((data) => {
      this.getImageAndValidate(file, data);
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
    this.setState({ url: url, error: null, uploading: false, dragging: false });
  };

  /**
   * @method isValidImage
   * @param {Object} file object
   * @memberof Edit
   * @returns {Boolean}
   */
  isValidImage = (file) => {
    const resolution = config.blocks.blocksConfig['dataFigure'].minResolution;

    return !(
      file.width < resolution.split('x')[0] ||
      file.height < resolution.split('x')[1]
    );
  };

  onClearUrl = () => {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      ...this.state.data,
    });
  };

  extractTable = async (data) => {
    return data?.['@components']?.['table'] || {};
  };

  extractAssets = async (arr) => {
    let url;
    const metadata = extractMetadata(arr);
    if (arr['@type'] === 'EEAFigure') {
      for (const idx in arr.items) {
        const figureFile = arr.items[idx];
        const result = isInternalContentURL(figureFile.url)
          ? await this.internalURLContents(this.props.block, figureFile.url)
          : await this.externalURLContents(figureFile.url);
        const pngUrl = result.items.filter((item) => isPNGImage(item['@id']));
        if (pngUrl.length) {
          metadata.downloadData = result.items.map((item) => item.url);
          url = pngUrl;
          break;
        }
      }
    } else if (arr['@type'] === 'DavizVisualization') {
      const svgUrl = arr['@components']?.['charts']?.['items'] || [];
      url = svgUrl
        .map((item) => {
          const fallback = item['fallback-image'];
          return !fallback.includes('dashboard')
            ? { url: fallback, title: item['title'] }
            : null;
        })
        .filter((item) => item);
    } else {
      url = extractSvg(arr);
    }
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

  internalURLContents = async (block = this.props.block, url) => {
    await this.props.getInternalContent(block, flattenToAppURL(url));
    return this.props.subrequests?.[block]?.data;
  };

  externalURLContents = async (url) => {
    await this.props.getProxiedExternalContent(url, {
      headers: { Accept: 'application/json' },
    });
    return this.props.subrequests[url]?.data;
  };

  componentDidMount() {
    if (this.props?.data?.url) {
      this.internalURLContents(this.props.block, this.props?.data?.url);
    }
  }

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

    const isValidUrl = this.state.url
      ? isInternalContentURL(this.state.url) || validateHostname(this.state.url)
      : false;
    if (isValidUrl) {
      let tabledata,
        figureUrl = this.state.url;
      const arr = isInternalContentURL(this.state.url)
        ? await this.internalURLContents(this.props.block, this.state.url)
        : await this.externalURLContents(this.state.url);
      const [
        temporal,
        chartUrl = [],
        title,
        figureType,
        metadata = {},
      ] = await this.extractAssets(arr);
      if (arr['@type'] === 'DavizVisualization') {
        tabledata = await this.extractTable(arr);
      }
      if (this.state.error) {
        this.setState({ uploading: false, dragging: false }, () =>
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
            dragging: false,
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
              tabledata: tabledata,
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
        this.setState({ uploading: false, dragging: false }, () =>
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
      this.setState({ uploading: false, dragging: false }, () =>
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
      dragging: false,
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
      this.getImageAndValidate(file[0], data);
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
      this.resetSubmitUrl();
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
    const { scaledImage } = this.state;
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
          data.align && scaledImage ? data.align : 'center',
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
        {data.url && isSVGImage(data.url) ? (
          <Svg data={data} detached={detached} scales={scaledImage} />
        ) : data.url && isTableImage(data.url) ? (
          <DataTable data={data} />
        ) : data.url ? (
          <img
            src={flattenToAppURL(scaledImage?.download)}
            alt={data.title || ''}
            width={scaledImage?.width}
            height={scaledImage?.height}
          />
        ) : (
          <div>
            <Dropzone
              noClick
              onDrop={this.onDrop}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              className="dropzone"
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <Message>
                    {this.state.dragging && <Dimmer active></Dimmer>}
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
                            <Icon
                              name={navTreeSVG}
                              size="24px"
                              title="Browser for existing Data Visualization"
                            />
                          </Button>
                        </Button.Group>
                        <Button.Group>
                          <label className="ui button basic icon">
                            <Icon
                              name={uploadSVG}
                              size="24px"
                              title="Upload image from your computer"
                            />
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
                              <Icon
                                name={clearSVG}
                                size="30px"
                                title="Cancel"
                              />
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
                            <Icon name={aheadSVG} size="30px" title="Add" />
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
            scaledImage={scaledImage}
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
      scales: state.content.subrequests[ownProps.block]?.data?.image,
    }),
    {
      getInternalContent,
      createContent,
      getProxiedExternalContent,
    },
  ),
)(Edit);
