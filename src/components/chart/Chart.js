import React, { useRef, useEffect } from "react";

const Chart = ({ data }) => {
  const chartRef = useRef();

  const WIDTH = 600;
  const HEIGHT = 200;
  const DPI_WIDTH = WIDTH * 2;
  const DPI_HEIGHT = HEIGHT * 2;
  const ROWS_COUNT = 5;
  const PADDING = 40;
  const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;

  useEffect(() => {
    chartRef && data && chartRender(chartRef.current, data);
  }, [chartRef, data]);

  const chartRender = (canvas, data) => {
    const ctx = canvas.getContext("2d");
    canvas.style.width = WIDTH;
    canvas.style.height = HEIGHT;
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;
 
    const [yMin, yMax] = getBoundaries(data);
    const yRatio = VIEW_HEIGHT / (yMax - yMin)
    const xRatio = DPI_WIDTH / (data.columns[0].length - 2)
    

    const yData = data.columns.filter(item => data.types[item[0]] === 'line')
    const xData = data.columns.filter(item => data.types[item[0]] !== 'line')[0]

    //render axis
    yAxis(ctx, yMax, yMin)
    xAxis(ctx, xData, xRatio)

    yData.map(toCoords(xRatio, yRatio)).forEach((coords, idx) => {
      const color = data.colors[yData[idx][0]]
      line(ctx, coords, { color })
    })
  };

  const toDate = (timestamp) => {
    const shortMonths = [
      'Янв.',
      'Фев.',
      'Мар.',
      'Апр.',
      'Май',
      'Июн.',
      'Июл.',
      'Авг.',
      'Сен.',
      'Окт.',
      'Ноя.',
      'Дек.',
    ]
    const date = new Date(timestamp)
    return `${shortMonths[date.getMonth()]} ${date.getDate()}`
  }

  const toCoords = (xRatio, yRatio) => {
    return (item) => item.map((y, idx) => [
      Math.floor((idx - 1) * xRatio),
      Math.floor(DPI_HEIGHT - PADDING - y * yRatio)
    ]).filter((_, i) => i !== 0)

  }

  const getBoundaries = ({columns, types}) => {
      let min, max

      columns.forEach(item => {
          if (types[item[0]] !== 'line') return

          if (typeof min !== 'number') min = item[1]
          if (typeof max !== 'number') max = item[1]

          if (min > item[1]) min = item[1]
          if (max < item[1]) max = item[1]

          for (let i = 2; i < item.length; i++) {
            if (min > item[i]) min = item[i]
            if (max < item[i]) max = item[i]
          }
      });

      return [min, max]
  }

  const xAxis = (ctx, data, xRatio) => {
    const cols = 6
    const step = Math.round(data.length / cols)
    ctx.beginPath()
    for (let i = 1; i < data.length; i += step) {
      const text = toDate(data[i])
      const x = i * xRatio
      ctx.fillText(text.toString(), x, DPI_HEIGHT - 10)
    }
    ctx.closePath()
  }

  const yAxis = (ctx, yMax, yMin) => {
    const step = VIEW_HEIGHT / ROWS_COUNT;

    const textStep = (yMax - yMin) / ROWS_COUNT;

    ctx.beginPath();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "#bbb";
    ctx.font = "normal 20px Helvetica, sans-serif";
    ctx.fillStyle = "#96a2aa";
    for (let i = 1; i <= ROWS_COUNT; i++) {
      const y = step * i;
      const text = Math.round(yMax - textStep * i)
      ctx.fillText(text.toString(), 5, y + PADDING - 5);
      ctx.moveTo(0, y + PADDING);
      ctx.lineTo(DPI_WIDTH, y + PADDING);
    }
    ctx.stroke();
    ctx.closePath();
  }

  const line = (ctx, coords, {color}) => {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    for (const [x, y] of coords) {
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  return <canvas ref={chartRef}></canvas>;
};

export default Chart;
