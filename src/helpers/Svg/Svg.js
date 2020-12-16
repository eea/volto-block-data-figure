import { deserialize } from 'volto-slate/editor/deserialize';
import { settings } from '@plone/volto/config';
export const cleanSVG = (data) => {
  // base64 decode, if needed
  let text, svg;
  try {
    text = atob(data);
  } catch {
    text = data;
  }

  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'image/svg+xml');
    svg = xml.getElementsByTagName('svg')[0];
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  } catch {
    return text;
  }

  // base64 encode
  return svg.outerHTML;
};

export const extractSvg = (data = {}) => {
  return data?.items;
};

export const extractTemporal = (data = {}) => {
  return data.temporalCoverage;
};

export const extractMetadata = (data = {}) => {
  const { provenances, location, pdfStatic } = data;
  return {
    dataSources: { provenances },
    geoCoverage: location,
    downloadData: pdfStatic,
  };
};

export const validateHostname = (url) => {
  const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  return settings.allowed_cors_destinations.includes(domain);
};

export const getParsedValue = (data = []) => {
  const editor = {};
  const { slate } = settings;
  const { isInline = () => {}, isVoid = () => {} } = editor;
  editor.htmlTagsToSlate = slate.htmlTagsToSlate;
  editor.isInline = (element) => {
    return slate.inlineElements.includes(element.type)
      ? true
      : isInline(element);
  };
  editor.isVoid = (element) => {
    return element.type === 'img' ? true : isVoid(element);
  };

  const htmlStr = data
    .map((item) => `<a href=${item.link}><p>${item.title}</p></a>`)
    .join('\n');
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
  return deserialize(editor, doc.body);
};
