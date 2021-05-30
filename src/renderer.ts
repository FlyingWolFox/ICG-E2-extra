import * as Canvas from './canvas'
import * as Line from './line'
import * as THREE from 'three'
import { Camera } from './camera'
import { Transformation } from './transformations'

export type Vertice = [number, number, number]
export type Edge = [number, number, Canvas.Color, Canvas.Color]
export import Screen = Canvas.Canvas
import { Matrix3 } from 'three'

export interface Mesh {
        vertices: Vertice[]
        edges: Edge[]
        transform: Transformation
}

export class Mesh {
        vertices: Vertice[]
        edges: Edge[]
        transform: Transformation

        constructor(vertices: Vertice[] = [], edges: Edge[] = [], tranform: Transformation = new Transformation()) {
                this.vertices = vertices
                this.edges = edges
                this.transform = tranform
        }
}

var callback : () => any

function newFrame() {
        callback()
        window.requestAnimationFrame(newFrame);
}


export function requestAnimationFrame(fun: () => any) {
        callback = fun
        window.requestAnimationFrame(newFrame);
}

export function render(cam: Camera, screen: Screen, meshs: Mesh[] = []) {
        screen.clear()

        let vertices: THREE.Vector4[] = []
        let edges: Edge[] = []

        // input processing and modelling

        for (let i = 0; i < meshs.length; i++) {
                // get where to start applying the current model matrix
                let vertice_start = vertices.length

                // process mesh vertices 
                for (let j = 0; j < meshs[i].vertices.length; j++) {
                        let vertice = new THREE.Vector4()
                        vertice.x = meshs[i].vertices[j][0]
                        vertice.y = meshs[i].vertices[j][1]
                        vertice.z = meshs[i].vertices[j][2]
                        vertices.push(vertice)
                }

                // process edges
                for (let j = 0; j < meshs[i].edges.length; j++) {
                        let edge: Edge = [meshs[i].edges[j][0] + vertice_start,
                                          meshs[i].edges[j][1] + vertice_start,
                                          meshs[i].edges[j][2],
                                          meshs[i].edges[j][3]]
                        edges.push(edge)
                }

                for (let j = vertice_start; j < vertices.length; j++)
                        vertices[j].applyMatrix4(meshs[i].transform)

        }

        let pipeline: THREE.Matrix4[] = []

        // viewing

        // get the cam vectors
        let cam_pos = new THREE.Vector3().fromArray(cam.pos)     
        let cam_look_at = new THREE.Vector3().fromArray(cam.look_at) 
        let cam_up = new THREE.Vector3().fromArray(cam.up)      

        // there's no invertion hrere because the subtraction is inverted, already yelding the negative value
        let cam_z = new THREE.Vector3().subVectors(cam_pos, cam_look_at).normalize();
        let cam_x = new THREE.Vector3().crossVectors(cam_up, cam_z).normalize();
        // normalize is not needed, but is here for conformity
        let cam_y = new THREE.Vector3().crossVectors(cam_z, cam_x).normalize();

        let cam_basis = new THREE.Matrix4();
        cam_basis.elements = [...cam_x.toArray(), 0,
                              ...cam_y.toArray(), 0,
                              ...cam_z.toArray(), 0,
                              0, 0, 0, 1]

        let m_bt = cam_basis.clone().transpose();

        // same thing of line ##: the cam_displacement is already inverted, no need for minus signs on the matrix
        let cam_displacement = new THREE.Vector3().subVectors(new THREE.Vector3(), cam_pos);
        let m_t = new THREE.Matrix4();
        m_t.set(1, 0, 0, cam_displacement.x,
                0, 1, 0, cam_displacement.y,
                0, 0, 1, cam_displacement.z,
                0, 0, 0, 1)

        pipeline.push(m_t) // push the translation that might be necessary if the camera isn't on the origin
        pipeline.push(m_bt) // put the change of basis matrix on the pipeline

        // clipping

        let m_projection = new THREE.Matrix4();

        /*
        let d = cam.near_plane;
        m_projection.set(1.0, 0.0,  0.0, 0.0,
                         0.0, 1.0,  0.0, 0.0,
                         0.0, 0.0,  1.0,   d,
                         0.0, 0.0, -1/d, 0.0);
        pipeline.push(m_projection)
        */

        let n = cam.near_plane
        let f = cam.far_plane
        let t = Math.tan(cam.vertical_fov*Math.PI/180 / 2)
        let r = Math.tan(cam.horizontal_fov*Math.PI/180 / 2)
        let b = -t
        let l = -r
        m_projection.set(2*n/(r-l),       0.0,  (l+r)/(l-r),           0.0,
                               0.0, 2*n/(t-b),  (b+t)/(b-t),           0.0,
                               0.0,       0.0,  (f+n)/(n-f),   2*f*n/(f-n),
                               0.0,       0.0,            1,           0.0);
        pipeline.push(m_projection)


        // apply the pipeline before homogenization                 
        let pipeline_matrix = new THREE.Matrix4()
        for (let i = pipeline.length - 1; i >= 0; i--)
                pipeline_matrix.multiply(pipeline[i])
        pipeline.length = 0 // clears the pipeline
        for (let i = 0; i < vertices.length; i++)
                vertices[i].applyMatrix4(pipeline_matrix)


        // homogenization 
        for (let i = 0; i < vertices.length; i++)
                vertices[i].divideScalar(vertices[i].w)                

        // viewport transformation
        
        let view_translation = new THREE.Matrix4();
        view_translation.set(1, 0, 0, 1,
                             0, 1, 0, 1,
                             0, 0, 1, 0,
                             0, 0, 0, 1)

        let view_scale = new THREE.Matrix4();
        let res = screen.canvas.width/screen.scale
        view_scale.set((res-1)/2,         0, 0, 0,
                               0, (res-1)/2, 0, 0,
                               0,         0, 1, 0,
                               0,         0, 0, 1);

        let m_viewport = view_scale.clone().multiply(view_translation);


        for (let i = 0; i < vertices.length; ++i)
            vertices[i].applyMatrix4(m_viewport);

        // rasterize

        for (let i = 0; i < edges.length; i++)
        {
            let edge = edges[i];
            let v1 = vertices[edge[0]];
            let v2 = vertices[edge[1]];
            v1.round()
            v2.round()
            Line.MidPointLineAlgorithm(screen,
                                       v1.x, v1.y,
                                       v2.x, v2.y,
                                       edge[2], edge[3]);
        }
}

/******************************************************************************
 * Rasterização
 *****************************************************************************/

