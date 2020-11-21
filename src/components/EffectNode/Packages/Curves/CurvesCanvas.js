// Core Code
import { EffectNode } from "../../Core/EffectNode"

// Stack
import { Scene } from "three"
import { GLRenderer } from "../../WebGL/GLRenderer"
import { GLCamera } from "../../WebGL/GLCamera"

// Application Packages
import { Curves } from "../Curves/Curves"

export class CurvesCanvas {
  constructor ({ el }) {
    // Application Core
    let ctx = new EffectNode({ name: 'CurvesCanvasRenderRoot' })
    ctx.el = el

    let renderer = new GLRenderer({ ctx })
    let camera = new GLCamera({ ctx })
    camera.position.z = 10

    let scene = ctx.scene = new Scene()

    ctx.onLoop(() => {
      renderer.render(scene, camera)
    })

    // Application Packages
    new Curves({ ctx: ctx.node({ name: 'CurveService' }) })
    // setTimeout(() => {
    //   curves.destroy()
    // }, 1000)

    // console.log(ctx.services.CurveService)

    return ctx
  }
}
