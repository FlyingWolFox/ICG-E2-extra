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

export function rotate_x(cam: Camera, degrees = 0) {
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

export function rotate_y(cam: Camera, degrees = 0) {
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

export function rotate_z(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_z(util_matrix, degrees)
    let new_cam = clone_cam(cam)
    new_cam.up = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return new_cam
}

export function translate_orbit(cam: Camera, by: [number, number, number]) {
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

    let move_vec = new THREE.Vector3()
    move_vec.add(x.multiplyScalar(by[0]))
    move_vec.add(y.multiplyScalar(by[1]))
    move_vec.add(z.multiplyScalar(by[2]))

    pos.add(move_vec)
    look_at.add(move_vec)

    new_cam.pos = pos.toArray()
    new_cam.look_at = look_at.toArray()

    return new_cam
}

let cam_b = {
    x: new THREE.Vector3(),
    y: new THREE.Vector3(),
    z: new THREE.Vector3,
    inited: false
}
export function rotate_horizontal(cam: Camera, degrees = 0) {
    let new_cam = clone_cam(cam)

    let up = new THREE.Vector3().fromArray(cam.up)
    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)

    if (!cam_b.inited) {
        let z = new THREE.Vector3().subVectors(pos, look_at).normalize()
        let x = new THREE.Vector3().crossVectors(up, z).normalize()
        let y = new THREE.Vector3().crossVectors(z, x).normalize()
        cam_b.x = x
        cam_b.y = y
        cam_b.z = z
        cam_b.inited = true;
    }
    let z = new THREE.Vector3().subVectors(pos, look_at).normalize()
    let x = new THREE.Vector3().crossVectors(cam_b.y, z).normalize()
    let y = cam_b.y
    cam_b.z = z
    cam_b.x = x
    
    /*
    *******************************************
    // direction is always perpendicular to x component!
    // the angle of the direction is alwais 90º!
    // doing the calculations will result in errors because
    // of floating point precision (or better, the loss of it)
    *******************************************
    let direction_cos = direction.normalize().dot(x)
    let direction_angle = Math.acos(direction_cos)
    let direction_sin = Math.sin(direction_angle)
    */
    const direction_cos = 0
    const direction_sin = 1
    let new_angle = (90 + degrees) * (Math.PI/180)

    let pseudo_x = direction.length() * (Math.cos(new_angle) - direction_cos)
    let pseudo_z = direction.length() * (Math.sin(new_angle) - direction_sin)

    let move_vec = new THREE.Vector3()
    move_vec.add(x.clone().multiplyScalar(pseudo_x))
    move_vec.add(z.clone().negate().multiplyScalar(pseudo_z))

    direction.add(move_vec).normalize()
    look_at.addVectors(direction, pos)
    new_cam.look_at = look_at.toArray()

    return new_cam
}

export function rotate_vertical(cam: Camera, degrees = 0) {
    let new_cam = clone_cam(cam)

    let up = new THREE.Vector3().fromArray(cam.up)
    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)

    let z = new THREE.Vector3().subVectors(pos, look_at).normalize()
    let x = new THREE.Vector3().crossVectors(up, z).normalize()
    let y = new THREE.Vector3().crossVectors(z, x).normalize()
    
    let direction_cos = direction.dot(x)
    let direction_angle = Math.acos(direction_cos)
    let direction_sin = Math.sin(direction_angle)
    let new_angle = direction_angle + degrees * (Math.PI/180)

    let pseudo_y = new THREE.Vector3()
    let pseudo_z = new THREE.Vector3()
    pseudo_y.y = direction.length() * (Math.cos(new_angle) - direction_cos)
    pseudo_z.z = direction.length() * (Math.sin(new_angle) - direction_sin)

    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, Math.acos(direction.dot(x)))

    let real_y = new THREE.Vector3()
    real_y.add(x.clone().multiplyScalar(pseudo_y.x))
    real_y.add(y.clone().multiplyScalar(pseudo_y.y))
    real_y.add(z.clone().negate().multiplyScalar(pseudo_y.z))
    let real_z = new THREE.Vector3()
    real_z.add(x.clone().multiplyScalar(pseudo_z.x))
    real_z.add(y.clone().multiplyScalar(pseudo_z.y))
    real_z.add(z.clone().negate().multiplyScalar(pseudo_z.z))

    direction.add(real_y).add(real_z).normalize()
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
