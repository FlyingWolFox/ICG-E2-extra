import * as THREE from 'three'
import * as Transform from './transformations'

type Coord = [number, number, number]

export interface Camera {
    pos: Coord,
    up: Coord,
    look_at: Coord,
    near_plane: number,
    far_plane: number,
    vertical_fov: number,
    horizontal_fov: number
}
export class Camera {
    pos: Coord
    up: Coord
    look_at: Coord
    near_plane: number
    far_plane: number
    vertical_fov: number
    horizontal_fov: number

    constructor(pos: Coord,
                up: Coord = [0, 1, 0],
                look_at: Coord = [0, 0, 0],
                near_plane = -1,
                far_plane = 1,
                vertical_fov = 90,
                horizontal_fov = 90) {
        this.pos = pos
        this.up = up
        this.look_at = look_at
        this.near_plane = near_plane
        this.far_plane = far_plane
        this.vertical_fov = vertical_fov
        this.horizontal_fov = horizontal_fov
    }
}

export function clone_cam(cam: Camera): Camera {
    return {pos: cam.pos,
            up: cam.up,
            look_at: cam.look_at,
            near_plane: cam.near_plane,
            far_plane: cam.far_plane,
            vertical_fov: cam.vertical_fov,
            horizontal_fov: cam.horizontal_fov}
}

export function rotate_horizontal(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_y(util_matrix, degrees)
    let new_cam = clone_cam(cam)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)
    direction.applyMatrix4(util_matrix)
    look_at.addVectors(direction, pos)

    new_cam.look_at = look_at.toArray()
    return new_cam
}

export function rotate_vertical(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, degrees)
    let new_cam = clone_cam(cam)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)
    direction.applyMatrix4(util_matrix)
    look_at.addVectors(direction, pos)

    new_cam.look_at = look_at.toArray()
    return new_cam
}

export function rotate_clockwise(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_z(util_matrix, degrees)
    let new_cam = clone_cam(cam)
    new_cam.up = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

export function translate_locked(cam: Camera, by: [number, number, number]) {
    let new_cam = clone_cam(cam)
    new_cam.pos[0] += by[0]
    new_cam.pos[1] += by[1]
    new_cam.pos[2] += by[2]
    return new_cam
}

export function translate(cam: Camera, by: [number, number, number]) {
    let new_cam = clone_cam(cam)
    new_cam.pos[0] += by[0]
    new_cam.pos[1] += by[1]
    new_cam.pos[2] += by[2]
    new_cam.look_at[0] += by[0]
    new_cam.look_at[1] += by[1]
    new_cam.look_at[2] += by[2]
    return new_cam
}

export function look_straight(cam: Camera) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, 90)
    let new_cam = clone_cam(cam)
    new_cam.look_at = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

export function move(cam: Camera, by: Coord) {
    let new_cam = clone_cam(cam)

    let up = new THREE.Vector3().fromArray(cam.up)
    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let z = new THREE.Vector3().subVectors(pos, look_at).normalize()
    let x = new THREE.Vector3().crossVectors(up, z).normalize()
    let y = new THREE.Vector3().crossVectors(z, x).normalize()

    let m_b = new THREE.Matrix4()
    m_b.elements = [...x.toArray(), 0,
                    ...y.toArray(), 0,
                    ...z.toArray(), 0,
                    0, 0, 0, 1]
    let m_bt = m_b.clone().transpose()

    let m_t = new THREE.Matrix4()
    m_t.elements[12] = pos.x
    m_t.elements[13] = pos.y
    m_t.elements[14] = pos.z

    let move = new THREE.Matrix4()
    move.elements[12] = by[0]
    move.elements[13] = by[1]
    move.elements[14] = by[2]
    
    pos.fromArray(by)
    z = pos.clone()
    z.z += 1

    let util_matrix = new THREE.Matrix4().multiply(m_t).multiply(m_b)

    pos.applyMatrix4(util_matrix)
    z.applyMatrix4(util_matrix)


    look_at.subVectors(pos, z)

    new_cam.look_at = look_at.toArray()
    //new_cam.look_at = direction.toArray()
    new_cam.pos = pos.toArray()

    return new_cam
}
