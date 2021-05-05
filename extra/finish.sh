#!/bin/bash

sed -i "s/import \* as THREE from 'three';/import * as THREE from 'https:\/\/cdn.skypack.dev\/three@0.128.0';/" js/renderer.js
sed -i "s/import \* as THREE from 'three';/import * as THREE from 'https:\/\/cdn.skypack.dev\/three@0.128.0';/" js/transformations.js
sed -i "s/import \* as THREE from 'three';/import * as THREE from 'https:\/\/cdn.skypack.dev\/three@0.128.0';/" js/camera.js
sed -i "s/import { Canvas } from '\.\/canvas';/import { Canvas } from '.\/canvas.js';/" js/rendere.js
sed -i "s/import { Canvas } from '\.\/canvas';/import { Canvas } from '.\/canvas.js';/" js/line.js
sed -i "s/import { Camera } from '\.\/camera';/import { Camera } from '.\/camera.js';/" js/renderer.js
sed -i "s/import { Transformation } from '\.\/transformations';/import { Transformation } from '.\/transformations.js';/" js/renderer.js
sed -i "s/import \* as Line from '\.\/line';/import * as Line from '.\/line.js';/" js/index.js
echo "Done!"
