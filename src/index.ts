import * as Renderer from './renderer'
import * as Camera from './camera'
import * as Transformations from './transformations'
import * as Keys from './input'
import { Color } from './canvas'

const RED: Color = [255, 0, 0, 0]

let screen = new Renderer.Screen('canvas', 1)
screen.clear()

let cube: Renderer.Mesh = {
    vertices: [[-1.0, -1.0, -1.0],
    [1.0, -1.0, -1.0],
    [1.0, -1.0, 1.0],
    [-1.0, -1.0, 1.0],
    [-1.0, 1.0, -1.0],
    [1.0, 1.0, -1.0],
    [1.0, 1.0, 1.0],
    [-1.0, 1.0, 1.0]],

    edges: [[0, 1, [255, 0, 0, 0], [255, 0, 0, 0]],
    [1, 2, [255, 0, 0, 0], [255, 0, 0, 0]],
    [2, 3, [255, 0, 0, 0], [255, 0, 0, 0]],
    [3, 0, [255, 0, 0, 0], [255, 0, 0, 0]],
    [4, 5, [255, 0, 0, 0], [255, 0, 0, 0]],
    [5, 6, [255, 0, 0, 0], [255, 0, 0, 0]],
    [6, 7, [255, 0, 0, 0], [255, 0, 0, 0]],
    [7, 4, [255, 0, 0, 0], [255, 0, 0, 0]],
    [0, 4, [255, 0, 0, 0], [255, 0, 0, 0]],
    [1, 5, [255, 0, 0, 0], [255, 0, 0, 0]],
    [2, 6, [255, 0, 0, 0], [255, 0, 0, 0]],
    [3, 7, [255, 0, 0, 0], [255, 0, 0, 0]]],
    transform: new Transformations.Transformation().set(1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0)
}


let camera = new Camera.Camera([1.3, 1.7, 2.0])

function mode_1() {
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
    shear_counter = (shear_counter + 1) % 100

}

