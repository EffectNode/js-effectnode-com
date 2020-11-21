import { Color, Scene } from "three"

// Stack
import { EffectNode } from "../../Core/EffectNode"
import { PCamera } from "../../WebGL/PCamera"
import { GLOrbit } from "../../WebGL/GLOribt"
import { GLBloom } from "../../WebGL/GLBloom"
import { GLRenderer } from "../../WebGL/GLRenderer"

// Application
import { Swimmers } from "./Swimmers.js"

export class SwimmersCanvas extends EffectNode {
  constructor ({ el, ...props }) {
    super(props)
    // Application
    let ctx = this

    // root context
    this.el = el
    this.renderer = new GLRenderer({ ctx })
    this.camera = new PCamera({ ctx })
    this.camera.position.z = 20

    this.scene = new Scene()
    this.scene.background = new Color('#232323')

    this.bloom = new GLBloom({ ctx })
    this.orbit = new GLOrbit({ ctx })

    new Swimmers({ ctx })

    this.onLoop(() => {
      this.bloom.selectiveBloom()
    })

    console.log(this.root.instances.map(e => e._))
  }
}
