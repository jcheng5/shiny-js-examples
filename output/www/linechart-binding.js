// Put code in an Immediately Invoked Function Expression (IIFE).
// This isn't strictly necessary, but it's good JavaScript hygiene.
(function() {

// See http://rstudio.github.io/shiny/tutorial/#building-outputs for
// more information on creating output bindings.

// First create a generic output binding instance, then overwrite
// specific methods whose behavior we want to change.
var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  // For the given scope, return the set of elements that belong to
  // this binding.
  return $(scope).find(".nvd3-linechart");
};

binding.renderValue = function(el, data) {
  // This function will be called every time we receive new output
  // values for a line chart from Shiny. The "el" argument is the
  // div for this particular chart.
  
  var $el = $(el);
    
  // The first time we render a value for a particular element, we
  // need to initialize the nvd3 line chart and d3 selection. We'll
  // store these on $el as a data value called "state".
  if (!$el.data("state")) {
    var chart = nv.models.lineChart()
      .margin({left: 100})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(true)
      .showYAxis(true)
      .showXAxis(true);
      
    chart.xAxis     //Chart x-axis settings
      .axisLabel('Time (ms)')
      .tickFormat(d3.format(',r'));
 
    chart.yAxis     //Chart y-axis settings
      .axisLabel('Voltage (v)')
      .tickFormat(d3.format('.02f'));

    nv.utils.windowResize(chart.update);
    
    var selection = d3.select(el).select("svg");
    
    // Store the chart object on el so we can get it next time
    $el.data("state", {
      chart: chart,
      selection: selection
    });
  }
  
  // Now, the code that'll run every time a value is rendered...
  
  // Retrieve the chart and selection we created earlier
  var state = $el.data("state");
  
  // Schedule some work with nvd3
  nv.addGraph(function() {
    // Update the chart
    state.selection
      .datum(reshapeData(data))
      .transition(500)
      .call(state.chart);
    return state.chart;
  });
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding, "shinyjsexamples.nvd3-linechart");


/**
 * Data comes in as:
 * 
 * {
 *   "Series A": [1,2,3,4,5],
 *   "Series B": [6,7,8,9,10]
 * }
 * 
 * D3 expects:
 * 
 * [
 *   {
 *     key: "Series A",
 *     values: [{x:1,y:1}, {x:2,y:2}, {x:3,y:3}, {x:4,y:4}, {x:5,y:5}]
 *   },
 *   {
 *     key: "Series B",
 *     values: [{x:1,y:6}, {x:2,y:7}, {x:3,y:8}, {x:4,y:9}, {x:5,y:10}]
 *   }
 * ]
 */
function reshapeData(data) {
  return $.map(data, function(value, key) {
    return {
      values: $.map(value, function(y, x) {
        return {x: x, y: y}
      }),
      key: key
    };
  });
}

})();
