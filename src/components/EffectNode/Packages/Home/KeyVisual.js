// Core Code
import { EffectNode } from "../../Core/EffectNode"

// Stack
import { Scene } from "three"
import { GLRenderer } from "../../WebGL/GLRenderer"
import { PCamera } from "../../WebGL/PCamera"

// Application Packages
import { ClickerBalls } from "../ClickerBalls/ClickerBalls"

export class KeyVisual {
  constructor ({ el }) {
    // Application Core
    this.ctx = new EffectNode({ name: 'KeyVisual' })
    let ctx = this.ctx
    ctx.el = el

    let renderer = new GLRenderer({ ctx })
    let camera = new PCamera({ ctx })
    camera.position.z = 12

    let scene = ctx.scene = new Scene()

    ctx.onLoop(() => {
      renderer.render(scene, camera)
    })

    // Application Packages
    new ClickerBalls({ ctx: ctx.node({ name: 'BallService' }) })

    console.log(ctx.services.BallService)

    return this.ctx
  }
}
