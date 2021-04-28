import { Canvas, Color } from './canvas'

type Point2d = [number, number]

// reperesents a bidimensional plane
// will tranform from any other octet to a
// and from a to any octet
// octets:
// \ c | b /
//  \  |  / 
// d \ | / a
// ----|---- 0°
// e / | \ h 
//  /  |  \  
// / f | g \ 
class OctetSpace {
    TransformToA: Function
    TransformFromA: Function
    constructor(dx: number, dy: number) {
        let m = dy/dx;
        let mirrorx = Math.sign(dx);
        let mirrory = Math.sign(dy);
        // octet b or g 
        if (m > 1 || m < -1) {
            this.TransformToA = (x: number, y: number): Point2d => {
                return [mirrory * y, mirrorx * x];
            }
            this.TransformFromA = (x: number, y: number): Point2d => {
                return [mirrorx * y, mirrory * x]
            }
        }
        // octet a or h
        else {
            this.TransformToA = (x: number, y: number): Point2d => {
                return [mirrorx * x, mirrory * y];
            }
            this.TransformFromA = (x: number, y: number): Point2d => {
                return [mirrorx * x, mirrory * y]
            }
        }
    }
}

// rasterizes the a line (x0, y0) to (x1, y1)
// with color interpolation
export function MidPointLineAlgorithm(color_buffer: Canvas, x0: number, y0: number, x1: number, y1: number, color_0: Color, color_1: Color) {
    // transform space to match octet a (first octet)
    let space = new OctetSpace(x1 - x0, y1 - y0);
    [x0 , y0] = space.TransformToA(x0, y0);
    [x1 , y1] = space.TransformToA(x1, y1);

    let dx = x1 - x0;
    let dy = y1 - y0;
    let d = 2 * dy - dx;
    let incrE = 2 * dy;
    let incrNE = 2 * (dy - dx);
    let x = x0;
    let y = y0;
    let point_to_color: Point2d = space.TransformFromA(x, y);
    color_buffer.putPixel(point_to_color[0], point_to_color[1], color_0);

    // calculate gradient
    let r0 = color_0[0];
    let g0 = color_0[1];
    let b0 = color_0[2];
    let a0 = color_0[3];
    let dr = (color_1[0] - color_0[0])/dx;
    let dg = (color_1[1] - color_0[1])/dx;
    let db = (color_1[2] - color_0[2])/dx;
    let da = (color_1[3] - color_0[3])/dx;

    while (x < x1) {
        if (d <= 0) {
            d += incrE;
            x++;
        }
        else {
            d += incrNE;
            x++;
            y++;
        }
        let color: Color = [r0 + dr * (x - x0), g0 + dg * (x - x0), b0 + db * (x - x0), a0 + da * (x - x0)]
        point_to_color = space.TransformFromA(x, y);
        color_buffer.putPixel(point_to_color[0], point_to_color[1], color);
    }
}

export function DrawTriangle(color_buffer: Canvas, x0: number, y0: number, x1:number, y1:number, x2:number, y2:number, color_0: Color, color_1: Color, color_2: Color) {
    // drwa the three sides of the triangle
    MidPointLineAlgorithm(color_buffer, x0, y0, x1, y1, color_0, color_1);
    MidPointLineAlgorithm(color_buffer, x1, y1, x2, y2, color_1, color_2);
    MidPointLineAlgorithm(color_buffer, x2, y2, x0, y0, color_2, color_0);
}

