// Core Code
import { EffectNode } from "../../Core/EffectNode"

// Stack
import { Color, Scene } from "three"
import { GLRenderer } from "../../WebGL/GLRenderer"
import { PCamera } from "../../WebGL/PCamera"

// Application Packages
import { Swimmers } from "./Swimmers.js"
import { GLOrbit } from "../../WebGL/GLOribt"
import { GLBloom } from "../../WebGL/GLBloom"

export class SwimmersCanvas {
  constructor ({ el }) {
    // Application Core
    let ctx = new EffectNode({ name: 'SwimmersCanvasRenderRoot' })
    ctx.link(this)
    ctx.el = el

    new GLRenderer({ ctx })
    let camera = new PCamera({ ctx })
    camera.position.z = 20

    let scene = ctx.scene = new Scene()
    scene.background = new Color('#232323')

    new GLOrbit({ ctx: ctx.node({ name: 'GLOrbitService' }) })

    // Application Packages
    new Swimmers({ ctx: ctx.node({ name: 'SwimmersService' }) })
    // setTimeout(() => {
    //   curves.destroy()
    // }, 1000)

    let bloom = new GLBloom({ ctx: ctx.node({ name: 'GLBloomService' }) })

    ctx.onLoop(() => {
      bloom.selectiveBloom()
    })

    console.log(ctx.names.GLBloomService)
  }
}
