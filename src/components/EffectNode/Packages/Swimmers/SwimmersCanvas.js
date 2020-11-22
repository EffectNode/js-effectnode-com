import { Color, Scene } from "three"

// Stack
import { EffectNode } from "../../Core/EffectNode"
import { GLCamera } from "../../WebGL/GLCamera"
import { GLOrbit } from "../../WebGL/GLOrbit"
import { GLBloom } from "../../WebGL/GLBloom"
import { GLRenderer } from "../../WebGL/GLRenderer"

// Application
import { Swimmers } from "./Swimmers.js"

export class SwimmersCanvas extends EffectNode {
  constructor ({ el }) {
    super()

    // App Application
    let ctx = this

    // App Resources
    this.el = el
    this.renderer = new GLRenderer({ ctx })
    this.camera = new GLCamera({ ctx })
    this.camera.position.z = 20

    this.scene = new Scene()
    this.scene.background = new Color('#121212')

    new GLOrbit({ ctx })
    new GLBloom({ ctx: ctx.node({ name: 'BloomerRenderer' }) })
    new Swimmers({ ctx: ctx.node({ name: 'Swimmers' }) })

    let bloom = ctx.services.BloomerRenderer
    bloom.onLoop(() => {
      bloom.renderSelectiveBloom()
    })

    // Optimizer
    // this.logging = true
    // console.log(this.internals)

    // Advanced
    console.log(this.names)
  }
}

// context
// instnace managment (like vuejs and reactjs but in vanilla & clean code)
//