#!/bin/bash

sed -i "s/'three'/'https:\/\/cdn.skypack.dev\/three@0.128.0'/" js/renderer.js
sed -i "s/'three'/'https:\/\/cdn.skypack.dev\/three@0.128.0'/" js/transformations.js
sed -i "s/'three'/'https:\/\/cdn.skypack.dev\/three@0.128.0'/" js/camera.js
sed -i "s/'\.\/canvas'/'.\/canvas.js'/" js/renderer.js
sed -i "s/'\.\/canvas'/'.\/canvas.js'/" js/line.js
sed -i "s/'\.\/camera'/'.\/camera.js'/" js/renderer.js
sed -i "s/'\.\/camera'/'.\/camera.js'/" js/index.js
sed -i "s/'\.\/transformations'/'.\/transformations.js'/" js/camera.js
sed -i "s/'\.\/transformations'/'.\/transformations.js'/" js/renderer.js
sed -i "s/'\.\/transformations'/'.\/transformations.js'/" js/index.js
sed -i "s/'\.\/line'/'.\/line.js'/" js/renderer.js
sed -i "s/'\.\/renderer'/'.\/renderer.js'/" js/index.js
sed -i "s/'\.\/input'/'.\/input.js'/" js/index.js
echo "Done!"
