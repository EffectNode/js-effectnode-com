import { Scene } from "three"
import { ActionArray } from "../../Core/ActionArray"
import { EffectNode } from "../../Core/EffectNode"
import { GLRenderer } from "../../Stack/GLRenderer"
import { PCamera } from "../../Stack/PCamera"

import { Bally } from "./Bally"

export class KeyVisual {
  constructor ({ el }) {
    this.ctx = new EffectNode({ name: 'Love' })
    let ctx = this.ctx
    ctx.el = el

    let renderer = new GLRenderer({ ctx })
    let camera = new PCamera({ ctx })
    camera.position.z = 10

    let scene = ctx.root.scene = new Scene()

    ctx.onLoop(() => {
      renderer.render(scene, camera)
    })

    let manager = new ActionArray({
      array: []
    })

    manager.onBuild((value) => {
      new Bally({ ctx: ctx.node({ _id: value._id, name: 'Bally1' }) })
    })
    manager.onDetach((value) => {
      ctx.removeByID({ _id: value._id })
    })
    manager.onPatch(({ before, after }) => {
      if (after._id === before._id) {
        console.log('123')
        let current = ctx.getByID({ _id: before._id })
        if (current) {
          current.events.emit('update-data', { before, after })
        }
      } else {
        ctx.removeByID({ _id: before._id })
        new Bally({ ctx: ctx.node({ _id: after._id, name: 'Bally1' }) })
      }
    })

    el.onclick = () => {
      manager.push({
        _id: 'ball1'
      })
      let idx = manager.findIndex(e => e._id === 'ball1')
      setTimeout(() => {
        manager.splice(idx, 1)
      }, 1000)
    }
  }
}
