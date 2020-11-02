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

export const extractSvg = (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'text/html');
  const img = Array.from(html.getElementsByTagName('img'));
  const src = img.filter((it) => it.src.includes('embed-chart.svg?'));
  if (src.length > 0) return src;
  const nonDavizPNG = html.querySelector('.figures-download-links');
  return nonDavizPNG ? nonDavizPNG.children[2].firstElementChild.href : [];
};

export const extractTable = (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'text/html');
  const table = html.querySelector('.download-visualization a');
  return table ? table.getAttribute('href') : '';
};

export const extractTemporal = (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'text/html');
  const coverage = html.querySelector('#tempCoverage');
  return coverage ? coverage.innerText.trim() : '';
};

export const extractMetadata = (data) => {
  let coverageList = [];
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'text/html');
  const dataSources = html.querySelector('div.visualization-info');
  const geoCoverage = html.querySelector('div.geotags');
  const downloadData = html.querySelector('div.download-visualization');
  if (geoCoverage) {
    for (let items of geoCoverage.children) {
      coverageList.push(items.innerText);
    }
  }
  return {
    dataSources: dataSources?.innerHTML.trim(),
    geoCoverage: coverageList,
    downloadData: downloadData.innerHTML.trim(),
  };
};
