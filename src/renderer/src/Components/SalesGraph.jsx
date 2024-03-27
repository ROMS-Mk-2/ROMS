import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { sendSQL } from "../Utilities/SQLFunctions";

const SalesGraph = () => {
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

  const [timeframe, setTimeframe] = useState("1M");
  const [filteredData, setFilteredData] = useState({
    days: [],
    sales: [],
    title: "1 Month",
  });

  const processData = (timeframe) => {
    let startDate;
    let title;
    switch (timeframe) {
      case "1W":
        startDate = moment().subtract(1, "week");
        title = "1 Week";
        break;
      case "1M":
        startDate = moment().subtract(1, "month");
        title = "1 Month";
        break;
      case "3M":
        startDate = moment().subtract(3, "months");
        title = "3 Months";
        break;
      case "6M":
        startDate = moment().subtract(6, "months");
        title = "6 Months";
        break;
      case "1Y":
        startDate = moment().subtract(1, "year");
        title = "1 Year";
        break;
      case "YTD":
        startDate = moment().startOf("year");
        title = "Year To Date";
        break;
      case "All":
        startDate = moment(0);
        title = "All Time";
        break;
      default:
        startDate = moment().subtract(1, "month");
        title = "1 Month";
    }

    const data = salesData
      .filter((item) => moment(item.date).isSameOrAfter(startDate, "days"))
      .sort((a, b) => moment(a.date).diff(moment(b.date)));

    const groupedData = data.reduce((acc, curr) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = { date: date, final_bill: 0 };
      }
      acc[date].final_bill += curr.final_bill;
      return acc;
    }, {});

    setFilteredData({
      days: Object.values(groupedData).map((data) => data.date),
      sales: Object.values(groupedData).map((data) => data.final_bill),
      title: title,
    });
  };

  useEffect(() => {
    processData(timeframe);
  }, [salesData, timeframe]);

  // Generate tick values and text for the x-axis
  const { tickVals, tickText } = filteredData.days.reduce(
    (acc, date, index, array) => {
      // Check if it's a new month, a new year for the "All" timeframe, or any day for "1W" and "1M"
      const isNewTick =
        timeframe === "1W" || timeframe === "1M"
          ? true
          : timeframe === "All"
          ? index === 0 ||
            moment(date).year() !== moment(array[index - 1]).year()
          : index === 0 ||
            moment(date).month() !== moment(array[index - 1]).month();

      if (isNewTick) {
        acc.tickVals.push(date);
        if (timeframe === "All") {
          acc.tickText.push(moment(date).format("YYYY"));
        } else if (timeframe === "1W" || timeframe === "1M") {
          acc.tickText.push(moment(date).format("ddd D")); // Format as day of the week and day of the month
        } else {
          acc.tickText.push(moment(date).format("MMMM YYYY"));
        }
      }
      return acc;
    },
    { tickVals: [], tickText: [] }
  );

  return (
    <>
      <Plot
        style={{ overflow: "hidden" }}
        data={[
          {
            x: filteredData.days,
            y: filteredData.sales,
            type: "bar",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          autosize: true,
          title: `${filteredData.title} Sales`,
          xaxis: {
            tickvals: tickVals,
            ticktext: tickText,
            tickangle: timeframe === "1W" ? 0 : undefined,
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

export default SalesGraph;
