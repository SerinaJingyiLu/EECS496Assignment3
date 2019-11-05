import React, { Component } from "react";
import {
  Select,
  Spin,
  Form,
  Slider,
  InputNumber,
  Row,
  Col,
  Radio,
  Modal,
  Button
} from "antd";
import "antd/dist/antd.css";
import _ from "lodash";
import styled from "styled-components";
import WorldMap from "./lib/WorldMap";
import TimelineChart from "./lib/TimeLine";
import CountryBarChart from "./lib/countryBarchart";
import { Updatedata } from "./lib/util";

// import WorldMap from './lib/index'

const { Option } = Select;
const extractData = require("./lib/dataset/extract_dataset_small.json");
const world = require("./lib/dataset/world.json");

const Title = styled.div`
  height: 200px;
  background-image: url("https://storage.googleapis.com/kaggle-datasets-images/504/1012/b4f1185ba3ab02238e27a7e943fc8437/dataset-cover.png");
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
`;

const TitleHeader = styled.div`
  font-size: 25px;
  font-weight: 500;
  line-height: 1.25;
  margin-left: 40px;
  font-family: Arial;
`;

const Container = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: column;
`;

const WorldMapContainer = styled.div`
  height: 469px;
  width: 60%;
  background: #fbfbfb;
  margin-bottom: 20px;
  border: 1px solid #dedfe0;
  display: flex;
  flex-direction: column;
  margin-left: 2%;
`;

const WorldMapTitle = styled.div`
  background: #f8f8f8;
  height: 48px;
  width: auto;
  border-bottom: 1px solid #dedfe0;
  border-radius: 4px 4px 0 0;
  padding: 8px 24px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const SelectionContainer = styled.div`
  background: #fbfbfb;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #dedfe0;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
`;

const SelectionHeaderContainer = styled.div`
  background: #f8f8f8;
  height: 48px;
  width: auto;
  border-bottom: 1px solid #dedfe0;
  border-radius: 4px 4px 0 0;
  padding: 8px 24px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const SelectionHeader = styled.div`
  align-self: center;
  text-align: left;
  padding-left: 12px;
  max-width: 100%;
  font-family: Arial;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 600;
  font-size: 16px;
  flex: 1 1 auto;
  overflow: hidden;
