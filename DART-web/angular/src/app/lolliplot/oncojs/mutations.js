import { halfPixel } from './spatial';
import theme from './theme';

var setupMutations = function setupMutations(_ref) {
  var d3 = _ref.d3,
      consequenceColors = _ref.consequenceColors,
      scaleLinearY = _ref.scaleLinearY,
      hasCustomMutationColor = _ref.hasCustomMutationColor,
      getMutationColor = _ref.getMutationColor,
      onMutationClick = _ref.onMutationClick,
      onMutationMouseover = _ref.onMutationMouseover,
      onMutationMouseout = _ref.onMutationMouseout,
      data = _ref.data,
      yAxisOffset = _ref.yAxisOffset,
      xAxisOffset = _ref.xAxisOffset,
      height = _ref.height,
      proteinHeight = _ref.proteinHeight,
      scale = _ref.scale,
      store = _ref.store,
      mutationId = _ref.mutationId,
      chart = _ref.chart,
      uniqueSelector = _ref.uniqueSelector;

  var mutationChartLines = chart.append('g').selectAll('line').data(data.mutations).enter().append('line').attrs({
    class: function _class(d) {
      return 'mutation-line-' + d.id;
    },
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    x1: function x1(d) {
      return d.x * scale + yAxisOffset + halfPixel;
    },
    y1: height - xAxisOffset,
    x2: function x2(d) {
      return d.x * scale + yAxisOffset + halfPixel;
    },
    y2: function y2(d) {
      return scaleLinearY(d.donors);
    },
    stroke: 'rgba(0, 0, 0, 0.2)'
  });

  var mutationChartCircles = chart.append('g').selectAll('circle').data(data.mutations).enter().append('circle').attrs({
    class: function _class(d) {
      return 'mutation-circle-' + d.id + ' ' + (d.id === mutationId ? 'selected-mutation' : '');
    },
    'clip-path': 'url(#' + uniqueSelector + '-chart-clip)',
    cx: function cx(d) {
      return d.x * scale + yAxisOffset + halfPixel;
    },
    cy: function cy(d) {
      return scaleLinearY(d.donors);
    },
    r: theme.mutationRadius,
    fill: function fill(d) {
      return hasCustomMutationColor ? getMutationColor(d) : consequenceColors[d.consequence];
    }
  }).on('mouseover', function (d) {
    if (!store.getState().animating) {
      if (onMutationMouseover) {
        onMutationMouseover(d, d3.event);
      } else {
        d3.select('.my-tooltip').style('pointer-events', 'none').style('left', d3.event.pageX + 20 + 'px').style('top', d3.event.pageY - 22 + 'px').html('\n              <div>Mutation ID: ' + d.id + '</div>\n              <div># of Cases: ' + d.donors + '</div>\n              <div>Amino Acid Change: Arg<b>' + d.x + '</b>Ter</div>\n              <div>Functional Impact: ' + d.impact + '</div>\n            ');
      }
    }
  }).on('mouseout', function (d) {
    if (!store.getState().animating) {
      d3.select('.my-tooltip').style('left', '-9999px');
      if (onMutationMouseout) onMutationMouseout(d, d3.event);
    }
  }).on('click', function (d) {
    return onMutationClick(d, d3.event);
  });

  var selectedMutation = data.mutations.filter(function (d) {
    return d.id === mutationId;
  }).map(function (d) {
    return Object.assign({}, d, { size: theme.mutationRadius * 3 });
  });

  var selectedMutationBox = chart.append('g').selectAll('rect').data(selectedMutation).enter().append('rect').attrs({
    class: 'selected-mutation-box',
    x: function x(d) {
      return d.x * scale + yAxisOffset - d.size / 2;
    },
    y: function y(d) {
      return scaleLinearY(d.donors) - d.size / 2;
    },
    width: function width(d) {
      return d.size;
    },
    height: function height(d) {
      return d.size;
    },
    fill: 'none',
    stroke: 'rgb(251, 94, 45)',
    'stroke-width': 2
  }).on('mouseover', function (d) {
    if (!store.getState().animating) {
      if (onMutationMouseover) {
        onMutationMouseover(d, d3.event);
      } else {
        d3.select('.my-tooltip').style('pointer-events', 'none').style('left', d3.event.pageX + 20 + 'px').style('top', d3.event.pageY - 22 + 'px').html('\n              <div>Mutation ID: ' + d.id + '</div>\n              <div># of Cases: ' + d.donors + '</div>\n              <div>Amino Acid Change: Arg<b>' + d.x + '</b>Ter</div>\n              <div>Functional Impact: ' + d.impact + '</div>\n            ');
      }
    }
  }).on('mouseout', function (d) {
    if (!store.getState().animating) {
      d3.select('.my-tooltip').style('left', '-9999px');
      if (onMutationMouseout) onMutationMouseout(d, d3.event);
    }
  }).on('click', function (d) {
    return onMutationClick(d, d3.event);
  });

  data.mutations.forEach(function (d) {
    // Mutation lines on minimap

    chart.append('line').attrs({
      class: 'mutation-line-' + d.id,
      x1: d.x * scale + yAxisOffset,
      y1: height - xAxisOffset + proteinHeight + 60,
      x2: d.x * scale + yAxisOffset + halfPixel,
      y2: Math.max(height - xAxisOffset + proteinHeight - d.donors * 4.5 + 60, height - xAxisOffset + proteinHeight + 20),
      stroke: theme.black,
      'pointer-events': 'none'
    });
  });

  return { mutationChartLines: mutationChartLines, mutationChartCircles: mutationChartCircles, selectedMutationBox: selectedMutationBox };
};

var updateMutations = function (_ref2) {
  var d3Root = _ref2.d3Root,
      checked = _ref2.checked,
      mutationClass = _ref2.mutationClass,
      type = _ref2.type,
      data = _ref2.data;

  var selectedMutations = mutationClass ? data.mutations.filter(function (x) {
    return x[mutationClass] === type;
  }) : data.mutations.slice();

  if (!checked) {
    selectedMutations.forEach(function (d) {
      d3Root.select('.mutation-line-' + d.id).attr('opacity', 0);
      d3Root.selectAll('.mutation-circle-' + d.id).attr('opacity', 0);
    });
  } else {
    selectedMutations.forEach(function (d) {
      d3Root.select('.mutation-line-' + d.id).attr('opacity', 1);
      d3Root.selectAll('.mutation-circle-' + d.id).attr('opacity', 1);
    });
  }
};

export { setupMutations, updateMutations };