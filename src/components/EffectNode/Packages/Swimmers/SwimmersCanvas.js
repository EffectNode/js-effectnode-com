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
    this.debug = true

    // Application
    let ctx = this

    // App Global Resources
    this.el = el
    this.renderer = new GLRenderer({ ctx })
    this.camera = new GLCamera({ ctx })
    this.camera.position.z = 20

    this.scene = new Scene()
    this.scene.background = new Color('#232323')

    this.bloom = new GLBloom({ ctx: ctx.node({ name: 'Bloom' }) })
    this.orbit = new GLOrbit({ ctx })

    new Swimmers({ ctx: ctx.node({ name: 'Swimmers' }) })

    this.bloom.ctx.onLoop(() => {
      this.bloom.selectiveBloom()
    })

    console.log(this.internal)
  }
}
