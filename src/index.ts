import * as Renderer from './renderer'
import * as Camera from './camera'
import * as Transformations from './transformations'
import * as Keys from './input'

let screen = new Renderer.Screen('canvas', 1)
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


let camera = new Camera.Camera([1.3,1.7,2.0])
//let camera = new Camera.Camera([0,0,2.0])


var playfield = {
        meshs: [cube],
        cam: camera,
        screen: screen,
        mode: 1
}

function mode_1() {
        if (playfield.mode != 1) {
                // load stuff
                playfield.mode = 1
        }

        if (Keys.input['s1_up'])
                cube.transform = Transformations.translate(cube.transform, [0, 0.1, 0])
        if (Keys.input['s1_down'])
                cube.transform = Transformations.translate(cube.transform, [0, -0.1, 0])
        if (Keys.input['s1_left'])
                cube.transform = Transformations.translate(cube.transform, [-0.1, 0, 0])
        if (Keys.input['s1_right'])
                cube.transform = Transformations.translate(cube.transform, [0.1, 0, 0])

        if (Keys.input['s2_up'])
                cube.transform = Transformations.rotate_x(cube.transform, -5)
        if (Keys.input['s2_down'])
                cube.transform = Transformations.rotate_x(cube.transform, 5)
        if (Keys.input['s2_left'])
                cube.transform = Transformations.rotate_y(cube.transform, 5)
        if (Keys.input['s2_right'])
                cube.transform = Transformations.rotate_y(cube.transform, -5)
        
}

function mode_2() {
        if (playfield.mode != 2) {
                // load stuff
                playfield.mode = 2
        }

        if (Keys.input['s1_up']) 
                camera = Camera.move(camera, [0, 0, -0.1])
        if (Keys.input['s1_down'])
                camera = Camera.move(camera, [0, 0, 0.1])
        if (Keys.input['s1_left'])
                camera = Camera.move(camera, [-0.1, 0, 0])
        if (Keys.input['s1_right'])
                camera = Camera.move(camera, [0.1, 0, 0])

        if (Keys.input['s2_up'])
                camera = Camera.rotate_vertical(camera, -2.5)
        if (Keys.input['s2_down'])
                camera = Camera.rotate_vertical(camera, 2.5)
        if (Keys.input['s2_left'])
                camera = Camera.rotate_horizontal(camera, 2.5)
        if (Keys.input['s2_right'])
                camera = Camera.rotate_horizontal(camera, -2.5)        
}

let shear_counter = 0
function mode_3() {
        if (shear_counter < 25 || shear_counter >= 75) {
                cube.transform = Transformations.shear_x(cube.transform, 0.9)
        }
        else {
                cube.transform = Transformations.shear_x(cube.transform, -0.9)
        }
        shear_counter = (shear_counter + 1)%100

}

let last = 1
let text = '(Cube Control)'
let mode_on_page = document.getElementById('mode')
function loop() {
        let mode = last
        if (Keys.input['mode_1']) {
                mode = 1
                text = '(Cube Control)'
        }
        else if (Keys.input['mode_2']) {
                mode = 2
                text = '(Camera Control)'
        }
        else if (Keys.input['mode_3']) {
                mode = 3
                text = '(Shear Animation)'
        }

        switch (mode) {
                case 1:
                        mode_1()
                        break;
                case 2:
                        mode_2()
                        break
                case 3:
                        mode_3()
                        break
        
                default:
                        mode_1()
                        break;
        }
        last = mode
        if (mode_on_page != null)
                mode_on_page.innerHTML = `Current mode: ${mode} ${text}`

        Renderer.render(camera, screen, [cube])
}

window.onkeydown = Keys.press
window.onkeyup = Keys.release
Renderer.requestAnimationFrame(loop)
