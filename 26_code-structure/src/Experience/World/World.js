import Experience from "../Experience";
import * as THREE from 'three'
import Enviroment from "./Enviroment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on('ready', () => {
      //Setup
      this.floor = new Floor()
      this.fox = new Fox()
      this.enviroment = new Enviroment()
    })

  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}