import { halfPixel } from './spatial';

var setupProteins = function setupProteins(_ref) {
  var d3 = _ref.d3,
      chart = _ref.chart,
      defs = _ref.defs,
      onProteinMouseover = _ref.onProteinMouseover,
      onProteinMouseout = _ref.onProteinMouseout,
      data = _ref.data,
      scale = _ref.scale,
      yAxisOffset = _ref.yAxisOffset,
      xAxisOffset = _ref.xAxisOffset,
      proteinHeight = _ref.proteinHeight,
      height = _ref.height,
      uniqueSelector = _ref.uniqueSelector;


  var proteinBars = chart.append('g').selectAll('rect').data(data.proteins).enter().append('rect').attrs({
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    class: function _class(d) {
      return 'range-' + d.id + '-' + d.start + '-' + d.end;
    },
    x: function x(d) {
      return d.start * scale + yAxisOffset + halfPixel;
    },
    y: height - xAxisOffset + halfPixel,
    width: function width(d) {
      return (d.end - d.start) * scale;
    },
    height: proteinHeight - halfPixel,
    fill: function fill(d, i) {
      return 'hsl(' + i * 100 + ', 80%, 90%)';
    }
  }).on('mouseover', function (d, i) {
    d3.select(this).attrs({
      fill: 'hsl(' + i * 100 + ', 85%, 70%)',
      cursor: 'pointer'
    });

    if (onProteinMouseover) {
      onProteinMouseover(d, d3.event);
    } else {  
      let mouse=d3.mouse(this);
      d3.select('.my-tooltip')
      .style('left', Math.trunc(mouse[0] + 20) + 'px')
      .style('top', Math.trunc(mouse[1] -22) + 'px')
      .style('display','block')
      .style('opacity',1.0)
      .html('<div>' + d.id + '</div><div>' + d.description + '</div><div><b>Click to zoom</b></div>');
    }
  }).on('mouseout', function (d, i) {
    d3.select(this).attrs({
      fill: 'hsl(' + i * 100 + ', 80%, 90%)'
    });

    if (onProteinMouseout) onProteinMouseout(d, d3.event);

    d3.select('.my-tooltip').style('display', 'none');
  });

  var proteinClipPaths = defs.append('g').attr('class', 'protein-text-clip-path').selectAll('clipPath').data(data.proteins).enter().append('clipPath').attr('id', function (d) {
    return uniqueSelector + '-clip-range-' + d.id + '-' + d.start + '-' + d.end;
  }).append('rect').attrs({
    class: function _class(d) {
      return 'clip-range-' + d.id + '-' + d.start + '-' + d.end + '-rect';
    },
    x: function x(d) {
      return d.start * scale + yAxisOffset + halfPixel;
    },
    y: height - xAxisOffset + halfPixel,
    width: function width(d) {
      return (d.end - d.start) * scale;
    },
    height: proteinHeight - halfPixel
  });

  var proteinNames = chart.append('g').attrs({
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)'
  }).selectAll('text').data(data.proteins).enter().append('text').text(function (d) {
    return d.id.toUpperCase();
  }).attrs({
    class: function _class(d) {
      return 'protein-name-' + d.id + '-' + d.start + '-' + d.end;
    },
    'clip-path': function clipPath(d) {
      return 'url(#' + uniqueSelector + '-clip-range-' + d.id + '-' + d.start + '-' + d.end + ')';
    },
    x: function x(d) {
      return d.start * scale + yAxisOffset;
    },
    y: height - xAxisOffset + proteinHeight,
    fill: function fill(d, i) {
      return 'hsl(' + i * 100 + ', 80%, 30%)';
    },
    'font-size': '11px',
    'pointer-events': 'none'
  });

  var proteinMinimap = chart.append('g').selectAll('rect').data(data.proteins).enter().append('rect').attrs({
    class: function _class(d) {
      return 'domain-' + d.id;
    },
    x: function x(d) {
      return d.start * scale + yAxisOffset;
    },
    y: height - xAxisOffset + proteinHeight + 60,
    width: function width(d) {
      return (d.end - d.start) * scale;
    },
    height: 10 - halfPixel,
    fill: function fill(d, i) {
      return 'hsl(' + i * 100 + ', 80%, 90%)';
    },
    'pointer-events': 'none'
  });

  return {
    proteinBars: proteinBars,
    proteinClipPaths: proteinClipPaths,
    proteinNames: proteinNames,
    proteinMinimap: proteinMinimap
  };
};

/*----------------------------------------------------------------------------*/

export default setupProteins;