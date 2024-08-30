import { v4 as uuid } from 'uuid';
import config from '@plone/volto/registry';
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

    let width = svg.getAttribute('width');
    let height = svg.getAttribute('height');
    const viewBox = svg.getAttribute('viewBox');
    
    if ((!width || !height) && viewBox) {
      const viewBoxValues = viewBox.split(' ').map(Number);
      if (viewBoxValues.length === 4) {
        width = viewBoxValues[2].toString();
        height = viewBoxValues[3].toString();
      }
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
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

export const organisations = {
  'http://www.eea.europa.eu': 'European Environment Agency (EEA)',
  'https://www.eea.europa.eu': 'European Environment Agency (EEA)',
  'http://www.eea.europa.eu/': 'European Environment Agency (EEA)',
  'https://www.eea.europa.eu/': 'European Environment Agency (EEA)',
};

export const extractDataProvenance = (data = {}) => {
  const provenances =
    data?.['@components']?.['provenances']?.['items'] ||
    data?.['provenances'] ||
    [];
  return {
    data: provenances.map((item) => ({
      '@id': uuid(),
      link: item.link,
      title: item.title,
      organisation: item.organisation || organisations[item.owner] || '',
    })),
  };
};

export const extractMetadata = (data = {}) => {
  const { location } = data;
  return {
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
  return isInternalURL(url);
};

export const flattenToContentURL = (url) => {
  if (!isInternalURL(url)) {
    return cleanUrl(url);
  }
  return cleanUrl(flattenToAppURL(url));
};
