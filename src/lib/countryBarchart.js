import React, { Component } from "react";
import * as d3 from "d3";
import { geoMercator, geoPath } from "d3-geo";
import _ from "lodash";
import { legendColor } from "d3-svg-legend";
import styled from "styled-components";

const world = require("./dataset/filtered_world.json");

const Tooltip = styled.div`
position: absolute;
  width: 120px;
  height: 60px;
  background-color: white;
  border: solid;
  border-width: 1px;
  border-radius: 5px;
  padding: 5px;
  padding-top: 10px;
  font-size: 8px;
  font-family: Arial;
  pointer-events: none;
  opacity:0;
`

// ***** Default svg data
const defaultSvgWidth = 700;
const defaultSvgHeight = 400;
const defaultSvgMargin = { top: 40, right: 5, bottom: 20, left: 35 };
const defaultSvgScrollHeight = 60;
const defaultPadding = 0.2;
const defaultSliceWidth = 10;

class CountryBarChart extends Component {
  constructor(props) {
    super(props);

    const svgWidth = props.width === undefined ? defaultSvgWidth : props.width;
    const svgHeight =
      props.height === undefined ? defaultSvgHeight : props.height;
    const svgMargin =
      props.margin === undefined ? defaultSvgMargin : props.margin;
    const svgScrollHeight =
      props.scrollHeight === undefined
        ? defaultSvgScrollHeight
        : props.scrollHeight;
    const svgScrollMargin = { ...svgMargin, bottom: 0 };
    const padding =
      props.padding === undefined ? defaultPadding : props.padding;
    const sliceWidth =
      props.bars === undefined ? defaultSliceWidth : props.bars;

    this.state = {
      svgWidth,
      svgHeight,
      svgMargin,
      svgScrollHeight,
      svgScrollMargin,
      padding,
      sliceStart: 0,
      sliceWidth,
      clickedCountry:'',

      xScale: d3
        .scaleBand()
        .range([svgMargin.left, svgWidth - svgMargin.right])
        .padding(padding),
      yScale: d3
        .scaleLinear()
        .range([
          svgHeight - 50 - svgMargin.bottom - svgScrollHeight,
          svgMargin.top
        ]),
      xAxisRef: null,
      yAxisRef: null,

      xScrollScale: d3
        .scaleBand()
        .range([svgScrollMargin.left, svgWidth - svgScrollMargin.right])
        .padding(padding),
      yScrollScale: d3
        .scaleLinear()
        .range([svgHeight, svgHeight - svgScrollHeight + svgScrollMargin.top]),
      scrollRef: null,

      scrollSelectorWidth: 0,
      scrollSelectorMinX: 0,
      scrollSelectorMaxX: 0,
      scrollBandWidth: 0,
      scrollSelectorX: svgScrollMargin.left,

      bars: [],
      scrollBars: [],
      terrorist: this.props.terrorist
    };

    this.xAxis = d3.axisBottom().scale(this.state.xScale);
    this.yAxis = d3
      .axisLeft()
      .scale(this.state.yScale)
      .ticks(5);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.terrorist !== nextProps.terrorist){
      this.setState({terrorist:nextProps.terrorist})
      const bars = this.calculateBars(nextProps.terrorist);
      const scrollBars = this.calculateScrollBars(nextProps.terrorist);
      const selector = this.calculateScrolSellector(scrollBars.length);
  
      const states = { ...selector, bars, scrollBars };
  
      this.setState(states);
    }
  }


  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { terrorist } = nextProps;
  //   return { terrorist };
  // }

  xAxisRef = element => {
    this.setState({ xAxisRef: element });
    d3.select(element).call(this.xAxis);
  };

  yAxisRef = element => {
    this.setState({ yAxisRef: element });
    d3.select(element).call(this.yAxis);
  };

  scrollRef = element => {
    this.setState({ scrollRef: element });
    d3.select(element).call(d3.drag().on("drag", this.scrollDrag));
  };

  scrollDrag = () => {
    let newX = this.state.scrollSelectorX + d3.event.dx;
    let newSlice = 0;
    const oldSlice = this.state.sliceStart;

    if (newX > this.state.scrollSelectorMaxX) {
      newX = this.state.scrollSelectorMaxX;
    } else if (newX < this.state.scrollSelectorMinX) {
      newX = this.state.scrollSelectorMinX;
    }

    newSlice = newX - this.state.scrollSelectorMinX;
    newSlice = Math.round(newSlice / this.state.scrollBandWidth);

    if (newSlice !== oldSlice) {
      const bars = this.calculateBars(this.state.terrorist, newSlice);
      this.setState({ scrollSelectorX: newX, sliceStart: newSlice, bars });
    } else {
      this.setState({ scrollSelectorX: newX });
    }
  };

  calculateBars = (terrorist, newSliceStart) => {
   
    let {
      xScale,
      yScale,
      sliceStart,
      sliceWidth,
      svgHeight,
      svgMargin,
      svgScrollHeight
    } = this.state;

    if (newSliceStart !== undefined) {
      sliceStart = newSliceStart;
    }

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

    const activityDomain = dataForBarchart
      .slice(sliceStart, sliceStart + sliceWidth)
      .map(d => d.COUNTRY);
    const valueMax = d3.max(dataForBarchart, d => d.TOT);

    xScale.domain(activityDomain);
    yScale.domain([0, valueMax]);

    const colorExtent = d3.extent(dataForBarchart, d => d.CAU).reverse();
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolate("purple", "orange"));
    const legendLinear = legendColor()
      .shapeWidth(50)
      .orient("horizontal")
      .scale(colorScale);
    d3.select("#colorLegend2")
      .selectAll("svg")
      .remove();
    d3.select("#colorLegend2")
      .append("svg")
      .attr("height", 60)
      .append("g")
      .call(legendLinear)
      .selectAll("text")
      .attr("font-size", "10");

    const bars = dataForBarchart
      .slice(sliceStart, sliceStart + sliceWidth)
      .map((d, index) => {
        const x = xScale(d.COUNTRY);
        const y = yScale(d.TOT);
        const width = xScale.bandwidth();
        const height = svgHeight - 50 - svgMargin.bottom - svgScrollHeight - y;
        const fill = colorScale(d.CAU);
        const country = d.COUNTRY;
        const tot = d.TOT;
        const cau = d.CAU;

        return {
          index,
          x,
          y,
          height,
          width,
          fill,
          country,
          tot,
          cau
        };
      });

    return bars;
  };

  calculateScrollBars = terrorist => {
    const { xScrollScale, yScrollScale, svgHeight } = this.state;

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

    const scrollActivityDomain = dataForBarchart.map(d => d.COUNTRY);
    const valueMax = d3.max(dataForBarchart, d => d.TOT);

    xScrollScale.domain(scrollActivityDomain);
    yScrollScale.domain([0, valueMax]);

    const scrollBars = dataForBarchart.map((d, index) => {
      const scrollX = xScrollScale(d.COUNTRY);
      const scrollY = yScrollScale(d.TOT);
      const scrollWidth = xScrollScale.bandwidth();
      const scrollHeight = svgHeight - scrollY;
      const scrollFill = "#cccccc";

      return {
        index,
        scrollX,
        scrollY,
        scrollWidth,
        scrollHeight,
        scrollFill
      };
    });

    return scrollBars;
  };

  calculateScrolSellector = scrollBarsLength => {
    const { sliceWidth, svgWidth, svgScrollMargin } = this.state;

    const scaleWidth = svgWidth - svgScrollMargin.right - svgScrollMargin.left;
    const scrollSelectorWidth = Math.round(
      (sliceWidth / scrollBarsLength) * scaleWidth
    );
    const scrollSelectorMinX = svgScrollMargin.left;
    const scrollSelectorMaxX =
      svgWidth - svgScrollMargin.right - scrollSelectorWidth;
    const scrollBandWidth = Math.round(scaleWidth / scrollBarsLength);

    return {
      scrollSelectorWidth,
      scrollSelectorMinX,
      scrollSelectorMaxX,
      scrollBandWidth
    };
  };

  calculateChart = () => {
    if (this.state.terrorist === undefined) {
      return;
    }

    const bars = this.calculateBars(this.state.terrorist);
    const scrollBars = this.calculateScrollBars(this.state.terrorist);
    const selector = this.calculateScrolSellector(scrollBars.length);

    const states = { ...selector, bars, scrollBars };

    this.setState(states);
  };

  componentDidMount = () => {
    this.calculateChart();
  };

  componentDidUpdate() {
    d3.select(this.state.xAxisRef)
      .call(this.xAxis)
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 10);
    d3.select(this.state.yAxisRef).call(this.yAxis);
    d3.select("#countrybarchart-container")
      .append("text")
      .attr("text-anchor", "end")
      .attr("y", 25)
      .attr("x", 160)
      .text("# Terrorist Activities");
    
  }

  render() {
    const mercator = geoMercator();
    const project = geoPath().projection(mercator);
    const height = 469;
    const width = 560;
    return (
      <>
        <svg
          id="countrybarchart-container"
          style={{ marginLeft: "15px" }}
          width={this.state.svgWidth}
          height={this.state.svgHeight}
        >
          {this.state.bars.map((d, i) => (
            <rect
              key={i}
              id={`barchart_${i}`}
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              fill={d.fill}
              onMouseOver={(e) => {
                d3.select("#barchart-tooptip")
                  .transition()
                  .duration(200)
                  .style("opacity", 1);
                d3.select("#barchart-tooptip")
                  .html(
                    "Country: " +
                      d.country +
                      "<br/>" +
                      "# Terrorist Activities: " +
                      d.tot +
                      "<br/>" +
                      "# Casualities: " +
                      d.cau
                  )
                  .style("left", e.screenX +  10 + "px")
                  .style("top", e.screenY + window.pageYOffset - 85 + "px");
                  d3.select(`#barchart_${i}`).attr("cursor", "pointer");
              }}
              onMouseOut = {()=>{
                  d3.select("#barchart-tooptip").transition().duration(500).style("opacity", 0);
                  d3.select(`#barchart_${i}`).attr("cursor", "default");
              }}
              onClick = {()=>{
                const centroid = project.centroid(_.get(world,d.country));
                d3.select("#WorldMapG")
                        .transition()
                        .duration(750)
                        .attr(
                          "transform",
                          "translate(" +
                            width / 2 +
                            "," +
                            height / 2 +
                            ")scale(" +
                            4 +
                            ")translate(" +
                            -centroid[0] +
                            "," +
                            -centroid[1] +
                            ")"
                        )
                        .style("stroke-width", 1.5 / 2.5 + "px")
                        .style("font-size", function() {
                          return 12 / 2.5 + "px";
                        });
                        if(this.state.clickedCountry!==null){
                          d3.select(`#country_${Object.keys(world).indexOf(this.state.clickedCountry)}`).classed("clicked", false)
                        .attr("fill", "white");
                        d3.select(`#countryLabel_${Object.keys(world).indexOf(d.country)}`).classed("clicked", false)
                        .style("visibility", "hidden");
                        }
                        d3.select(`#country_${Object.keys(world).indexOf(d.country)}`).classed("clicked", true)
                        .attr("fill", "#FFD700");
                        d3.select(`#countryLabel_${Object.keys(world).indexOf(d.country)}`).classed("clicked", true)
                        .style("visibility", "visible");
                        this.setState({clickedCountry: d.country})
              }}
              
            />
          ))}

          {this.state.scrollBars.map((d, i) => (
            <rect
              key={i}
              x={d.scrollX}
              y={d.scrollY}
              width={d.scrollWidth}
              height={d.scrollHeight}
              fill={d.scrollFill}
            />
          ))}

          <rect
            ref={this.scrollRef}
            className="scroll-selector"
            x={this.state.scrollSelectorX}
            y={this.state.svgHeight - this.state.svgScrollHeight}
            width={this.state.scrollSelectorWidth}
            height={this.state.svgScrollHeight}
            style={{ fill: "lightblue", opacity: 0.5, cursor: "ew-resize" }}
          />

          <g>
            <g
              ref={this.xAxisRef}
              transform={`translate(0, ${this.state.svgHeight -
                50 -
                this.state.svgMargin.bottom -
                this.state.svgScrollHeight})`}
            />
            <g
              ref={this.yAxisRef}
              transform={`translate(${this.state.svgMargin.left}, 0)`}
            />
          </g>
        </svg>
        <Tooltip id="barchart-tooptip" />
      </>
    );
  }
}

export default CountryBarChart;
