import * as THREE from 'three'

// tridimensional coordinates
type Coord = [number, number, number]

// make an alias for THREE.Matrix4 and exports it
export import Transformation = THREE.Matrix4

// returns [cos(), sin(), -sin(), cos()]
function create_rotate_submatrix(degrees: number) {
    let subm: number[]
    degrees = degrees*(Math.PI/180)
    subm[0] = Math.cos(degrees)
    subm[1] = Math.sin(degrees)
    subm[2] = -Math.sin(degrees)
    subm[3] = subm[0]
    return subm
}

export function rotate_x(transform: Transformation, degrees: number) {
    let rotation = new THREE.Matrix4()
    degrees = degrees*(Math.PI/180)
    let subm = create_rotate_submatrix(degrees)
    rotation.elements[5] = subm[0]
    rotation.elements[6] = subm[1]
    rotation.elements[9] = subm[2]
    rotation.elements[10] = subm[3]

    return new THREE.Matrix4().multiplyMatrices(transform, rotation)
}

export function rotate_y(transform: Transformation, degrees: number) {
    let rotation = new THREE.Matrix4()
    degrees = degrees*(Math.PI/180)
    let subm = create_rotate_submatrix(degrees)
    rotation.elements[0] = subm[0]
    rotation.elements[8] = subm[1]
    rotation.elements[2] = subm[2]
    rotation.elements[10] = subm[3]

    return new THREE.Matrix4().multiplyMatrices(transform, rotation)
}

export function rotate_z(transform: Transformation, degrees: number) {
    let rotation = new THREE.Matrix4()
    degrees = degrees*(Math.PI/180)
    let subm = create_rotate_submatrix(degrees)
    rotation.elements[0] = subm[0]
    rotation.elements[1] = subm[1]
    rotation.elements[4] = subm[2]
    rotation.elements[5] = subm[3]

    return new THREE.Matrix4().multiplyMatrices(transform, rotation)
}

// scales the axis individually
export function scale(transform: Transformation, x=1, y=1, z=1): Transformation {
    let scale = new THREE.Matrix4()
    scale.elements[0] = x
    scale.elements[5] = y
    scale.elements[10] = z
    return new THREE.Matrix4().multiplyMatrices(scale, transform)
}

// scales by n times
export function scale_byfactor(transform: Transformation, factor=1): Transformation {
    return scale(transform, factor, factor, factor)
}

// move to a coordinate
export function move(transform: Transformation, to: Coord): Transformation {
    let new_transform = transform.clone()
    new_transform.elements[12] = to[0]
    new_transform.elements[13] = to[1]
    new_transform.elements[14] = to[2]
    return new_transform;
}

// move by an amount
export function translate(transform: Transformation, by: Coord): Transformation {
    let translate = new THREE.Matrix4()
    translate.elements[12] = by[0]
    translate.elements[13] = by[1]
    translate.elements[14] = by[2]
    return new THREE.Matrix4().multiplyMatrices(translate, transform)
}

export function shear_x(transform: Transformation, degrees_y=0, degrees_z=0): Transformation {
    let shear = new THREE.Matrix4()
    degrees_y = degrees_y*(Math.PI/180)
    degrees_z = degrees_z*(Math.PI/180)
    shear.elements[4] = Math.tan(degrees_y)
    shear.elements[8] = Math.tan(degrees_z)
    return new THREE.Matrix4().multiplyMatrices(shear, transform)
}

export function shear_y(transform: Transformation, degrees_x=0, degrees_z=0): Transformation {
    let shear = new THREE.Matrix4()
    degrees_x = degrees_x*(Math.PI/180)
    degrees_z = degrees_z*(Math.PI/180)
    shear.elements[1] = Math.tan(degrees_x)
    shear.elements[9] = Math.tan(degrees_z)
    return new THREE.Matrix4().multiplyMatrices(shear, transform)
}

export function shear_z(transform: Transformation, degrees_x=0, degrees_y=0): Transformation {
    let shear = new THREE.Matrix4()
    degrees_x = degrees_x*(Math.PI/180)
    degrees_y = degrees_y*(Math.PI/180)
    shear.elements[2] = Math.tan(degrees_x)
    shear.elements[6] = Math.tan(degrees_y)
    return new THREE.Matrix4().multiplyMatrices(shear, transform)
}
