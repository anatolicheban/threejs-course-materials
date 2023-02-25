import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)

cube2.position.x = -2
cube3.position.x = 2

group.add(cube1, cube2, cube3)

group.rotation.z = 1
group.position.y = 1

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

//Positioning
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1
// scene.add(mesh)
// mesh.position.normalize()
// mesh.position.set(.7, -.6, 1)

//Scale
// mesh.scale.z = 1

// mesh.scale.set(2, .5, 0.5)

//Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = .6
// mesh.rotation.z = 1

//Axes helper 
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)
/**
 * Sizes
*/
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.y = 1
// camera.position.x = 1
// camera.position.x = -1
scene.add(camera)
// camera.lookAt(mesh.position)
// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)