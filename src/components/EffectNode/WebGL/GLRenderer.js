import './GLRenderer.css'
import { sRGBEncoding, WebGLRenderer } from "three"

export class GLRenderer {
  constructor ({ ctx }) {
    let renderer = ctx.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      outputEncoding: sRGBEncoding
    })

    let el = ctx.el
    ctx.rect = el.getBoundingClientRect()
    ctx.aspect = ctx.rect.width / ctx.rect.height
    ctx.onResize(() => {
      ctx.rect = el.getBoundingClientRect()
      ctx.aspect = ctx.rect.width / ctx.rect.height
      renderer.setSize(ctx.rect.width, ctx.rect.height)
      let dpi = window.devicePixelRatio || 1.0
      renderer.setPixelRatio(dpi)
    })

    el.appendChild(renderer.domElement)
    ctx.onClean(() => {
      let dom = renderer.domElement
      dom.parentNode.removeChild(dom)
    })

    return renderer
  }
}
