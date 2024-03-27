import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { sendSQL } from "../Utilities/SQLFunctions";

const TableGraph = ({ statisticProp }) => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await sendSQL("SELECT * FROM transaction_history");
      return response;
    }
    fetchData().then((data) => {
      setSalesData(data);
    });
  }, []);

  useEffect(() => {
    setStatistic(statisticProp);
  }, [statisticProp]);

  const [timeframe, setTimeframe] = useState("1M");
  const [statistic, setStatistic] = useState(statisticProp);
  const [filteredData, setFilteredData] = useState({
    table: [],
    stat: [],
    title: "1 Month Sales Per Person",
    yaxis: "Sales Per Person ($)"
  });

  const processData = (timeframe, statistic) => {
    let startDate;
    let timeframeTitle;
    let statisticTitle;
    let yaxisTitle;
    switch (timeframe) {
      case "1W":
        startDate = moment().subtract(1, "week");
        timeframeTitle = "1 Week";
        break;
      case "1M":
        startDate = moment().subtract(1, "month");
        timeframeTitle = "1 Month";
        break;
      case "3M":
        startDate = moment().subtract(3, "months");
        timeframeTitle = "3 Months";
        break;
      case "6M":
        startDate = moment().subtract(6, "months");
        timeframeTitle = "6 Months";
        break;
      case "1Y":
        startDate = moment().subtract(1, "year");
        timeframeTitle = "1 Year";
        break;
      case "YTD":
        startDate = moment().startOf("year");
        timeframeTitle = "Year To Date";
        break;
      case "All":
        startDate = moment(0);
        timeframeTitle = "All Time";
        break;
      default:
        startDate = moment().subtract(1, "month");
        timeframeTitle = "1 Month";
    }

    const data = salesData.filter((item) =>
      moment(item.date).isSameOrAfter(startDate, "days")
    );

    const groupedData = data.reduce((acc, curr) => {
      const tableId = curr.table_id;
      if (!acc[tableId]) {
        acc[tableId] = { table_id: tableId, value: 0, count: 0 };
      }

      const arrivalTime = moment(curr.arrival_time, "HH:mm");
      const endTime = moment(curr.end_time, "HH:mm");
      let timeSpent = endTime.diff(arrivalTime, "minutes");

      switch (statistic) {
        case "SPP":
          statisticTitle = "Sales Per Person";
          yaxisTitle = "Sales Per Person ($)"
          if (curr.patron_count > 0)
            acc[tableId].value += curr.final_bill / curr.patron_count;
          break;
        case "TP":
          statisticTitle = "Tip Percentage";
          yaxisTitle = "Tip Percentage (%)"
          if (curr.final_bill > 0)
            acc[tableId].value += (curr.tip * 100) / curr.final_bill;
          break;
        case "TS":
          statisticTitle = "Time Spent";
          yaxisTitle = "Time Spent (minutes)"
          acc[tableId].value += timeSpent;
          break;
        case "SPH":
          statisticTitle = "Sales Per Hour";
          yaxisTitle = "Sales Per Hour ($)"
          if (timeSpent > 0)
            acc[tableId].value += (curr.final_bill * 60) / timeSpent;
          break;
        default:
          statisticTitle = "Sales Per Person";
          yaxisTitle = "Sales Per Person ($)"
          if (curr.patron_count > 0)
            acc[tableId].value += curr.final_bill / curr.patron_count;
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
      title: timeframeTitle + " " + statisticTitle,
      yaxis: yaxisTitle
    });
  };

  useEffect(() => {
    processData(timeframe, statistic);
  }, [salesData, timeframe, statistic]);

  return (
    <>
      <Plot
        style={{ overflow: "hidden" }}
        data={[
          {
            x: filteredData.table,
            y: filteredData.stat,
            type: "bar",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          width: 1280,
          height: 720,
          title: filteredData.title,
          xaxis: {
            tickvals: filteredData.table,
            ticktext: filteredData.table,
            title: {
              text: "Table ID",
              font: {
                weight: "bold",
              },
            },
          },
          yaxis: {
            title: filteredData.yaxis,
            showgrid: false,
          },
        }}
      />

      <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("1W")}
        >
          1W
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("1M")}
        >
          1M
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("3M")}
        >
          3M
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("6M")}
        >
          6M
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("1Y")}
        >
          1Y
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("YTD")}
        >
          YTD
        </Button>
        <Button
          style={{ marginRight: "5px" }}
          onClick={() => setTimeframe("All")}
        >
          All
        </Button>
      </div>
    </>
  );
};

export default TableGraph;
