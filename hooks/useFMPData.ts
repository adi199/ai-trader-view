import { useEffect, useCallback } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { fmp } from '../lib/fmp';

export function useFMPData() {
  const { symbol, timeframe, setMarketData, setLoading } = useMarketStore();

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    try {
      let historicalPromise;
      if (timeframe === '1D') {
        historicalPromise = fmp.getHistoricalChart(symbol, '5min');
      } else if (timeframe === '1W') {
        historicalPromise = fmp.getHistoricalChart(symbol, '15min');
      } else if (timeframe === '1M') {
        historicalPromise = fmp.getHistoricalChart(symbol, '1hour');
      } else {
        historicalPromise = fmp.getHistoricalPriceFull(symbol).then(data => data.historical || []);
      }

      const [profile, metrics, ratios, priceTarget, grades, candlesRaw] = await Promise.all([
        fmp.getProfile(symbol),
        fmp.getKeyMetrics(symbol),
        fmp.getRatios(symbol),
        fmp.getPriceTarget(symbol),
        fmp.getGrades(symbol),
        historicalPromise,
      ]);

      const p = profile[0] || {};
      const m = metrics[0] || {};
      const r = ratios[0] || {};
      const pt = priceTarget[0] || {};
      const g = grades[0] || {};

      // Filter candles based on timeframe
      let filteredCandles = candlesRaw;
      const now = new Date().getTime();
      const msPerDay = 24 * 60 * 60 * 1000;
      
      if (timeframe === '1D') {
        // Just the latest day or so, maybe last 78 candles (approx 1 trading day in 5m)
        filteredCandles = candlesRaw.slice(0, 78);
      } else if (timeframe === '1W') {
        filteredCandles = candlesRaw.slice(0, 150); // rough approximation
      } else if (timeframe === '1M') {
        filteredCandles = candlesRaw.slice(0, 150); // rough approximation
      } else if (timeframe === '3M') {
        filteredCandles = candlesRaw.filter((c: any) => now - new Date(c.date).getTime() < 90 * msPerDay);
      } else if (timeframe === '1Y') {
        filteredCandles = candlesRaw.filter((c: any) => now - new Date(c.date).getTime() < 365 * msPerDay);
      }

      setMarketData({
        companyName: p.companyName || '',
        exchange: p.exchangeShortName || '',
        sector: p.sector || '',
        industry: p.industry || '',
        price: p.price || 0,
        change: p.changes || 0,
        changePercentage: p.changesPercentage || 0,
        volume: p.volAvg || 0,
        averageVolume: p.volAvg || 0,
        weekRange: p.range || '',
        marketCap: p.mktCap || 0,
        beta: p.beta || 0,
        pe: r.priceToEarningsRatioTTM || 0,
        ps: r.priceToSalesRatioTTM || 0,
        pfcf: r.priceToFreeCashFlowRatioTTM || 0,
        evEbitda: m.evToEBITDATTM || 0,
        dividendYield: r.dividendYieldTTM || 0,
        grossMargin: r.grossProfitMarginTTM || 0,
        netMargin: r.netProfitMarginTTM || 0,
        roe: m.returnOnEquityTTM || 0,
        roic: m.returnOnInvestedCapitalTTM || 0,
        fcfPerShare: r.freeCashFlowPerShareTTM || 0,
        eps: r.netIncomePerShareTTM || 0,
        priceTarget: pt.targetConsensus || 0,
        targetHigh: pt.targetHigh || 0,
        targetLow: pt.targetLow || 0,
        analystRating: g.consensusRating || '',
        candles: filteredCandles.map((c: any) => ({
          time: new Date(c.date).getTime() / 1000,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume,
        })).sort((a: any, b: any) => a.time - b.time),
      });
    } catch (error) {
      console.error('Failed to fetch FMP data:', error);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe, setMarketData, setLoading]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  return { refresh: fetchData };
}
