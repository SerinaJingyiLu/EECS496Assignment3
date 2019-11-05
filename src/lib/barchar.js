import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import React, { Component } from "react";
import _ from "lodash";

const width = 700;
const height = 400;
const chartheight = 320;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class CountryBarChart extends Component {
  state = {
    bars: []
  };
  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft().ticks(5);

  static getDerivedStateFromProps(nextProps, prevState) {
    const { terrorist } = nextProps;
    const countryToTerroristCount = {},
      dataForBarchart = [],
      dateToCasualities = {};
    terrorist.forEach(d => {
      const country = _.get(d, "Country");
      if (!countryToTerroristCount[country]) {
        countryToTerroristCount[country] = 1;
        dateToCasualities[country] = _.get(d, "casualities");
      } else {
        countryToTerroristCount[country] += 1;
        dateToCasualities[country] += _.get(d, "casualities");
      }
    });

    Object.keys(countryToTerroristCount).forEach(country => {
      dataForBarchart.push({
        COUNTRY: country,
        TOT: countryToTerroristCount[country],
        CAU: dateToCasualities[country]
      });
    });
    dataForBarchart.sort((a, b) => {
      return b.TOT - a.TOT;
    });
    const sortedCountry = []
    dataForBarchart.forEach(d=>{
        sortedCountry.push(d.COUNTRY)
    })

    if (!terrorist) return {};
    // 1. map date to x-position
    // get min and max of date

    const xScale = d3
      .scaleBand()
      .domain(sortedCountry)
      .range([margin.left, width - margin.right]);

    // 2. map high temp to y-position
    // get min/max of high temp
    const [min, max] = d3.extent(dataForBarchart, d => d.TOT);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([chartheight - margin.bottom, margin.top]);

    const colorExtent = d3.extent(dataForBarchart, d => d.CAU).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolate("purple", "orange"));

    const bars = dataForBarchart.map(d => {
      return {
        x: xScale(d.COUNTRY),
        y: yScale(d.TOT),
        height: chartheight - margin.bottom - yScale(d.TOT),
        fill: colorScale(d.CAU)
      };
    });

    return { bars, xScale, yScale, dataForBarchart };
  }

  componentDidMount() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis).selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 8);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
    d3.select("#timeline-containter")
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", 55)
      .attr("x", -20)
      .text("# Terrorist Activities");
  }

  componentDidUpdate() {
    this.xAxis.scale(this.state.xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis.scale(this.state.yScale);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    return (
      <svg id="countryBarchart-containter" width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width="5"
            height={d.height}
            fill={d.fill}
          />
        ))}
        <g>
          <g
            ref="xAxis"
            transform={`translate(0, ${chartheight - margin.bottom})`}
          />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default CountryBarChart;
