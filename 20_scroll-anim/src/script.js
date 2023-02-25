import * as THREE from 'three'
import * as dat from 'lil-gui'
import { BufferAttribute, BufferGeometry, ConeGeometry, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshToonMaterial, NearestFilter, Points, PointsMaterial, TextureLoader, TorusGeometry, TorusKnotGeometry } from 'three'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

const textureLoader = new TextureLoader()

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = NearestFilter

/**
 * Base
*/
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
*/
const objDist = 4;

const material = new MeshToonMaterial({ color: parameters.materialColor })
material.gradientMap = gradientTexture

const mesh1 = new Mesh(new TorusGeometry(1, .4, 16, 60), material)
const mesh2 = new Mesh(new ConeGeometry(1, 2, 32), material)
const mesh3 = new Mesh(new TorusKnotGeometry(.8, .35, 100, 16), material)

mesh1.position.y = - objDist * 0
mesh2.position.y = -objDist * 1
mesh3.position.y = -objDist * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

//Particles
const count = 700
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 10
    positions[i * 3 + 1] = objDist * .5 - Math.random() * objDist * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - .5) * 10
}
const particlesGeomtetry = new BufferGeometry()
particlesGeomtetry.setAttribute('position', new BufferAttribute(positions, 3))

const particlesMaterial = new PointsMaterial({ color: parameters.materialColor, sizeAttenuation: true, size: 0.02 })

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
})
const points = new Points(particlesGeomtetry, particlesMaterial)
scene.add(points)

//Lights
const dirLight = new DirectionalLight(0xffffff, 1)
dirLight.position.set(1, 1, 0)
scene.add(dirLight)


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
//Group
const group = new Group()
scene.add(group)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
group.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY
let currSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if (newSection !== currSection) {
        currSection = newSection
        gsap.to(sectionMeshes[currSection].rotation, { duration: 1.5, ease: 'power2.input', x: '+=6', y: '+=3', z: '+=1.5' })
        console.log('!');
    }
})

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - .5
    cursor.y = e.clientY / sizes.height - .5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevTime
    prevTime = elapsedTime

    //Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * .1
        mesh.rotation.y += deltaTime * .12
    }

    //Update camera
    camera.position.y = -scrollY / sizes.height * objDist

    const parallaxX = cursor.x * .5
    const parallaxY = - cursor.y * .5
    group.position.x += (parallaxX - group.position.x) * 5 * deltaTime
    group.position.y += (parallaxY - group.position.y) * 5 * deltaTime
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()