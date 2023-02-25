import * as THREE from 'three'
import gsap from 'gsap'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// let time = Date.now()

const clock = new THREE.Clock()

gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 })
gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 })

//Animation 
const tick = () => {
    //Time
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime
    //Update obj
    // mesh.position.x += 0.01
    // mesh.position.y += 0.01
    // mesh.rotation.y += 0.001 * deltaTime

    //Clock
    const elapsedTime = clock.getElapsedTime()
    // mesh.position.x = 1 * Math.sin(elapsedTime) / 2
    // mesh.position.y = 1 * Math.cos(elapsedTime) / 2
    // camera.lookAt(mesh.position)
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()