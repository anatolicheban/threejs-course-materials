import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { AmbientLight, DirectionalLight, Raycaster, Vector2, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshMatcapMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshMatcapMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshMatcapMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

//Raycaster
const raycaster = new Raycaster()

// const rayOrigin = new Vector3(-3, 0, 0)
// const rayDir = new Vector3(10, 0, 0)
// rayDir.normalize()

// raycaster.set(rayOrigin, rayDir)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects);

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

const mouse = new Vector2();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = - e.clientY / sizes.height * 2 + 1
})

window.addEventListener('click', () => {
    if (currIntersect) {
        console.log('Click');
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let model;

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
    model = gltf.scene
    model.position.y = -1.2
    scene.add(model)
})

const ambientLight = new AmbientLight(0xffffff, .4)
scene.add(ambientLight)
const directionalLight = new DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

let currIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime) * 1.5
    object2.position.y = Math.cos(elapsedTime * 1.2) * 1.5
    object3.position.y = Math.sin(elapsedTime * .7) * 1.5

    // Update controls
    controls.update()

    // const rayOrigin = new Vector3(-3, 0, 0)
    // const rayDir = new Vector3(1, 0, 0)
    // rayDir.normalize()

    // raycaster.set(rayOrigin, rayDir)

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intetrsects = raycaster.intersectObjects(objectsToTest)

    objectsToTest.forEach(object => object.material.color.set('#f00'))
    intetrsects.forEach(intersect => intersect.object.material.color.set('#fff'))

    if (intetrsects.length) {
        if (!currIntersect) {
            console.log('Enter');
        }
        currIntersect = intetrsects[0]
    } else {
        if (currIntersect) {
            console.log('Leave');
        }
        currIntersect = null
    }

    if (model) {
        const modelIntersects = raycaster.intersectObject(model)
        console.log(modelIntersects);
        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()