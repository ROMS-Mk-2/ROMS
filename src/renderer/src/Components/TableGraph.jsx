import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Button from "react-bootstrap/Button";
import salesData from "../Assets/sales.json";
import moment from "moment";

const TableGraph = () => {
  const [timeframe, setTimeframe] = useState("1M");
  const [statistic, setStatistic] = useState("SPP");
  const [filteredData, setFilteredData] = useState({ table: [], stat: [], title: "1 Month Sales Per Person"});

  const processData = (timeframe, statistic) => {
    let startDate;
    let timeframeTitle;
    let statisticTitle;
    switch (timeframe) {
      case "1W":
        startDate = moment().subtract(1, "week");
        timeframeTitle = "1 Week"
        break;
      case "1M":
        startDate = moment().subtract(1, "month");
        timeframeTitle = "1 Month"
        break;
      case "3M":
        startDate = moment().subtract(3, "months");
        timeframeTitle = "3 Months"
        break;
      case "6M":
        startDate = moment().subtract(6, "months");
        timeframeTitle = "6 Months"
        break;
      case "1Y":
        startDate = moment().subtract(1, "year");
        timeframeTitle = "1 Year"
        break;
      case "YTD":
        startDate = moment().startOf("year");
        timeframeTitle = "Year To Date"
        break;
      case "All":
        startDate = moment(0);
        timeframeTitle = "All Time"
        break;
      default:
        startDate = moment().subtract(1, "month");
        timeframeTitle = "1 Month"
    }

    const data = salesData
      .filter((item) => moment(item.date).isSameOrAfter(startDate, "days"))


    const groupedData = data.reduce((acc, curr) => {
      const tableId = curr.table_id;
      if (!acc[tableId]) {
        acc[tableId] = { table_id: tableId, value: 0, count: 0 };
      }
      switch (statistic) {
        case 'SPP':
            statisticTitle = "Sales Per Person"
            if(curr.patron_count > 0) acc[tableId].value += curr.final_bill / curr.patron_count;
            break;
        case 'TP':
            statisticTitle = "Tip Percentage"
            if(curr.final_bill > 0) acc[tableId].value += (curr.tip * 100) / curr.final_bill;
            break;
        case 'TS':
            statisticTitle = "Time Spent"
            acc[tableId].value += curr.time_spent;
            break;
        case 'SPH':
            statisticTitle = "Sales Per Hour"
            if(curr.time_spent > 0) acc[tableId].value += (curr.final_bill * 60) / curr.time_spent;
            break;
        default:
            statisticTitle = "Sales Per Person"
            if(curr.patron_count > 0) acc[tableId].value += curr.final_bill / curr.patron_count;
      }
    
      acc[tableId].count++;
      return acc;
    }, {});
    
    Object.keys(groupedData).forEach((key) => {
      groupedData[key].value /= groupedData[key].count;
    });
    

    setFilteredData({
      table: Object.values(groupedData).map((data) => data.table_id),
      stat: Object.values(groupedData).map((data) => data.value),
      title: timeframeTitle + " " + statisticTitle
    });
  };

  useEffect(() => {
    processData(timeframe, statistic);
  }, [timeframe, statistic]);


  return (
    <>
      <Plot
        data={[
          {
            x: filteredData.table,
            y: filteredData.stat,
            type: "bar",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          width: 640,
          height: 480,
          title: filteredData.title,
          xaxis: {
            tickvals: filteredData.table,
            ticktext: filteredData.table,
            title: {
                text: 'Table ID',
                font: {
                  weight: 'bold'
                }
              }
          },
          yaxis: {
            showgrid: false,
          },
        }}
      />

      <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("1W")}>1W</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("1M")}>1M</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("3M")}>3M</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("6M")}>6M</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("1Y")}>1Y</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("YTD")}>YTD</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setTimeframe("All")}>All</Button>
        </div>
        <div style={{ marginLeft: '20px'}}>
        <Button style={{ marginRight: '5px' }} onClick={() => setStatistic("SPP")}>Sales Per Person</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setStatistic("TP")}>Tip Percentage</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setStatistic("TS")}>Time Spent</Button>
        <Button style={{ marginRight: '5px' }} onClick={() => setStatistic("SPH")}>Sales Per Hour</Button>
      </div>
    </>
  );
};

export default TableGraph;