function generate_sphere_inefficient(r = 1)
{
    //let sphere = {...cube}
    let vertices: Renderer.Vertice[] = []
    let edges: Renderer.Edge[] = []


    let stacks = 5
    let slices = 10
    let i = 0
    for (let t = 0; t < stacks; t++) {
        let theta1 = t / stacks * Math.PI
        let theta2 = (t + 1) / stacks * Math.PI

        for (let p = 0; p < slices; p++) {
            let phi1 = p / slices * 2 * Math.PI
            let phi2 = (p + 1) / slices * 2 * Math.PI

            vertices.push([r*Math.cos(phi1)*Math.sin(theta1), r*Math.sin(phi1)*Math.sin(theta1), r*Math.cos(theta1)])
            vertices.push([r*Math.cos(phi2)*Math.sin(theta1), r*Math.sin(phi2)*Math.sin(theta1), r*Math.cos(theta1)])
            vertices.push([r*Math.cos(phi2)*Math.sin(theta2), r*Math.sin(phi2)*Math.sin(theta2), r*Math.cos(theta2)])
            vertices.push([r*Math.cos(phi1)*Math.sin(theta2), r*Math.sin(phi1)*Math.sin(theta2), r*Math.cos(theta2)])

            let v1 = i * 4 + 0
            let v2 = i * 4 + 1
            let v3 = i * 4 + 2
            let v4 = i * 4 + 3

            if (t == 0) {
                edges.push([v1,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v3,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v4,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            else if (t + 1 == stacks) {
                edges.push([v3,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v1,v2, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v2,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            else {
                edges.push([v1,v2, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v2,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v4,v1, [255, 0, 0, 0], [255, 0, 0, 0]])

                edges.push([v2,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v3,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                //edges.push([v3,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            i++
        }
    }

    //sphere.vertices = vertices
    //sphere.edges = edges
    cube.vertices = vertices
    cube.edges = edges
    //return sphere
}
function cool_effect() {
    let vertices: Renderer.Vertice[] = []
    let edges: Renderer.Edge[] = []


    let stacks = 5
    let slices = 10
    let i = 0
    for (let t = 0; t < stacks; t++) {
        let theta1 = t / stacks * Math.PI
        let theta2 = (t + 1) / stacks * Math.PI

        for (let p = 0; p < slices; p++) {
            let phi1 = p / slices * 2 * Math.PI
            let phi2 = (p + 1) / slices * 2 * Math.PI

            let r = Math.random()
            vertices.push([r*Math.cos(phi1)*Math.sin(theta1), r*Math.sin(phi1)*Math.sin(theta1), r*Math.cos(theta1)])
            vertices.push([r*Math.cos(phi2)*Math.sin(theta1), r*Math.sin(phi2)*Math.sin(theta1), r*Math.cos(theta1)])
            vertices.push([r*Math.cos(phi2)*Math.sin(theta2), r*Math.sin(phi2)*Math.sin(theta2), r*Math.cos(theta2)])
            vertices.push([r*Math.cos(phi1)*Math.sin(theta2), r*Math.sin(phi1)*Math.sin(theta2), r*Math.cos(theta2)])

            let v1 = i * 4 + 0
            let v2 = i * 4 + 1
            let v3 = i * 4 + 2
            let v4 = i * 4 + 3

            if (t == 0) {
                edges.push([v1,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v3,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v4,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            else if (t + 1 == stacks) {
                edges.push([v3,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v1,v2, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v2,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            else {
                edges.push([v1,v2, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v2,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v4,v1, [255, 0, 0, 0], [255, 0, 0, 0]])

                edges.push([v2,v3, [255, 0, 0, 0], [255, 0, 0, 0]])
                edges.push([v3,v4, [255, 0, 0, 0], [255, 0, 0, 0]])
                //edges.push([v3,v1, [255, 0, 0, 0], [255, 0, 0, 0]])
            }
            i++
        }
    }
    cube.vertices = vertices
    cube.edges = edges
}
function generate_sphere(r = 1) {
    let vertices: Renderer.Vertice[] = []
    let edges: Renderer.Edge[] = []


    let stacks = 10
    let slices = 15

    //let top: Renderer.Vertice = [Math.cos(0)*Math.sin(0), Math.sin(0)*Math.sin(0), Math.cos(0)]
    //let top: Renderer.Vertice = [0, 0, 1]
    vertices.push([0, 0, 1])

    //let middle: Renderer.Vertice[] = []
    for (let t = 1; t < stacks; t++) {
        let theta = t / stacks * Math.PI
        for (let p = 0; p < slices; p++) {
            let phi = p / slices * 2 * Math.PI
            vertices.push([r*Math.cos(phi)*Math.sin(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(theta)])
        }
    }

    //let botton: Renderer.Vertice = [Math.cos(2*Math.PI)*Math.sin(Math.PI), Math.sin(2*Math.PI)*Math.sin(Math.PI), Math.cos(Math.PI)]
    //let botton: Renderer.Vertice = [0, 0, -1]
    vertices.push([0, 0, -1])

    // top edges
    for (let i = 1; i < slices; i++) {
        edges.push([0, i, RED, RED])
    }
    for (let i = 0; i < stacks - 2; i++) {
        let j = 0
        for (; j < slices - 1; j++) {
            // +1 because vertices[0] is top
            edges.push([i*slices + j + 1, i*slices + (j + 1) + 1, RED, RED])
            edges.push([i*slices + j + 1, (i+1)*slices + j + 1, RED, RED])
            edges.push([i*slices + j + 1, (i+1)*slices + (j + 1) + 1, RED, RED])
        }
        edges.push([i*slices + j + 1, i*slices + 0 + 1, RED, RED])
        edges.push([i*slices + j + 1, (i+1)*slices + j + 1, RED, RED])
        edges.push([i*slices + j + 1, (i+1)*slices + 0 + 1, RED, RED])

    }
    for (let i = 0; i < slices - 1; i++) {
        edges.push([(stacks - 2)*slices + i + 1, (stacks - 2)*slices + (i + 1) + 1, RED, RED])
        edges.push([(stacks - 2)*slices + i + 1, vertices.length - 1, RED, RED])
    }
    edges.push([(stacks - 2)*slices + (slices - 1) + 1, (stacks - 2)*slices + (0 + 1) + 1, RED, RED])
    edges.push([(stacks - 2)*slices + (slices - 1) + 1, vertices.length - 1, RED, RED])


    cube.vertices = vertices
    cube.edges = edges
}


function mode_4() {
    let vertices: Renderer.Vertice[] = []
    let edges: Renderer.Edge[] = []


    let stacks = Math.round(Math.random()*10 + 5)
    let slices = Math.round(Math.random()*10 + 5)

    //let top: Renderer.Vertice = [Math.cos(0)*Math.sin(0), Math.sin(0)*Math.sin(0), Math.cos(0)]
    //let top: Renderer.Vertice = [0, 0, 1]
    vertices.push([0, 0, (1 - Math.random()%0.5)*1])

    //let middle: Renderer.Vertice[] = []
    for (let t = 1; t < stacks; t++) {
        let theta = t / stacks * Math.PI
            //let r = 1
            //let r = (Math.random()*t*t - Math.random() * t + Math.random())%1
            let r = Math.random() * 0.5 + 0.5
        for (let p = 0; p < slices; p++) {
            let phi = p / slices * 2 * Math.PI
            //r = Math.abs(Math.random()*r*r + Math.random()*r + Math.random())%1
            //r = r - Math.random()%0.5
            //r = r - (Math.random()*phi*phi - Math.random()*phi + Math.random())%0.5
            r = r - Math.random() * 0.5 + 0.35
            //vertices.push([Math.cos(phi)*Math.sin(theta), Math.sin(phi)*Math.sin(theta), Math.cos(theta)])
            vertices.push([r*Math.cos(phi)*Math.sin(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(theta)])
        }
    }

    //let botton: Renderer.Vertice = [Math.cos(2*Math.PI)*Math.sin(Math.PI), Math.sin(2*Math.PI)*Math.sin(Math.PI), Math.cos(Math.PI)]
    //let botton: Renderer.Vertice = [0, 0, -1]
    vertices.push([0, 0, (Math.random()%0.5)*-1])

    // top edges
    for (let i = 1; i < slices; i++) {
        edges.push([0, i, RED, RED])
    }
    for (let i = 0; i < stacks - 2; i++) {
        let j = 0
        for (; j < slices - 1; j++) {
            // +1 because vertices[0] is top
            edges.push([i*slices + j + 1, i*slices + (j + 1) + 1, RED, RED])
            edges.push([i*slices + j + 1, (i+1)*slices + j + 1, RED, RED])
            edges.push([i*slices + j + 1, (i+1)*slices + (j + 1) + 1, RED, RED])
        }
        edges.push([i*slices + j + 1, i*slices + 0 + 1, RED, RED])
        edges.push([i*slices + j + 1, (i+1)*slices + j + 1, RED, RED])
        edges.push([i*slices + j + 1, (i+1)*slices + 0 + 1, RED, RED])

    }
    for (let i = 0; i < slices - 1; i++) {
        edges.push([(stacks - 2)*slices + i + 1, (stacks - 2)*slices + (i + 1) + 1, RED, RED])
        edges.push([(stacks - 2)*slices + i + 1, vertices.length - 1, RED, RED])
    }
    edges.push([(stacks - 2)*slices + (slices - 1) + 1, (stacks - 2)*slices + (0 + 1) + 1, RED, RED])
    edges.push([(stacks - 2)*slices + (slices - 1) + 1, vertices.length - 1, RED, RED])


    cube.vertices = vertices
    cube.edges = edges
}

let last = 1
let text = '(Cube Control)'
let mode_on_page = document.getElementById('mode')
let cube_copy: Renderer.Mesh = {...cube}
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
    else if (Keys.input['mode_4']) {
        generate_sphere()
    }
    else if (Keys.input['mode_5']) {
        cool_effect()
    }
    else if (Keys.input['mode_6']) {
        cube = {...cube_copy}
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
        case 4:
            mode_4()
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
