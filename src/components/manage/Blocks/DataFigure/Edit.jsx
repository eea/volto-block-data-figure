/**
 * Edit image block.
 * @module components/manage/Blocks/Image/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';
import { Button, Dimmer, Input, Loader, Message } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import cx from 'classnames';
import Dropzone from 'react-dropzone';

import ImageSidebar from './ImageSidebar';
import Svg from './Svg';
import {
  extractSvg,
  extractTable,
  extractTemporal,
} from '@eeacms/volto-block-data-figure/helpers';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

import { Icon, SidebarPortal, Toast } from '@plone/volto/components';
import { createContent } from '@plone/volto/actions';
import {
  flattenToAppURL,
  getBaseUrl,
  isInternalURL,
} from '@plone/volto/helpers';

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
    content: PropTypes.objectOf(PropTypes.any).isRequired,
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
    svg: [],
    metadata: '',
    temporal: '',
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
        url: nextProps.content['@id'],
        alt: nextProps.content.title,
      });
    }
  }

  /**
   * Upload image handler
   * @method onUploadImage
   * @returns {undefined}
   */
  onUploadImage = ({ target }) => {
    const file = target.files[0];
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
   * Align block handler
   * @method onAlignBlock
   * @param {string} align Alignment option
   * @returns {undefined}
   */
  onAlignBlock(align) {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      align,
    });
  }

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      url: target.value,
    });
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

    if (!isInternalURL(this.state.url)) {
      let url, href, temporal;
      await this.props
        .getProxiedExternalContent(this.state.url, {
          headers: { Accept: 'text/html' },
        })
        .then((resp) => {
          temporal = extractTemporal(resp);
          url = extractSvg(resp);
          href = extractTable(resp);
          this.props
            .getProxiedExternalContent(href, {
              headers: { Accept: 'text/html' },
            })
            .then((e) =>
              url.length > 0
                ? this.setState(
                    {
                      url: url[0].src,
                      temporal,
                      uploading: false,
                    },
                    () =>
                      this.props.onChangeBlock(this.props.block, {
                        ...this.props.data,
                        url: this.state.url,
                        svgs: url,
                        metadata: e,
                        temporal: this.state.temporal,
                      }),
                  )
                : this.setState({ uploading: false }, () =>
                    toast.error(
                      <Toast
                        error
                        title={this.props.intl.formatMessage(messages.Error)}
                        content={this.props.intl.formatMessage(
                          messages.ErrorMessage,
                        )}
                      />,
                    ),
                  ),
            )
            .catch((err) =>
              this.setState({ uploading: false }, () =>
                toast.error(
                  <Toast
                    error
                    title={this.props.intl.formatMessage(messages.Error)}
                    content={this.props.intl.formatMessage(
                      messages.ErrorMessage,
                    )}
                  />,
                ),
              ),
            );
        })
        .catch((err) =>
          this.setState({ uploading: false }, () =>
            toast.error(
              <Toast
                error
                title={this.props.intl.formatMessage(messages.Error)}
                content={this.props.intl.formatMessage(messages.ErrorMessage)}
              />,
            ),
          ),
        );
    } else {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: this.state.url,
      });
    }
  };

  resetSubmitUrl = () => {
    this.setState({
      url: '',
    });
  };

  resetTemporalCoverage = () => {
    this.setState({
      temporal: '',
    });
  };

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  onDrop = (file) => {
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
    const { data, detached } = this.props;
    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.ImageBlockInputPlaceholder);
    return (
      <div
        className={cx(
          'block image align',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        {data.url && data.url.includes('.svg') ? (
          <Svg data={data} detached={detached} />
        ) : data.url ? (
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
                      return `${flattenToAppURL(data.url)}/@@images/image/mini`;
                    return `${flattenToAppURL(data.url)}/@@images/image`;
                  })()
                : data.url
            }
            alt={data.alt || ''}
          />
        ) : (
          <div>
            <Dropzone disableClick onDrop={this.onDrop} className="dropzone">
              <Message>
                {this.state.uploading && (
                  <Dimmer active>
                    <Loader indeterminate>Uploading image</Loader>
                  </Dimmer>
                )}
                <center>
                  <img src={imageBlockSVG} alt="" />
                  <div className="toolbar-inner">
                    <Button.Group>
                      <Button
                        basic
                        icon
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.openObjectBrowser();
                        }}
                      >
                        <Icon name={navTreeSVG} size="24px" />
                      </Button>
                    </Button.Group>
                    <Button.Group>
                      <label className="ui button basic icon">
                        <Icon name={uploadSVG} size="24px" />
                        <input
                          type="file"
                          onChange={this.onUploadImage}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </Button.Group>
                    <Input
                      onKeyDown={this.onKeyDownVariantMenuForm}
                      onChange={this.onChangeUrl}
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
                            this.setState({ url: '' });
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
                </center>
              </Message>
            </Dropzone>
          </div>
        )}
        <SidebarPortal selected={this.props.selected}>
          <ImageSidebar
            {...this.props}
            svgs={this.props.data.svgs}
            resetSubmitUrl={this.resetSubmitUrl}
            resetTemporalCoverage={this.resetTemporalCoverage}
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
    }),
    { createContent, getProxiedExternalContent },
  ),
)(Edit);
