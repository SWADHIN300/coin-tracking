"use client"

import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData } from "@/lib/utils";
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react"

const CandlestickChart = ({
    children,
    data,
    coinId,
    height = 360,
    initialPeriod = 'daily',
    liveInterval = '1m',
    setLiveInterval,
}: CandlestickChartProps) => {
    const [loading,setLoading] = useState(false);
    const [period,setPeriod] = useState(initialPeriod);
    const [ohlcData,setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending,startTransation] = useTransition();

    const chartCointainerref = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeries = useRef<ISeriesApi<'Candlestick'>|null>(null);

  const fetchOHLData = async (selectedPeriod: Period) => {
  try {
    const { days } = PERIOD_CONFIG[selectedPeriod];

    const newData = await fetcher<OHLCData[]>(
      `/coins/${coinId}/ohlc`,
      {
        vs_currency: 'usd',
        days, 
      },
      120
    );

    setOhlcData(newData ?? []);
  } catch (error) {
    console.error('Failed to fetch OHLC data', error);
  }
};


   const handlePeriodChange = (newPeriod: Period)=>{
    if(newPeriod === period) return ; 
    
    
     startTransation(async () =>{
       setPeriod(newPeriod);
       await fetchOHLData(newPeriod);
     });
   }

   useEffect(()=>{
    const container = chartCointainerref.current;
    if(!container) return;

    const showTime = ['daily','weekly','monthly'].includes(period);

    const chart = createChart(container,{
        ...getChartConfig(height,showTime),
        width:container.clientHeight+100,
       
    });
    const series = chart.addSeries(CandlestickSeries,getCandlestickConfig());

    series.setData(convertOHLCData(ohlcData));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeries.current = series;
   
    const observer = new ResizeObserver((entries)=>{
        if(!entries.length) return;
        chart.applyOptions({ width: entries[0].contentRect.width });
    });
     observer.observe(container);

     return () =>{
        observer.disconnect();
        chart.remove();
        chartRef.current = null;
        candleSeries.current = null;
     }
   },[height]);

   useEffect(() => {
  if (!candleSeries.current) return;

  const convertToSeconds = ohlcData.map((item) => [
    Math.floor(item[0] / 1000), // time in seconds
    item[1], // open
    item[2], // high
    item[3], // low
    item[4], // close 
     ]as OHLCData
    );

  const converted = convertOHLCData(convertToSeconds);
  candleSeries.current.setData(converted);
  chartRef.current ?.timeScale().fitContent();
}, [ohlcData, period]);


  return (
    <div id="candlestick-chart">
      <div className='chart-header'>
        <div className='flex-1'>{children}</div>

        <div className="button-group">
            <span className="text-sm mx-2 font-medium text-purple-100/50">Period:</span>
            {PERIOD_BUTTONS.map(({ value,label })=>(
                 <button key={value} className={period === value ? 'config-button-active' : 'config-button'}  onClick={() => handlePeriodChange(value)}
            disabled={loading}>
                {label}
            </button>
            ))}
        </div>
      </div>

      <div ref={chartCointainerref} className="chart" style={{ height }} />
    </div>
  )
}

export default CandlestickChart
