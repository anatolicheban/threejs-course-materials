import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial, SphereGeometry } from 'three'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const colorTexture = textureLoader.load('/textures/particles/2.png')

//Geometry
const particlesGeometry = new BufferGeometry()
const count = 20000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3))
console.log(particlesGeometry.attributes.color);

//Material
const particlesMaterial = new PointsMaterial({ size: 0.1, sizeAttenuation: true })
particlesMaterial.alphaMap = colorTexture
particlesMaterial.transparent = true
particlesMaterial.vertexColors = true
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = AdditiveBlending

//Points
const particles = new Points(particlesGeometry, particlesMaterial)
scene.add(particles)
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //Update particles
    // particles.rotation.y = elapsedTime * .2
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()