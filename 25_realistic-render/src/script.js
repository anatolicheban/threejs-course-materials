import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { CameraHelper, DirectionalLight } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}
debugObject.envMapIntensity = 1

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            console.log(child)
            // child.material.envMap = environmentMap
            child.castShadow = true
            child.material.needsUpdate = true
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.receiveShadow = true
        }
    })
}

/**
 * Loaders
*/
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.environment = environmentMap

scene.background = environmentMap
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onFinishChange(updateAllMaterials)

/**
 * Models
*/
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) => {
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        gltf.scene.position.set(0, - 1, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        scene.add(gltf.scene)
        updateAllMaterials()
    }
)

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

const dirLight = new DirectionalLight('#fff', 3)
dirLight.shadow.normalBias = 0.05
dirLight.castShadow = true
dirLight.shadow.camera.far = 15
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.position.set(0.25, 3, -2.25)
scene.add(dirLight)

// const dirLightCamHelper = new CameraHelper(dirLight.shadow.camera)
// scene.add(dirLightCamHelper)

gui.add(dirLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(dirLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(dirLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(dirLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

renderer.physicallyCorrectLights = true

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()