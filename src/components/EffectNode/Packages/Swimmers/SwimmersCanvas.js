import { Color, Scene } from "three"

// Stack
import { EffectNode } from "../../Core/EffectNode"
import { GLCamera } from "../../WebGL/GLCamera"
import { GLOrbit } from "../../WebGL/GLOribt"
import { GLBloom } from "../../WebGL/GLBloom"
import { GLRenderer } from "../../WebGL/GLRenderer"

// Application
import { Swimmers } from "./Swimmers.js"

export class SwimmersCanvas extends EffectNode {
  constructor ({ el }) {
    super()

    // Application
    let ctx = this

    // App Global Resources
    this.el = el
    this.renderer = new GLRenderer({ ctx })
    this.camera = new GLCamera({ ctx })
    this.camera.position.z = 20

    this.scene = new Scene()
    this.scene.background = new Color('#121212')

    this.bloom = new GLBloom({ ctx: ctx.node({ name: 'bloomer' }) })
    this.orbit = new GLOrbit({ ctx })

    new Swimmers({ ctx: ctx.node({ name: 'Swimmers' }) })


    // custom render
    ctx.services.bloomer.onLoop(() => {
      this.bloom.renderSelectiveBloom()
    })

    // Optimizer
    // this.logging = true
    // console.log(this.internals)

    // Advanced
    // console.log(this.names.Swimmers)
  }
}

// context
// instnace managment (like vuejs and reactjs but in vanilla & clean code)
//