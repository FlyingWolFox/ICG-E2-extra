import { Canvas, Color } from './canvas'

type Point2d = [number, number]

// rasterizes the a line (x0, y0) to (x1, y1)
// with color interpolation
export function MidPointLineAlgorithm(color_buffer: Canvas, x0: number, y0: number, x1: number, y1: number, color_0: Color, color_1: Color) {
    let ctx = color_buffer.context
    ctx.strokeStyle = `rgb(${color_0[0]}, ${color_0[1]}, ${color_0[2]})`
    ctx.beginPath()
    ctx.moveTo(x0, (color_buffer.canvas.height/color_buffer.scale - 1) - y0)
    ctx.lineTo(x1, (color_buffer.canvas.height/color_buffer.scale - 1) - y1)
    ctx.stroke()
    return
}

export function DrawTriangle(color_buffer: Canvas, x0: number, y0: number, x1:number, y1:number, x2:number, y2:number, color_0: Color, color_1: Color, color_2: Color) {
    // drwa the three sides of the triangle
    MidPointLineAlgorithm(color_buffer, x0, y0, x1, y1, color_0, color_1);
    MidPointLineAlgorithm(color_buffer, x1, y1, x2, y2, color_1, color_2);
    MidPointLineAlgorithm(color_buffer, x2, y2, x0, y0, color_2, color_0);
}

