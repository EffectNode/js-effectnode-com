// Core Code
import { EffectNode } from "../../Core/EffectNode"

// Stack
import { Color, Scene } from "three"
import { GLRenderer } from "../../WebGL/GLRenderer"
import { PCamera } from "../../WebGL/PCamera"

// Application Packages
import { Swimmers } from "./Swimmers.js"
import { GLOrbit } from "../../WebGL/GLOribt"

export class SwimmersCanvas {
  constructor ({ el }) {
    // Application Core
    let ctx = new EffectNode({ name: 'SwimmersCanvasRenderRoot' })
    ctx.el = el

    let renderer = new GLRenderer({ ctx })
    let camera = new PCamera({ ctx })
    camera.position.z = 20

    let scene = ctx.scene = new Scene()
    scene.background = new Color('#8FB14E').offsetHSL(0, 0.3, 0.2)

    ctx.onLoop(() => {
      renderer.render(scene, camera)
    })

    new GLOrbit({ ctx: ctx.node({ name: 'GLOrbitService' }) })

    // Application Packages
    new Swimmers({ ctx: ctx.node({ name: 'SwimmersService' }) })
    // setTimeout(() => {
    //   curves.destroy()
    // }, 1000)

    // console.log(ctx.services.CurveService)

    return ctx
  }
}
