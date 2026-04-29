import { RSI, MACD, BollingerBands } from 'technicalindicators';
import { OHLCV } from '../stores/marketStore';

export function calculateRSI(candles: OHLCV[], period = 14) {
  const values = candles.map((c) => c.close);
  return RSI.calculate({ values, period });
}

export function calculateMACD(candles: OHLCV[], fast = 12, slow = 26, signal = 9) {
  const values = candles.map((c) => c.close);
  return MACD.calculate({
    values,
    fastPeriod: fast,
    slowPeriod: slow,
    signalPeriod: signal,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
}

export function calculateBB(candles: OHLCV[], period = 20, stdDev = 2) {
  const values = candles.map((c) => c.close);
  return BollingerBands.calculate({ values, period, stdDev });
}
