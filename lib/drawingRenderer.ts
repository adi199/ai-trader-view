import { ISeriesPrimitive, IPrimitivePaneView, IPrimitivePaneRenderer } from 'lightweight-charts';

// Horizontal Line Primitive (Simplified for Box/Trendline)
// Note: In real production, we'd implement full IPrimitivePaneRenderer
// For this demo, we'll use a series-based approach in ChartContainer for horizontal lines
// and provide a placeholder for more complex ones.

export class BoxRenderer implements IPrimitivePaneRenderer {
    _data: any;
    constructor(data: any) {
        this._data = data;
    }
    draw(target: any) {
        target.useCanvas((ctx: CanvasRenderingContext2D) => {
            const { x1, x2, y1, y2, color } = this._data;
            ctx.fillStyle = color;
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        });
    }
}
