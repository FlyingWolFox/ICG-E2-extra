import * as THREE from 'three'
import * as Transform from './transformations'

type Coord = [number, number, number]
export class Camera {
    // rendering basics
    near_plane: number
    far_plane: number
    vertical_fov: number
    horizontal_fov: number
    // rendering basis
    pos: Coord
    up: Coord
    look_at: Coord

    // space basis
    x: THREE.Vector3
    y: THREE.Vector3
    z: THREE.Vector3

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
        //change_look_at(this, look_at)
        let up_vec = new THREE.Vector3().fromArray(up)
        let look_at_vec = new THREE.Vector3().fromArray(look_at)
        let pos_vec = new THREE.Vector3().fromArray(pos)

        let z = new THREE.Vector3().subVectors(pos_vec, look_at_vec).normalize()
        let x = new THREE.Vector3().crossVectors(up_vec, z).normalize()
        let y = new THREE.Vector3().crossVectors(z, x).normalize()

        this.z = z
        this.x = x
        this.y = y
    }
}

export function clone_cam(cam: Camera): Camera {
    return {...cam}
}

// if just cam is passed, updates the camera basis
export function change_rendering_basis(cam: Camera,
                                       look_at: Coord = cam.look_at,
                                       pos: Coord = cam.pos,
                                       up: Coord = cam.up) {
    let up_vec = new THREE.Vector3().fromArray(up)
    let look_at_vec = new THREE.Vector3().fromArray(look_at)
    let pos_vec = new THREE.Vector3().fromArray(pos)

    let z = new THREE.Vector3().subVectors(pos_vec, look_at_vec).normalize()
    let x = new THREE.Vector3().crossVectors(up_vec, z).normalize()
    let y = new THREE.Vector3().crossVectors(z, x).normalize()

    let new_cam = clone_cam(cam)
    new_cam.look_at = look_at
    new_cam.pos = pos
    new_cam.up = up
    new_cam.z = z
    new_cam.x = x
    new_cam.y = y
    return new_cam
}

function change_basis(cam: Camera, x: THREE.Vector3, y: THREE.Vector3, z: THREE.Vector3) {
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = z.clone().negate()
    let look_at = new THREE.Vector3().addVectors(direction, pos)

    let new_cam = clone_cam(cam)
    new_cam.look_at = look_at.toArray()
    new_cam.z = z
    new_cam.x = x
    new_cam.y = y
    return new_cam
}

export function rotate_x(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_y(util_matrix, degrees)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)
    direction.applyMatrix4(util_matrix)
    look_at.addVectors(direction, pos)

    return change_rendering_basis(cam, look_at.toArray())
}

export function rotate_y(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, degrees)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let direction = new THREE.Vector3().subVectors(look_at, pos)
    direction.applyMatrix4(util_matrix)
    look_at.addVectors(direction, pos)

    return change_rendering_basis(cam, look_at.toArray())
}

export function rotate_z(cam: Camera, degrees = 0) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_z(util_matrix, degrees)

    let up = new THREE.Vector3().fromArray(cam.up)
    up.applyMatrix4(util_matrix).toArray()

    return change_rendering_basis(cam, cam.look_at, cam.pos, up.toArray())
}

export function translate(cam: Camera, by: [number, number, number]) {
    let new_pos = cam.pos
    new_pos[0] += by[0]
    new_pos[1] += by[1]
    new_pos[2] += by[2]
    let new_look_at = cam.look_at
    new_look_at[0] += by[0]
    new_look_at[1] += by[1]
    new_look_at[2] += by[2]
    return change_rendering_basis(cam, new_look_at, new_pos)
}

export function look_straight(cam: Camera) {
    let util_matrix = new THREE.Matrix4()
    util_matrix = Transform.rotate_x(util_matrix, 90)
    let look_at = new THREE.Vector3().fromArray(cam.up)
                        .applyMatrix4(util_matrix).toArray()
    return change_rendering_basis(cam, look_at)
}

export function move(cam: Camera, by: Coord) {
    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let z = cam.z.clone()
    let x = cam.x.clone()
    let y = cam.y.clone()

    let move_vec = new THREE.Vector3()
    move_vec.add(x.multiplyScalar(by[0]))
    move_vec.add(y.multiplyScalar(by[1]))
    move_vec.add(z.multiplyScalar(by[2]))

    pos.add(move_vec)
    look_at.add(move_vec)

    return change_rendering_basis(cam, look_at.toArray(), pos.toArray())
}

