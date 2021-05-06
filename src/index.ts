import { Canvas } from './canvas'
import * as Line from './line'
import * as THREE from 'three'

// Cria um color buffer para armazenar a imagem final.
let color_buffer = new Canvas("canvas", 4);
color_buffer.clear();

/******************************************************************************
 * Vértices do modelo (cubo) centralizado no seu espaco do objeto. Os dois
 * vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do cubo
 * tem comprimento igual a 2. 
 *****************************************************************************/
//                                   X     Y     Z    W (coord. homogênea)
let vertices = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0,  1.0, 1.0)];

/******************************************************************************
 * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
 *****************************************************************************/
let edges = [[0,1],
             [1,2],
             [2,3],
             [3,0],
             [4,5],
             [5,6],
             [6,7],
             [7,4],
             [0,4],
             [1,5],
             [2,6],
             [3,7]];

/******************************************************************************
 * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
 * OBS: A matriz está carregada inicialmente com a identidade.
 *****************************************************************************/
let m_model = new THREE.Matrix4();

m_model.set(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

for (let i = 0; i < 8; ++i)
        vertices[i].applyMatrix4(m_model);

/******************************************************************************
 * Parâmetros da camera sintética.
 *****************************************************************************/
let cam_pos = new THREE.Vector3(1.3,1.7,2.0);     // posição da câmera no esp. do Universo.
//let cam_pos = new THREE.Vector3(0.0,0.0,2.0);     // posição da câmera no esp. do Universo.
let cam_look_at = new THREE.Vector3(0.0,0.0,0.0); // ponto para o qual a câmera aponta.
let cam_up = new THREE.Vector3(0.0,1.0,0.0);      // vetor Up da câmera.

/******************************************************************************
 * Matriz View (visualização): Esp. Universo --> Esp. Câmera
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

    // Derivar os vetores da base da câmera a partir dos parâmetros informados acima.

    // ---------- implementar aqui ----------------------------------------------

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

    // Construir 'm_bt', a inversa da matriz de base da câmera.

    let m_bt = cam_basis.clone().transpose();

    // Construir a matriz 'm_t' de translação para tratar os casos em que as
    // origens do espaço do universo e da câmera não coincidem.

    // same thing of line 86: the cam_displacement is already inverted, no need for minus signs on the matrix
    let cam_displacement = new THREE.Vector3().subVectors(new THREE.Vector3(), cam_pos);
    let m_t = new THREE.Matrix4();
    m_t.set(1, 0, 0, cam_displacement.x,
            0, 1, 0, cam_displacement.y,
            0, 0, 1, cam_displacement.z,
            0, 0, 0, 1)

    // Constrói a matriz de visualização 'm_view' como o produto
    //  de 'm_bt' e 'm_t'.
    let m_view = m_bt.clone().multiply(m_t);

    for (let i = 0; i < 8; ++i)
            vertices[i].applyMatrix4(m_view);

/******************************************************************************
 * Matriz de Projecao: Esp. Câmera --> Esp. Recorte
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

    // ---------- implementar aqui ----------------------------------------------
    let m_projection = new THREE.Matrix4();

    let d = 1;
    m_projection.set(1.0, 0.0,  0.0, 0.0,
                     0.0, 1.0,  0.0, 0.0,
                     0.0, 0.0,  1.0,   d,
                     0.0, 0.0, -1/d, 0.0);

    for (let i = 0; i < 8; ++i)
        vertices[i].applyMatrix4(m_projection);

/******************************************************************************
 * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
 *****************************************************************************/

    for (let i = 0; i < 8; i++)
        vertices[i].divideScalar(vertices[i].w);

/******************************************************************************
 * Matriz Viewport: Esp. Canônico --> Esp. Tela
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

    // ---------- implementar aqui ----------------------------------------------
    let view_translation = new THREE.Matrix4();
    view_translation.set(1, 0, 0, 1,
                         0, 1, 0, 1,
                         0, 0, 1, 0,
                         0, 0, 0, 1)

    let view_scale = new THREE.Matrix4();
    view_scale.set(127/2,     0, 0, 0,
                       0, 127/2, 0, 0,
                       0,     0, 1, 0,
                       0,     0, 0, 1);

    let m_viewport = view_scale.clone().multiply(view_translation);


    for (let i = 0; i < 8; ++i)
        vertices[i].applyMatrix4(m_viewport);

/******************************************************************************
 * Rasterização
 *****************************************************************************/

    // ---------- implementar aqui ----------------------------------------------

    //color_buffer.putPixel(vertices[6].x, vertices[6].y, [255,0,0,0]); 
    for (let i = 0; i < edges.length; i++)
    {
        let edge = edges[i];
        let v1 = vertices[edge[0]];
        let v2 = vertices[edge[1]];
        v1.round()
        v2.round()
        Line.MidPointLineAlgorithm(color_buffer,
                                   v1.x, v1.y,
                                   v2.x, v2.y,
                                   [255, 0, 0, 0], [255, 0, 0, 0]);
    }
