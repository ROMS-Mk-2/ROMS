import React, {useState} from 'react'
import Plot from 'react-plotly.js'
import Button from 'react-bootstrap/Button'
import salesData from "../Assets/sales.json"

const SalesGraph = () => {
    const [timeframe, setTimeframe] = useState("1M")
    const days = salesData.map(item => item["Reporting Day"])
    const sales = salesData.map(item => item["Daypart Sales $"])
    return (
        <>
        {timeframe === "1M" && 
        <Plot
            data={[
            {
                x: days,
                y: sales,
                type: 'line',
                mode: 'lines+markers',
                marker: {color: 'blue'},
            },
            ]}
            layout={ {width: 640, height: 480, title: 'A Fancy Plot'} }
        />}
        {timeframe === "1W" &&
        <Plot
            data={[
            {
                x: [3, 6, 9],
                y: [4, 12, 6],
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            },
            {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
        />}
        <div><Button onClick={() => setTimeframe("1W")}>1W</Button> <Button onClick={() => setTimeframe("1M")}>1M</Button></div>
        </>
        );
}

export default SalesGraph