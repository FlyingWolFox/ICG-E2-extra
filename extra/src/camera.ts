import * as THREE from 'three'
import * as Transform from './transformations'

type Coord = [number, number, number]

export interface Camera {
    pos: Coord,
    up: Coord,
    look_at: Coord,
    focal_point: number
}
export class Camera {
    pos: Coord
    up: Coord
    look_at: Coord
    focal_point: number

    constructor(pos: Coord, up: Coord = [0, 1, 0], direction: Coord = [0, 0, 0], focal_point = 1) {
        this.pos = pos
        this.up = up
        this.look_at = direction
        this.focal_point = focal_point
    }
}

function clone_cam(cam: Camera): Camera {
    return {pos: cam.pos,
            up: cam.up,
            look_at: cam.look_at,
            focal_point: cam.focal_point}
}

function rotate_horizontal(cam: Camera, degrees: 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_y(util_matrix, degrees)
    let new_cam = clone_cam(cam)
    new_cam.look_at = new THREE.Vector3().fromArray(cam.look_at)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

function rotate_vertical(cam: Camera, degrees: 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, degrees)
    let new_cam = clone_cam(cam)
    new_cam.look_at = new THREE.Vector3().fromArray(cam.look_at)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

function rotate_clockwise(cam: Camera, degrees: 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_z(util_matrix, degrees)
    let new_cam = clone_cam(cam)
    new_cam.up = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

function translate(cam: Camera, by: [number, number, number]) {
    let new_cam = clone_cam(cam)
    new_cam.look_at[0] += by[0]
    new_cam.look_at[1] += by[1]
    new_cam.look_at[2] += by[2]
    return new_cam
}

function look_straight(cam: Camera) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, 90)
    let new_cam = clone_cam(cam)
    new_cam.look_at = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}
