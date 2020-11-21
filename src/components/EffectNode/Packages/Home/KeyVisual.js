// Core Code
import { EffectNode } from "../../Core/EffectNode"

// Stack
import { Scene } from "three"
import { GLRenderer } from "../../WebGL/GLRenderer"
import { GLCamera } from "../../WebGL/GLCamera"

// Application Packages
import { ClickerBalls } from "../ClickerBalls/ClickerBalls"

export class KeyVisual {
  constructor ({ el }) {
    // Application Core
    let ctx = new EffectNode({ name: 'KeyVisualRenderRoot' })
    ctx.el = el

    let renderer = new GLRenderer({ ctx })
    let camera = new GLCamera({ ctx })
    camera.position.z = 10

    let scene = ctx.scene = new Scene()

    ctx.onLoop(() => {
      renderer.render(scene, camera)
    })

    // Application Packages
    new ClickerBalls({ ctx: ctx.node({ name: 'BallService' }) })

    // console.log(ctx.services.BallService)

    return ctx
  }
}
