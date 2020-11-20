import './GLRenderer.css'
import { sRGBEncoding, WebGLRenderer } from "three"

export class GLRenderer {
  constructor ({ ctx }) {
    ctx.renderer = new WebGLRenderer({
      outputEncoding: sRGBEncoding
    })

    let el = ctx.el
    ctx.rect = el.getBoundingClientRect()
    ctx.aspect = ctx.rect.width / ctx.rect.height
    ctx.onResize(() => {
      ctx.rect = el.getBoundingClientRect()
      ctx.aspect = ctx.rect.width / ctx.rect.height
      ctx.renderer.setSize(ctx.rect.width, ctx.rect.height)
    })

    el.appendChild(ctx.renderer.domElement)
    ctx.onClean(() => {
      let dom = ctx.renderer.domElement
      dom.parentNode.removeChild(dom)
    })

    return ctx.renderer
  }
}
