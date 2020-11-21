import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export class GLOrbit {
  constructor ({ ctx }) {
    let ctrls = new OrbitControls(ctx.camera, ctx.renderer.domElement)
    ctrls.enableDamping = true
    ctrls.dampingFactor = 0.06
    ctx.onLoop(() => {
      ctrls.update()
    })

    return ctrls
  }
}