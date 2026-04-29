import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useMarketStore } from "../stores/marketStore";
import { useDrawingStore } from "../stores/drawingStore";
import { useIndicatorStore } from "../stores/indicatorStore";
import { TradeSummaryCard } from "../components/TradeSummaryCard";

export function useCopilotSync() {
  const market = useMarketStore();
  const { drawings, addDrawing, clearAll } = useDrawingStore();
  const { toggleIndicator } = useIndicatorStore();

  // Expose readable state to the LLM
  useCopilotReadable({
    description: "Current market data and fundamentals",
    value: {
      symbol: market.symbol,
      companyName: market.companyName,
      sector: market.sector,
      price: market.price,
      changePercentage: market.changePercentage,
      volume: market.volume,
      fundamentals: {
        pe: market.pe,
        ps: market.ps,
        roe: market.roe,
        margins: {
          gross: market.grossMargin,
          net: market.netMargin
        },
        targets: {
          consensus: market.priceTarget,
          rating: market.analystRating
        }
      },
      lastCandles: market.candles.slice(-50),
      activeDrawings: drawings
    }
  });

  // Tools for the AI to call
  useCopilotAction({
    name: "draw_support_line",
    description: "Draw a support line on the chart at a specific price",
    parameters: [
      { name: "price", type: "number", description: "The price level for the support line", required: true },
      { name: "label", type: "string", description: "Optional label for the line" }
    ],
    handler: ({ price, label }) => {
      addDrawing({
        id: Math.random().toString(36).substr(2, 9),
        type: "support",
        price,
        color: "#26a69a",
        label: label || "Support"
      });
    }
  });

  useCopilotAction({
    name: "draw_resistance_line",
    description: "Draw a resistance line on the chart at a specific price",
    parameters: [
      { name: "price", type: "number", description: "The price level for the resistance line", required: true },
      { name: "label", type: "string", description: "Optional label for the line" }
    ],
    handler: ({ price, label }) => {
      addDrawing({
        id: Math.random().toString(36).substr(2, 9),
        type: "resistance",
        price,
        color: "#ef5350",
        label: label || "Resistance"
      });
    }
  });

  useCopilotAction({
    name: "draw_box",
    description: "Draw a rectangular box on the chart across a specific price range and time range",
    parameters: [
      { name: "priceHigh", type: "number", description: "The upper price boundary of the box", required: true },
      { name: "priceLow", type: "number", description: "The lower price boundary of the box", required: true },
      { name: "timeStart", type: "number", description: "The start time (Unix timestamp in seconds)", required: true },
      { name: "timeEnd", type: "number", description: "The end time (Unix timestamp in seconds)", required: true },
      { name: "label", type: "string", description: "Optional label for the box" }
    ],
    handler: ({ priceHigh, priceLow, timeStart, timeEnd, label }) => {
      addDrawing({
        id: Math.random().toString(36).substr(2, 9),
        type: "box",
        priceHigh,
        priceLow,
        timeStart,
        timeEnd,
        color: "rgba(56, 139, 253, 0.15)",
        label: label || "Box"
      });
    }
  });

  useCopilotAction({
    name: "clear_drawings",
    description: "Clear all drawings from the chart",
    // An optional param is required to avoid Groq sending null instead of {}
    // for zero-argument tools, which CopilotKit rejects with tool_argument_parse_failed.
    parameters: [
      { name: "confirm", type: "boolean", description: "Set to true to confirm clearing all drawings" }
    ],
    handler: () => {
      clearAll();
    }
  });

  useCopilotAction({
    name: "change_symbol",
    description: "Change the active ticker symbol",
    parameters: [
      { name: "symbol", type: "string", description: "The new ticker symbol (e.g., TSLA, BTCUSD)", required: true }
    ],
    handler: ({ symbol }) => {
      market.setSymbol(symbol.toUpperCase());
    }
  });

  useCopilotAction({
    name: "add_indicator",
    description: "Toggle a technical indicator on the chart",
    parameters: [
      { name: "type", type: "string", enum: ["RSI", "MACD", "BB"], description: "The type of indicator to toggle", required: true }
    ],
    handler: ({ type }) => {
      toggleIndicator(type as any);
    }
  });

  useCopilotAction({
    name: "generate_trade_summary",
    description: "Generate a comprehensive trade summary and analysis card in the chat",
    parameters: [
      { name: "symbol", type: "string", description: "Ticker symbol", required: true },
      { name: "companyName", type: "string", description: "Full company name" },
      { name: "price", type: "number", description: "Current price" },
      { name: "change", type: "number", description: "Price change" },
      { name: "changePercentage", type: "number", description: "Price change percentage" },
      { name: "exchange", type: "string", description: "Stock exchange (e.g. NASDAQ)" },
      { name: "sector", type: "string", description: "Company sector" },
      { name: "industry", type: "string", description: "Company industry" },
      { name: "sentiment", type: "string", enum: ["bullish", "bearish", "neutral"], description: "Overall market sentiment", required: true },
      { name: "recommendation", type: "string", enum: ["buy", "sell", "hold"], description: "Trade recommendation", required: true },
      { name: "targetPrice", type: "number", description: "Short-term price target", required: true },
      { name: "metricPe", type: "string", description: "P/E Ratio metric value" },
      { name: "metricNetMargin", type: "string", description: "Net Margin metric value" },
      { name: "metricEvEbitda", type: "string", description: "EV/EBITDA metric value" },
      { name: "metricFcfPerShare", type: "string", description: "FCF per share metric value" },
      { name: "metricVolume", type: "string", description: "Volume metric value" },
      { name: "metricUpside", type: "string", description: "Upside percentage metric value" },
      { name: "reasoning", type: "string[]", description: "List of key reasoning points", required: true },
      { name: "riskLevel", type: "string", enum: ["low", "medium", "high"], description: "Risk assessment", required: true },
    ],
    render: (props) => {
      const { 
        symbol, companyName, price, change, changePercentage, 
        exchange, sector, industry, sentiment, recommendation, 
        targetPrice, reasoning, riskLevel,
        metricPe, metricNetMargin, metricEvEbitda, metricFcfPerShare, metricVolume, metricUpside
      } = props.args;

      const metrics = {
        pe: metricPe,
        netMargin: metricNetMargin,
        evEbitda: metricEvEbitda,
        fcfPerShare: metricFcfPerShare,
        volume: metricVolume,
        upside: metricUpside,
      };
      
      return (
        <TradeSummaryCard
          symbol={symbol || ''}
          companyName={companyName}
          price={price}
          change={change}
          changePercentage={changePercentage}
          exchange={exchange}
          sector={sector}
          industry={industry}
          sentiment={sentiment as any}
          recommendation={recommendation as any}
          targetPrice={targetPrice || 0}
          metrics={metrics as any}
          reasoning={reasoning || []}
          riskLevel={riskLevel as any}
        />
      );
    },
    handler: () => {}
  });
}
