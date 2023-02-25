import * as THREE from 'three'

console.log(THREE);

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0033 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const sizes = {
  w: 800,
  h: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h)
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('webgl')
})

renderer.setSize(sizes.w, sizes.h)

renderer.render(scene, camera)