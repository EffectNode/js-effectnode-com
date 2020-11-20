import { PerspectiveCamera } from "three"

export class PCamera {
  constructor ({ ctx }) {
    let el = ctx.el
    ctx.rect = el.getBoundingClientRect()
    ctx.aspectRatio = ctx.rect.width / ctx.rect.height

    let camera = ctx.camera = new PerspectiveCamera(65, ctx.aspectRatio, 0.0000001, 10000000.0)

    ctx.onResize(() => {
      ctx.rect = el.getBoundingClientRect()
      ctx.aspectRatio = ctx.rect.width / ctx.rect.height
      camera.updateProjectionMatrix()
    })

    return camera
  }
}
