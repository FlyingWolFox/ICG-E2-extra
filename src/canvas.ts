export type Color = [number, number, number, number]

export class Canvas {
    canvas: any
    context: any
    scale: number
    clear_color: string
  constructor(canvas_id: string, scale: number = 1) {
    this.canvas = document.getElementById(canvas_id);
    this.context = this.canvas.getContext("2d");
    this.scale = scale;
    this.context.scale(scale, scale);
    this.clear_color = 'rgba(0,0,0,255)';
  }

  clear(): void {
    this.context.fillStyle = this.clear_color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  putPixel(x: number, y:number, color: Color): void {
    this.context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    this.context.fillRect(x, (this.canvas.height/this.scale - 1) - y, 1, 1);
  }
}