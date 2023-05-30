import config from '@plone/volto/registry';
import { deserialize } from '@plone/volto-slate/editor/deserialize';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';
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
  return data?.items?.filter((item) => isSVGImage(item['@id']));
};

export const cleanUrl = (url) => url?.split('#')[0].split('?')[0];
export const isSVGImage = (url) => cleanUrl(url).endsWith('.svg');
export const isPNGImage = (url) => cleanUrl(url).endsWith('dpi.png');
export const isTableImage = (url) =>
  cleanUrl(url).endsWith('table.preview.png');
export const isChartSVGImage = (url) =>
  cleanUrl(url).endsWith('embed-chart.svg');
export const isChartImage = (url) => isChartSVGImage(url) || isTableImage(url);

export const extractTemporal = (data = {}) => {
  return data.temporalCoverage || [];
};

export const extractMetadata = (data = {}) => {
  const { location } = data;
  const provenances =
    data?.['@components']?.['provenances']?.['items'] ||
    data?.['provenances'] ||
    [];
  const rods =
    data?.['@components']?.['rods']?.['items'] || data?.['rods'] || [];
  return {
    dataSources: {
      provenances,
      value: getParsedValue(provenances),
    },
    institutionalMandate: {
      rods,
      value: getParsedValue(rods),
    },
    geoCoverage: location,
    downloadData:
      data['@type'] === 'DavizVisualization'
        ? {
            html: `${data['@id']}/download.table`,
            csv: `${data['@id']}/download.csv`,
            tsv: `${data['@id']}/download.tsv`,
            json: `${data['@id']}/download.json`,
            exhibit: `${data['@id']}/download.exhibit`,
            xml: `${data['@id']}/download.xml`,
            xmlSchema: `${data['@id']}/download.schema.xml`,
          }
        : data.items?.map((item) => item.url),
  };
};

export const validateHostname = (url) => {
  const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  return config.settings.allowed_cors_destinations.includes(domain);
};

export const isInternalContentURL = (url) => {
  if (isInternalURL(url)) {
    return true;
  }
  const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  return config.settings.apiPath.includes(domain);
};

export const flattenToContentURL = (url) => {
  url = url ? flattenToAppURL(url) : url;
  if (url?.startsWith('http')) {
    if (isInternalContentURL(url)) {
      return cleanUrl(url).replace(/^http.*?\/\/[a-zA-Z0-9.]+/, '');
    }
  }
  return cleanUrl(url);
};

export const getParsedValue = (data = []) => {
  const editor = {};
  const { slate } = config.settings;
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
  const existing = [];
  const htmlStr = data
    .map((item) => {
      const link = item.source_link || item.link;
      if (existing.includes(link)) {
        return false;
      } else {
        existing.push(link);
        const title = item.source_title?.trim() || item.title.trim();
        return `<p><a href=${link}>${title}</a></p>`;
      }
    })
    .filter((item) => item)
    .join('\n');
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
  return deserialize(editor, doc.body);
};
