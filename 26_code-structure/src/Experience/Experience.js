import { Scene } from "three"
import Camera from "./Camera"
import Renderer from "./Renderer"
import Resources from "./Utils/Resources"
import { Sizes } from "./Utils/Sizes"
import Time from "./Utils/Time"
import World from "./World/World"
import sources from './sources.js'
import Debug from "./Utils/Debug"
import * as THREE from 'three'

let instance = null

export default class Experience {
  constructor(canvas) {
    window.experience = instance

    if (instance) {
      return instance
    }

    instance = this

    //Options
    this.canvas = canvas

    //Setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.resources = new Resources(sources)
    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    //Traverse
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose function
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })
    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if (this.debug.active)
      this.debug.ui.destroy()
  }
}