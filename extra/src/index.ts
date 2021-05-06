import * as Renderer from './renderer'
import * as Camera from './camera'
import * as Transformations from './transformations'

let screen = new Renderer.Screen('canvas', 4)
screen.clear()

let cube: Renderer.Mesh = {
        vertices: [[-1.0, -1.0, -1.0],
                    [ 1.0, -1.0, -1.0],
                    [ 1.0, -1.0,  1.0],
                    [-1.0, -1.0,  1.0],
                    [-1.0,  1.0, -1.0],
                    [ 1.0,  1.0, -1.0],
                    [ 1.0,  1.0,  1.0],
                    [-1.0,  1.0,  1.0]],

         edges: [[0,1, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [1,2, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [2,3, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [3,0, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [4,5, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [5,6, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [6,7, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [7,4, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [0,4, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [1,5, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [2,6, [255, 0, 0, 0], [255, 0, 0, 0]],
                 [3,7, [255, 0, 0, 0], [255, 0, 0, 0]]],
        transform: new  Transformations.Transformation().set(1.0, 0.0, 0.0, 0.0,
                                                             0.0, 1.0, 0.0, 0.0,
                                                             0.0, 0.0, 1.0, 0.0,
                                                             0.0, 0.0, 0.0, 1.0) 
}


let camera: Camera.Camera = {
        pos: [1.3,1.7,2.0],     // posição da câmera no esp. do Universo.
        look_at: [0.0,0.0,0.0], // ponto para o qual a câmera aponta.
        up: [0.0,1.0,0.0],      // vetor Up da câmera.
        focal_point: 1
}

Renderer.render(camera, screen, [cube])