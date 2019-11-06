import { geoMercator, geoPath } from "d3-geo";
import * as d3 from "d3";
import { scaleOrdinal, scaleLinear } from "d3-scale";
import { legendColor } from "d3-svg-legend";
import React, { Component } from "react";
import _ from "lodash";
import styled from "styled-components";
import { ZoomContainer } from "./ZoomContainer";
import { Stage } from "./Stage";

const CircleTooptip = styled.div`
  visibility: hidden;
  background-color: white;
  border: solid;
  border-width: 1px;
  border-radius: 5px;
  padding: 5px;
  padding-top: 10px;
  position: absolute;
  font-size: 8px;
  pointer-events: none;
  font-family: Arial;
`;

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordinalcolorScale: scaleOrdinal(d3.schemePaired),

      linearcolorScale: scaleLinear()
        .domain([
          _.get(this.props.extractData[0], "casualities")[0],
          _.get(this.props.extractData[0], "casualities")[
            _.get(this.props.extractData[0], "casualities").length - 1
          ]
        ])
        .range(["orange", "purple"])
    };
  }

  componentDidMount() {
    const legendLinear = legendColor()
      .shapeWidth(30)
      .orient("horizontal")
      .scale(this.state.linearcolorScale);
    const legendOrdinal = legendColor()
      .shapePadding(10)
      .scale(this.state.ordinalcolorScale);
    if (this.props.displayValue === "AttackType") {
      d3.select("#colorLegend")
        .append("svg")
        .attr("height", 250)
        .append("g")
        .call(legendOrdinal);
    } else {
      d3.select("#colorLegend")
        .append("svg")
        .attr("height", 100)
        .append("g")
        .call(legendLinear);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const legendLinear = legendColor()
      .shapeWidth(50)
      .orient("horizontal")
      .scale(this.state.linearcolorScale);
    const legendOrdinal = legendColor()
      .shapePadding(10)
      .scale(this.state.ordinalcolorScale);
    if (nextProps.displayValue === "AttackType") {
      d3.select("#colorLegend")
        .selectAll("svg")
        .remove();
      d3.select("#colorLegend")
        .append("svg")
        .attr("height", 250)
        .append("g")
        .call(legendOrdinal);
    } else {
      d3.select("#colorLegend")
        .selectAll("svg")
        .remove();
      d3.select("#colorLegend")
        .append("svg")
        .attr("height", 60)
        .append("g")
        .call(legendLinear);
    }
  }


  tooltipInnerHTML = ter => {
    return `
      <p>Year: ${_.get(ter, "Year", "Unknown")}</p>
      <p>Month: ${_.get(ter, "Month", "Unknown")}</p>
      <p>Day: ${_.get(ter, "Day", "Unknown")}</p>
      <p>City: ${_.get(ter, "city", "Unknown")}</p>
      <p>Country: ${_.get(ter, "Country", "Unknown")}</p>
      <p>Attack Type: ${_.get(ter, "AttackType", "Unknown")}</p>
      <p>Casualities: ${_.get(ter, "casualities", "Unknown")}</p>
      `;
  };

  render() {
    const { terrorist, displayValue } = this.props;
    const { ordinalcolorScale, linearcolorScale } = this.state;
    console.log(displayValue);
    console.log(terrorist.length);
    const mercator = geoMercator();
    const project = geoPath().projection(mercator);
    let SelectedCountries = [];
    const height = 469;
    const width = 560;
    return (
      <>
        <Stage width="100%" height="100%">
          <ZoomContainer>
            {this.props.world.features.map((feature, index) => {
              const d = project(feature);
              return (
                <>
                  <path
                    key={index}
                    id={`country_${index}`}
                    d={d}
                    fill="#fff"
                    stroke="#666666"
                    strokeWidth={0.15}
                    onMouseOver={() => {
                      if (
                        document
                          .querySelector(`#country_${index}`)
                          .getAttribute("class") !== "clicked"
                      ) {
                        d3.select(`#country_${index}`).attr("fill", "#FFFF99");
                      }
                      d3.select(`#country_${index}`).attr("cursor", "pointer");
                    }}
                    onMouseLeave={() => {
                      if (
                        document
                          .querySelector(`#country_${index}`)
                          .getAttribute("class") !== "clicked"
                      ) {
                        d3.select(`#country_${index}`).attr("fill", "white");
                      }
                      d3.select(`#country_${index}`).attr("cursor", "default");
                    }}
                    onClick={() => {
                      let x, y, k;
                      if (
                        document
                          .querySelector(`#country_${index}`)
                          .getAttribute("class") !== "clicked"
                      ) {
                        d3.select(`#country_${index}`)
                          .classed("clicked", true)
                          .attr("fill", "#FFD700");
                        d3.select(`#countryLabel_${index}`)
                          .classed("clicked", true)
                          .style("visibility", "visible");
                        const centroid = project.centroid(feature);
                        SelectedCountries.push(centroid);
                      } else {
                        d3.select(`#country_${index}`)
                          .classed("clicked", false)
                          .attr("fill", "white");
                        d3.select(`#countryLabel_${index}`)
                          .classed("clicked", true)
                          .style("visibility", "hidden");
                        const centroid = project.centroid(feature);
                        SelectedCountries = SelectedCountries.filter(
                          item =>
                            item[0] !== centroid[0] && item[1] !== centroid[1]
                        );
                      }

                      if (SelectedCountries.length !== 0) {
                        x = 0;
                        y = 0;
                        SelectedCountries.forEach(item => {
                          x += item[0];
                          y += item[1];
                        });
                        x = x / SelectedCountries.length;
                        y = y / SelectedCountries.length;
                        k = 4;
                      } else {
                        x = width / 2;
                        y = height / 2;
                        k = 1;
                      }

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
                            k +
                            ")translate(" +
                            -x +
                            "," +
                            -y +
                            ")"
                        )
                        .style("stroke-width", 1.5 / 2.5 + "px")
                        .style("font-size", function() {
                          return 12 / 2.5 + "px";
                        });
                    }}
                  />
                  <text
                    style={{
                      fontWeight: "bold",
                      textAnchor: "middle",
                      cursor: "default",
                      visibility: "hidden"
                    }}
                    id={`countryLabel_${index}`}
                    transform={"translate(" + project.centroid(feature) + ")"}
                  >
                    {_.get(feature, "properties.name_long")}
                  </text>
                </>
              );
            })}
            {terrorist.map((ter, index) => {
              // convert the lat,lng to an x,y
              // using the mercator projection

              const [x, y] = mercator([ter.longitude, ter.latitude]);
              const tooltipInnerHTML =
                "<div><p>Year: " +
                _.get(ter, "Year", "Unknown") +
                "</p><p>Month: " +
                _.get(ter, "Month", "Unknown") +
                "</p><p>Day: " +
                _.get(ter, "Day", "Unknown") +
                "</p><p>City: " +
                _.get(ter, "city", "Unknown") +
                "</p><p>Country: " +
                _.get(ter, "Country", "Unknown") +
                "</p><p>Attack Type: " +
                _.get(ter, "AttackType", "Unknown") +
                "</p><p>Casualities: " +
                _.get(ter, "casualities", "Unknown") +
                "</p></div>";

              return (
                <circle
                  key={index}
                  id={`WorldMap_Circle_${index}`}
                  cx={x}
                  cy={y}
                  r={terrorist.length > 30 ? 0.5 : 3}
                  fill={
                    displayValue === "AttackType"
                      ? ordinalcolorScale(_.get(ter, "AttackType"))
                      : linearcolorScale(_.get(ter, "casualities"))
                  }
                  stroke="#000"
                  strokeWidth={0.1}
                  onMouseOver={() => {
                    document.querySelector("#circletooltip").style.visibility =
                      "visible";
                    d3.select(`#WorldMap_Circle_${index}`).style(
                      "r",
                      terrorist.length > 30 ? 1.5 : 4
                    );
                  }}
                  onMouseMove={e => {
                    document.querySelector(
                      "#circletooltip"
                    ).style.left = `${e.screenX + 10}px`;
                    document.querySelector(
                      "#circletooltip"
                    ).style.top = `${e.screenY + window.pageYOffset - 85}px`;
                    document.querySelector(
                      "#circletooltip"
                    ).innerHTML = tooltipInnerHTML;
                  }}
                  onMouseLeave={() => {
                    d3.select(`#WorldMap_Circle_${index}`).style(
                      "r",
                      terrorist.length > 30 ? 0.5 : 3
                    );
                    document.querySelector("#circletooltip").style.visibility =
                      "hidden";
                  }}
                />
                
              );
            })}
          </ZoomContainer>
        </Stage>
        <CircleTooptip id="circletooltip" />
      </>
    );
  }
}

export default WorldMap;
