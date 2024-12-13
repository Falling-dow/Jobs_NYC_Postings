r2d3.onRender(function(data, svg, width, height, options) {
  
  svg.selectAll("*").remove();
  
  var margin = {top: 20, right: 20, bottom: 50, left: 60};
  var plotWidth = width - margin.left - margin.right;
  var plotHeight = height - margin.top - margin.bottom;
  
  var parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(function(d) {
    d.Posting_Month = parseDate(d.Posting_Month);
    d.job_count = +d.job_count;
    d.median_salary = +d.median_salary;
  });
  
  data = data.filter(d => d.Posting_Month instanceof Date && !isNaN(d.Posting_Month));
  
  var yVar = options.yvar;
  var yMax = d3.max(data, d => d[yVar]);
  var xExtent = d3.extent(data, d => d.Posting_Month);

  if (xExtent[0] && xExtent[1] && xExtent[0].getTime() === xExtent[1].getTime()) {
    var singleDate = xExtent[0];
    var startDate = new Date(singleDate);
    startDate.setDate(startDate.getDate() - 15);
    var endDate = new Date(singleDate);
    endDate.setDate(endDate.getDate() + 15);
    xExtent = [startDate, endDate];
  }

  if (!xExtent[0] || !xExtent[1]) {
    return;
  }

  var xScale = d3.scaleTime()
    .domain(xExtent)
    .range([margin.left, margin.left + plotWidth]);
  
  var yScale = d3.scaleLinear()
    .domain([0, yMax || 0])
    .nice()
    .range([margin.top + plotHeight, margin.top]);
  
  var xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeMonth.every(1))
    .tickFormat(d3.timeFormat("%b"));
  
  var yLabel = (yVar === "job_count") ? "Number of Job Posts" : "Median Salary";
  var yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
    .attr("transform", `translate(0, ${margin.top + plotHeight})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .style("text-anchor", "middle")
    .text("Posting Month");
  
  svg.append("text")
    .attr("x", -(height / 2))
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text(yLabel);

  if (data.length > 0) {
    var line = d3.line()
      .x(d => xScale(d.Posting_Month))
      .y(d => yScale(d[yVar]))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    var tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("padding", "5px 10px")
      .style("background", "rgba(255,255,255,0.9)")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    var hoverMetricName = (yVar === "job_count") ? "Median Salary" : "Number of Job Posts";
    var hoverMetricValue = function(d) {
      return (yVar === "job_count") ? d.median_salary : d.job_count;
    };
    
    svg.selectAll("circle.point")
      .data(data)
      .enter().append("circle")
      .attr("class", "point")
      .attr("cx", d => xScale(d.Posting_Month))
      .attr("cy", d => yScale(d[yVar]))
      .attr("r", 4)
      .attr("fill", "red")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "orange");

        var monthFormat = d3.timeFormat("%B");
        tooltip.html(
          "<strong>" + monthFormat(d.Posting_Month) + "</strong><br/>" +
          yLabel + ": " + d[yVar] + "<br/>" +
          hoverMetricName + ": " + hoverMetricValue(d)
        );

        tooltip.transition().duration(200).style("opacity", 1);
      })
      .on("mousemove", function(event) {
        var tooltipNode = tooltip.node();
        var tooltipWidth = tooltipNode.getBoundingClientRect().width;

        var xPos = event.pageX + 10;
        var yPos = event.pageY - 28;

        if ((xPos + tooltipWidth) > (window.innerWidth - 20)) {
          xPos = event.pageX - tooltipWidth - 20;
        }

        tooltip.style("left", xPos + "px")
               .style("top", yPos + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "red");
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }
});
