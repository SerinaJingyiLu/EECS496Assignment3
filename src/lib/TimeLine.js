import * as d3 from "d3";
import { timeParse } from "d3-time-format";
import { legendColor } from 'd3-svg-legend';
import React, { Component } from "react";
import _ from "lodash";

const width = 700;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };


class TimelineChart extends Component {

state = {
      bars: []
    };
    xAxis = d3.axisBottom();
    yAxis = d3.axisLeft().ticks(5);
  

  static getDerivedStateFromProps(nextProps, prevState) {
    const { terrorist, range } = nextProps;
    const parseMonthDayYear = timeParse("%m/%d/%Y");
    const dataForTimeline = [],
      dateToTerroristCount = {},
      dateToCasualities = {},
      dateToConvertDate = {};
    terrorist.forEach(d => {
      const date = parseMonthDayYear(_.get(d, "Date"));
      if (!dateToTerroristCount[date]) {
        dateToTerroristCount[date] = 1;
        dateToCasualities[date] = _.get(d, "casualities");
        dateToConvertDate[date] = _.get(d, "Date");
      } else {
        dateToTerroristCount[date] += 1;
        dateToCasualities[date] += _.get(d, "casualities")
      }
    });

    Object.keys(dateToTerroristCount).forEach(time => {
      dataForTimeline.push({
        TIME: new Date(time),
        TOT: dateToTerroristCount[time],
        CAU: dateToCasualities[time],
        DAT: dateToConvertDate[time]
      });
    });
    dataForTimeline.sort((a, b) => {
      return a.TIME - b.TIME;
    });
   
    if (!terrorist) 
        return {};
    console.log(dataForTimeline)
    // 1. map date to x-position
    // get min and max of date
    const extent = d3.extent(dataForTimeline, d => d.TIME);
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([margin.left, width - margin.right]);

    // 2. map high temp to y-position
    // get min/max of high temp
    const [min, max] = d3.extent(dataForTimeline, d => d.TOT);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    // 3. map avg temp to color
    // get min/max of avg
    const colorExtent = d3.extent(dataForTimeline, d => d.CAU).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);
      const legendLinear = legendColor()
      .shapeWidth(50)
      .orient('horizontal')
      .scale(colorScale)
      d3.select('#colorLegend2').selectAll("svg").remove()
    d3.select('#colorLegend2').append("svg").attr("height",60).append("g").call(legendLinear)

    // array of objects: x, y, height
    const bars = dataForTimeline.map(d => {
      // slice should be colored if there's no time range
      // or if the slice is within the time range
      // slice should be colored if there's no time range
      // or if the slice is within the time range
      const isColored =
        !range.length || (range[0] <= d.TIME && d.TIME <= range[1]);
      return {
        x: xScale(d.TIME),
        y: yScale(d.TOT),
        height: height - margin.bottom - yScale(d.TOT),
        fill: isColored ? colorScale(d.CAU) : "#ccc"
      };
    });
    

    return { bars, xScale, yScale, dataForTimeline };
  }

  componentDidMount() {
    this.brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on("end", this.brushEnd);
    d3.select(this.refs.brush).call(this.brush);
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis)
    d3.select('#timeline-containter').append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", 55)
    .attr("x", -20)
    .text("# Terrorist Activities")
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  brushEnd = () => {
    if (!d3.event.selection) {
        this.props.updateRange([]);
        this.props.updateTerrorist(this.props.terrorist)
      return;
    }
    const [x1, x2] = d3.event.selection;
    const range = [this.state.xScale.invert(x1), this.state.xScale.invert(x2)];
    const filteredData = []
    this.props.updateRange(range);
    this.state.dataForTimeline.forEach(function(d) {
        if (d.TIME >= range[0] && d.TIME <= range[1]) {
            filteredData.push(d.DAT);
        }
    });

    const newData = this.props.terrorist.filter(d=>filteredData.includes(_.get(d,'Date')))
    this.props.updateTerrorist(newData)
  };



  render() {
    return (
      <svg id="timeline-containter" width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width="2"
            height={d.height}
            fill={d.fill}
          />
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
          <g ref="brush" />
        </g>
      </svg>
    );
  }
}

export default TimelineChart;
