const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

async function fetchFMP(urlWithoutKey: string, fallback: any = []) {
  if (!FMP_API_KEY) {
    console.warn('FMP API Key missing');
    return fallback;
  }
  const separator = urlWithoutKey.includes('?') ? '&' : '?';
  const url = `${urlWithoutKey}${separator}apikey=${FMP_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`FMP Error [${response.status}] for ${urlWithoutKey}:`, errorBody);
      return fallback; // Graceful degradation instead of crashing Promise.all
    }
    return await response.json();
  } catch (error) {
    console.error(`Network Error fetching ${urlWithoutKey}:`, error);
    return fallback;
  }
}

export const fmp = {
  getProfile: (symbol: string) => 
    fetchFMP(`https://financialmodelingprep.com/stable/profile?symbol=${symbol}`),
  getKeyMetrics: (symbol: string) => 
    fetchFMP(`https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${symbol}`),
  getRatios: (symbol: string) => 
    fetchFMP(`https://financialmodelingprep.com/stable/ratios-ttm?symbol=${symbol}`),
  getPriceTarget: (symbol: string) => 
    fetchFMP(`https://financialmodelingprep.com/stable/price-target-summary?symbol=${symbol}`),
  getGrades: (symbol: string) => 
    fetchFMP(`https://financialmodelingprep.com/stable/grades?symbol=${symbol}`),
  getHistoricalChart: (symbol: string, interval: string = '5min') => 
    fetchFMP(`https://financialmodelingprep.com/stable/historical-chart/${interval}?symbol=${symbol}`),
  getHistoricalPriceFull: (symbol: string) =>
    fetchFMP(`https://financialmodelingprep.com/stable/historical-price-full?symbol=${symbol}`, { historical: [] }),
};
