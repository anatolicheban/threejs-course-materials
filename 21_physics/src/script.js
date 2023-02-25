import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObj = {
  createSphere() {
    createSphere(Math.random() * 0.5,
      {
        x: (Math.random() - .5) * 3,
        y: 1 + (Math.random() - .5) * 3,
        z: (Math.random() - .5) * 3
      })
  },
  createBox() {
    createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5,
      {
        x: (Math.random() - .5) * 3,
        y: 1 + (Math.random() - .5) * 3,
        z: (Math.random() - .5) * 3
      })
  },
  reset() {
    objectsToUpdate.forEach(el => {
      el.body.removeEventListener('collide', playHitSound)
      world.remove(el.body)
      scene.remove(el.mesh)
    })
    objectsToUpdate.splice(0, objectsToUpdate.length)
  }
}

gui.add(debugObj, 'createSphere')
gui.add(debugObj, 'createBox')
gui.add(debugObj, 'reset').name('Reset')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
var scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

const hitSound = new Audio('/sounds/hit.mp3')

function playHitSound(collision) {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

//ZA WARUDO
var world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.allowSleep = true
world.broadphase = new CANNON.SAPBroadphase(world)

const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: .1,
  restitution: .7
})

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// const sphereShape = new CANNON.Sphere(.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)
floorBody.addShape(floorShape)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

var objectsToUpdate = []
const sphereGeometry = new SphereGeometry(1, 20, 20)
const sphereMaterial = new MeshStandardMaterial({
  metalness: 0.3, roughness: .4, envMap: environmentMapTexture
})
function createSphere(radius, position) {
  const mesh = new Mesh(sphereGeometry, sphereMaterial)
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  //Cannon bidy
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objectsToUpdate.push({ mesh, body })
}

const boxGeometry = new BoxGeometry(1, 1, 1)
const boxMaterial = new MeshStandardMaterial({
  metalness: 0.3, roughness: .4, envMap: environmentMapTexture
})

function createBox(width, height, depth, position) {
  const mesh = new Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(width, height, depth)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  //Cannon bidy
  const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objectsToUpdate.push({ mesh, body })
}
/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime
  // sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position)

  //Update physics
  world.step(1 / 60, deltaTime, 3)

  // sphere.position.copy(sphereBody.position)
  objectsToUpdate.forEach(elem => {
    elem.mesh.position.copy(elem.body.position)
    elem.mesh.quaternion.copy(elem.body.quaternion)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()