`;

const SelectionItem = styled(Form.Item)`
  label {
    color: rgba(0, 0, 0, 0.7);
    font-family: Arial;
    font-weight: 600;
    padding-top: 8px;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CasualitiesValue: [
        _.get(extractData[0], "casualities")[0],
        _.get(extractData[0], "casualities")[
          _.get(extractData[0], "casualities").length - 1
        ]
      ],
      CountryFilter: _.get(extractData[0], "Country"),
      YearFilter: _.get(extractData[0], "Year"),
      MonthFilter: _.get(extractData[0], "Month"),
      DayFilter: _.get(extractData[0], "Day"),
      AttackTypeFilter: _.get(extractData[0], "AttackType"),
      CasualitiesFilter: _.get(extractData[0], "casualities"),
      displayValue: "AttackType",
      displayValue2: "DateType",
      ModalVisible: false,
      range: []
    };
  }

  async componentDidMount() {
    const terrorist = await require("./lib/dataset/filtered_dataset_small.json");

    this.setState({
      terrorist,
      filteredData: terrorist,
      filteredData2: terrorist
    });
  }

  handleCountrySelectAll = value => {
    if (value && value.length && value.includes("all")) {
      if (value.length === _.get(extractData[0], "Country").length + 1) {
        this.setState({
          filteredData: [],
          CountryFilter: [],
          filteredData2: []
        });
        return [];
      }
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            _.get(extractData[0], "Country"),
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            _.get(extractData[0], "Country"),
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          CountryFilter: _.get(extractData[0], "Country")
        };
      });
      return _.get(extractData[0], "Country");
    } else {
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            value,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            value,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          CountryFilter: value
        };
      });
      return value;
    }
  };

  handleYearSelectAll = value => {
    if (value && value.length && value.includes("all")) {
      if (value.length === _.get(extractData[0], "Year").length + 1) {
        this.setState({
          filteredData: [],
          YearFilter: [],
          filteredData2: []
        });
        return [];
      }
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            _.get(extractData[0], "Year"),
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            _.get(extractData[0], "Year"),
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          YearFilter: _.get(extractData[0], "Year")
        };
      });
      return _.get(extractData[0], "Year");
    } else {
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            value,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            value,
            state.MonthFilter,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          YearFilter: value
        };
      });
      return value;
    }
  };

  handleMonthSelectAll = value => {
    if (value && value.length && value.includes("all")) {
      if (value.length === _.get(extractData[0], "Month").length + 1) {
        this.setState({ filteredData: [], MonthFilter: [], filteredData2: [] });
        return [];
      }
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            _.get(extractData[0], "Month"),
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            _.get(extractData[0], "Month"),
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          MonthFilter: _.get(extractData[0], "Month")
        };
      });
      return _.get(extractData[0], "Month");
    } else {
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            value,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            value,
            state.DayFilter,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          MonthFilter: value
        };
      });
      return value;
    }
  };

  handleDaySelectAll = value => {
    if (value && value.length && value.includes("all")) {
      if (value.length === _.get(extractData[0], "Day").length + 1) {
        this.setState({ filteredData: [], DayFilter: [], filteredData2: [] });
        return [];
      }
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            _.get(extractData[0], "Day"),
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            _.get(extractData[0], "Day"),
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          DayFilter: _.get(extractData[0], "Day")
        };
      });
      return _.get(extractData[0], "Day");
    } else {
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            value,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            value,
            state.AttackTypeFilter,
            state.CasualitiesFilter
          ),
          DayFilter: value
        };
      });
      return value;
    }
  };

  handleAttackTypeSelectAll = value => {
    if (value && value.length && value.includes("all")) {
      if (value.length === _.get(extractData[0], "AttackType").length + 1) {
        this.setState({
          filteredData: [],
          AttackTypeFilter: [],
          filteredData2: []
        });
        return [];
      }
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            _.get(extractData[0], "AttackType"),
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            _.get(extractData[0], "AttackType"),
            state.CasualitiesFilter
          ),
          AttackTypeFilter: _.get(extractData[0], "AttackType")
        };
      });
      return _.get(extractData[0], "AttackType");
    } else {
      this.setState(state => {
        return {
          filteredData: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            value,
            state.CasualitiesFilter
          ),
          filteredData2: Updatedata(
            state.terrorist,
            state.CountryFilter,
            state.YearFilter,
            state.MonthFilter,
            state.DayFilter,
            value,
            state.CasualitiesFilter
          ),
          AttackTypeFilter: value
        };
      });
      return value;
    }
  };

  onCasualitiesChange = value => {
    const filter = _.get(extractData[0], "casualities").filter(
      d => d >= value[0] && d <= value[1]
    );
    this.setState({ CasualitiesValue: value });
    this.setState(state => {
      return {
        filteredData: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        filteredData2: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        CasualitiesFilter: filter
      };
    });
  };

  onCasualitiesChangeMin = value => {
    const { CasualitiesValue } = this.state;
    const filter = _.get(extractData[0], "casualities").filter(
      d => d >= value && d <= CasualitiesValue[1]
    );
    this.setState(state => {
      return { CasualitiesValue: [value, state.CasualitiesValue[1]] };
    });
    this.setState(state => {
      return {
        filteredData: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        filteredData2: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        CasualitiesFilter: filter
      };
    });
  };

  onCasualitiesChangeMax = value => {
    const { CasualitiesValue } = this.state;
    const filter = _.get(extractData[0], "casualities").filter(
      d => d >= CasualitiesValue[0] && d <= value
    );
    this.setState(state => {
      return { CasualitiesValue: [state.CasualitiesValue[0], value] };
    });
    this.setState(state => {
      return {
        filteredData: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        filteredData2: Updatedata(
          state.terrorist,
          state.CountryFilter,
          state.YearFilter,
          state.MonthFilter,
          state.DayFilter,
          state.AttackTypeFilter,
          filter
        ),
        CasualitiesFilter: filter
      };
    });
  };

  onDisplayChange = e => {
    this.setState({ displayValue: e.target.value });
  };

  onDisplayChange2 = e => {
    this.setState({ displayValue2: e.target.value });
  };

  showModal = () => {
    this.setState({ ModalVisible: true });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      CasualitiesValue,
      filteredData,
      filteredData2,
      displayValue,
      displayValue2,
      ModalVisible,
      range
    } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          id="MainContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "85%"
          }}
          className="App"
        >
          <Title>
            <TitleHeader>Global Terrorism Activities</TitleHeader>
          </Title>
          <Container>
            <div style={{ display: "flex" }}>
              <SelectionContainer
                id="selectionContainer"
                style={{ width: "38%" }}
              >
                <SelectionHeaderContainer>
                  {" "}
                  <SelectionHeader>Selection</SelectionHeader>{" "}
                </SelectionHeaderContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginLeft: "36px",
                    marginTop: "10px"
                  }}
                >
                  <div>
                    <Radio.Group
                      onChange={this.onDisplayChange}
                      value={displayValue}
                      style={{
                        color: "rgba(0, 0, 0, 0.7)",
                        fontFamily: "Arial",
                        fontWeight: 600,
                        marginTop: "10px"
                      }}
                    >
                      <Radio style={radioStyle} value={"AttackType"}>
                        By Attack Types
                      </Radio>
                      <Radio style={radioStyle} value={"Casualities"}>
                        By Casualities
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div id="colorLegend" style={{ marginTop: "20px" }} />
                </div>
                <div style={{ marginLeft: "36px" }}>
                  <Button
                    onClick={this.showModal}
                    style={{
                      backgroundColor: "rgb(31, 120, 180)",
                      borderColor: "rgb(31, 120, 180)"
                    }}
                    type="primary"
                  >
                    Open Filter
                  </Button>
                </div>

                <Modal
                  title="Filter"
                  visible={ModalVisible}
                  footer={null}
                  centered={true}
                  width="70%"
                  onCancel={() => {
                    this.setState({ ModalVisible: false });
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center"
                      }}
                    >
                      <SelectionItem
                        label="Country"
                        style={{ width: "80%", paddingLeft: "5px" }}
                      >
                        {getFieldDecorator(`Country_Selection`, {
                          initialValue: _.get(extractData[0], "Country"),
                          getValueFromEvent: this.handleCountrySelectAll
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Select Countries"
                            style={{ width: "100%" }}
                            maxTagCount={20}
                            onChange={this.handleCountrySelectAll}
                            optionLabelProp="label"
                          >
                            <Option key="all" value="all">
                              ---SELECT ALL---
                            </Option>
                            {_.get(extractData[0], "Country").map(
                              (ter, index) => {
                                return (
                                  <Option id={ter} value={ter} label={ter}>
                                    {ter}
                                  </Option>
                                );
                              }
                            )}
                          </Select>
                        )}
                      </SelectionItem>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        marginTop: "-10px"
                      }}
                    >
                      <SelectionItem
                        label="Year"
                        style={{
                          display: "inline-block",
                          width: "25%",
                          paddingLeft: "5px"
                        }}
                      >
                        {getFieldDecorator(`Year_Selection`, {
                          initialValue: _.get(extractData[0], "Year"),
                          getValueFromEvent: this.handleYearSelectAll
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Select Year(s)"
                            style={{ width: "100%" }}
                            maxTagCount={5}
                            onChange={this.handleYearSelectAll}
                            optionLabelProp="label"
                          >
                            <Option key="all" value="all">
                              ---SELECT ALL---
                            </Option>
                            {_.get(extractData[0], "Year").map((ter, index) => {
                              return (
                                <Option id={ter} value={ter} label={ter}>
                                  {ter}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </SelectionItem>

                      <SelectionItem
                        label="Month"
                        style={{
                          display: "inline-block",
                          width: "25%",
                          marginLeft: "2.5%"
                        }}
                      >
                        {getFieldDecorator(`Month_Selection`, {
                          initialValue: _.get(extractData[0], "Month"),
                          getValueFromEvent: this.handleMonthSelectAll
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Select Month(s)"
                            style={{ width: "100%" }}
                            maxTagCount={5}
                            onChange={this.handleMonthSelectAll}
                            optionLabelProp="label"
                          >
                            <Option key="all" value="all">
                              ---SELECT ALL---
                            </Option>
                            {_.get(extractData[0], "Month").map(
                              (ter, index) => {
                                return (
                                  <Option id={ter} value={ter} label={ter}>
                                    {ter}
                                  </Option>
                                );
                              }
                            )}
                          </Select>
                        )}
                      </SelectionItem>

                      <SelectionItem
                        label="Day"
                        style={{
                          display: "inline-block",
                          width: "25%",
                          marginLeft: "2.5%"
                        }}
                      >
                        {getFieldDecorator(`Day_Selection`, {
                          initialValue: _.get(extractData[0], "Day"),
                          getValueFromEvent: this.handleDaySelectAll
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Select Day(s)"
                            style={{ width: "100%" }}
                            maxTagCount={5}
                            onChange={this.handleDaySelectAll}
                            optionLabelProp="label"
                          >
                            <Option key="all" value="all">
                              ---SELECT ALL---
                            </Option>
                            {_.get(extractData[0], "Day").map((ter, index) => {
                              return (
                                <Option id={ter} value={ter} label={ter}>
                                  {ter}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      </SelectionItem>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        marginTop: "-10px"
                      }}
                    >
                      <SelectionItem
                        label="Attack Type"
                        style={{ width: "80%", paddingLeft: "5px" }}
                      >
                        {getFieldDecorator(`AttackType_Selection`, {
                          initialValue: _.get(extractData[0], "AttackType"),
                          getValueFromEvent: this.handleAttackTypeSelectAll
                        })(
                          <Select
                            mode="multiple"
                            placeholder="Select Attack Type(s)"
                            style={{ width: "100%" }}
                            onChange={this.handleAttackTypeSelectAll}
                            optionLabelProp="label"
                          >
                            <Option key="all" value="all">
                              ---SELECT ALL---
                            </Option>
                            {_.get(extractData[0], "AttackType").map(
                              (ter, index) => {
                                return (
                                  <Option id={ter} value={ter} label={ter}>
                                    {ter}
                                  </Option>
                                );
                              }
                            )}
                          </Select>
                        )}
                      </SelectionItem>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        marginTop: "-10px"
                      }}
                    >
                      <SelectionItem
                        label="Casualities"
                        style={{ width: "80%", paddingLeft: "5px" }}
                      >
                        {getFieldDecorator(`Casualities_Selection`, {
                          // getValueFromEvent: this.handleAttackTypeSelectAll
                        })(
                          <Row>
                            <Col span={3}>
                              <InputNumber
                                min={_.get(extractData[0], "casualities")[0]}
                                max={
                                  _.get(extractData[0], "casualities")[
                                    _.get(extractData[0], "casualities")
                                      .length - 1
                                  ]
                                }
                                style={{ width: "100%" }}
                                step={1}
                                value={CasualitiesValue[0]}
                                onChange={this.onCasualitiesChangeMin}
                              />
                            </Col>
                            <Col style={{ marginLeft: "16px" }} span={16}>
                              <Slider
                                range
                                defaultValue={CasualitiesValue}
                                onChange={this.onCasualitiesChange}
                                min={_.get(extractData[0], "casualities")[0]}
                                max={
                                  _.get(extractData[0], "casualities")[
                                    _.get(extractData[0], "casualities")
                                      .length - 1
                                  ]
                                }
                                value={CasualitiesValue}
                                step={1}
                              />
                            </Col>
                            <Col span={4}>
                              <InputNumber
                                min={_.get(extractData[0], "casualities")[0]}
                                max={
                                  _.get(extractData[0], "casualities")[
                                    _.get(extractData[0], "casualities")
                                      .length - 1
                                  ]
                                }
                                style={{ width: "100%", marginLeft: "16px" }}
                                step={1}
                                value={CasualitiesValue[1]}
                                onChange={this.onCasualitiesChangeMax}
                              />
                            </Col>
                          </Row>
                        )}
                      </SelectionItem>
                    </div>
                  </div>
                </Modal>
              </SelectionContainer>

              {filteredData2 ? (
                <WorldMapContainer id="WorldMapContainer">
                  <WorldMapTitle>
                    <SelectionHeader>
                      Terrorist Activity Spots ({filteredData2.length} Attacks)
                    </SelectionHeader>
                  </WorldMapTitle>
                  <div
                    id="div_template"
                    style={{ background: "#89cff0", height: "100%" }}
                  >
                    <WorldMap
                      terrorist={filteredData2}
                      extractData={extractData}
                      displayValue={displayValue}
                      world={world}
                    />
                  </div>
                </WorldMapContainer>
              ) : (
                <div
                  style={{
                    width: "auto",
                    height: "100px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Spin tip="Loading..." />
                </div>
              )}
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <SelectionContainer
                id="selectionContainer"
                style={{ width: "38%" }}
              >
                <SelectionHeaderContainer>
                  {" "}
                  <SelectionHeader>Selection 2</SelectionHeader>{" "}
                </SelectionHeaderContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    marginLeft: "36px",
                    marginTop: "10px"
                  }}
                >
                  <div>
                    <Radio.Group
                      onChange={this.onDisplayChange2}
                      value={displayValue2}
                      style={{
                        color: "rgba(0, 0, 0, 0.7)",
                        fontFamily: "Arial",
                        fontWeight: 600,
                        marginTop: "10px"
                      }}
                    >
                      <Radio style={radioStyle} value={"DateType"}>
                        By Date
                      </Radio>
                      <Radio style={radioStyle} value={"CountryType"}>
                        By Country
                      </Radio>
                    </Radio.Group>
                  </div>
                  <div
                    style={{
                      color: "rgba(0, 0, 0, 0.7)",
                      fontFamily: "Arial",
                      fontWeight: 600,
                      marginTop: "30px"
                    }}
                  >
                    Casualities:
                  </div>
                  <div id="colorLegend2" style={{ marginTop: "20px" }} />
                </div>
              </SelectionContainer>

              {filteredData ? (
                <WorldMapContainer id="TimelineContainer">
                  {displayValue2 === "DateType" ? (
                    <>
                      <WorldMapTitle>
                        <SelectionHeader>
                          Number of Terrorist Activities by Date
                        </SelectionHeader>
                      </WorldMapTitle>
                      <TimelineChart
                        terrorist={filteredData}
                        range={range}
                        updateRange={data => {
                          this.setState({ range: data });
                        }}
                        updateTerrorist={data => {
                          this.setState({ filteredData2: data });
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <WorldMapTitle>
                        <SelectionHeader>
                          Number of Terrorist Activities by Country
                        </SelectionHeader>
                      </WorldMapTitle>
                      <CountryBarChart terrorist={filteredData} world={world} />
                    </>
                  )}
                </WorldMapContainer>
              ) : (
                <div
                  style={{
                    width: "auto",
                    height: "100px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Spin tip="Loading..." />
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default Form.create()(App);