export function rotate_horizontal(cam: Camera, degrees = 0) {
    let new_cam = clone_cam(cam)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let z = cam.z
    let x = cam.x
    let y = cam.y
    let direction = z.clone().negate()
    
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

    /*
    let pseudo_x = direction.length() * (Math.cos(new_angle) - direction_cos)
    let pseudo_z = direction.length() * (Math.sin(new_angle) - direction_sin)
    */
    let pseudo_x = Math.cos(new_angle) - direction_cos
    let pseudo_z = Math.sin(new_angle) - direction_sin

    let move_vec = new THREE.Vector3()
    move_vec.add(x.clone().multiplyScalar(pseudo_x))
    move_vec.add(z.clone().negate().multiplyScalar(pseudo_z))

    direction.add(move_vec).normalize()
    look_at.addVectors(direction, pos)
    new_cam.look_at = look_at.toArray()

    return change_rendering_basis(new_cam, look_at.toArray())
}

export function rotate_vertical(cam: Camera, degrees = 0) {
    let new_cam = clone_cam(cam)

    let look_at = new THREE.Vector3().fromArray(cam.look_at)
    let pos = new THREE.Vector3().fromArray(cam.pos)
    let z = cam.z
    let x = cam.x
    let y = cam.y
    let direction = z.clone().negate()
    
    /*
    *******************************************
    // direction is always perpendicular to y component!
    // the angle of the direction is alwais 90º!
    // doing the calculations will result in errors because
    // of floating point precision (or better, the loss of it)
    *******************************************
    let direction_cos = direction.normalize().dot(y)
    let direction_angle = Math.acos(direction_cos)
    let direction_sin = Math.sin(direction_angle)
    */
    const direction_cos = 0
    const direction_sin = 1
    let new_angle = (90 + degrees) * (Math.PI/180)

    /*
    let pseudo_y = direction.length() * (Math.cos(new_angle) - direction_cos)
    let pseudo_z = direction.length() * (Math.sin(new_angle) - direction_sin)
    */
    let pseudo_y = Math.cos(new_angle) - direction_cos
    let pseudo_z = Math.sin(new_angle) - direction_sin

    let move_vec = new THREE.Vector3()
    move_vec.add(y.clone().multiplyScalar(pseudo_y))
    move_vec.add(z.clone().negate().multiplyScalar(pseudo_z))

    direction.add(move_vec).normalize()
    look_at.addVectors(direction, pos)
    new_cam.look_at = look_at.toArray()

    return change_rendering_basis(new_cam, look_at.toArray())
}

export function rotate_clockwise(cam: Camera, degrees = 0) {
    let new_cam = clone_cam(cam)

    let z = cam.z
    let x = cam.x
    let y = cam.y
    let up = new THREE.Vector3().fromArray(cam.up)
    
    /*
    *******************************************
    // up is always perpendicular to universal x component!
    // the angle of the up is alwais 90º!
    // doing the calculations will result in errors because
    // of floating point precision (or better, the loss of it)
    *******************************************
    let up_cos = up.normalize().dot(x)
    let up_angle = Math.acos(up_cos)
    let up_sin = Math.sin(up_angle)
    */
    const up_cos = 0
    const up_sin = 1
    let new_angle = (90 + degrees) * (Math.PI/180)

    /*
    let pseudo_x = up.length() * (Math.cos(new_angle) - up_cos)
    let pseudo_z = up.length() * (Math.sin(new_angle) - up_sin)
    */
    let pseudo_x = Math.cos(new_angle) - up_cos
    let pseudo_y = Math.sin(new_angle) - up_sin

    let move_vec = new THREE.Vector3()
    move_vec.add(new THREE.Vector3(1).multiplyScalar(pseudo_x))
    move_vec.add(new THREE.Vector3(0,1).multiplyScalar(pseudo_y))

    up.add(move_vec).normalize()

    return change_rendering_basis(new_cam, new_cam.look_at, new_cam.pos, up.toArray())
}
