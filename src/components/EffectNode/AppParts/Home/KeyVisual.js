import { Scene } from "three"
import { ActionArray } from "../../Core/ActionArray"
import { EffectNode } from "../../Core/EffectNode"
import { GLRenderer } from "../../Stack/GLRenderer"
import { PCamera } from "../../Stack/PCamera"

import { Bally } from "./Bally"

export class KeyVisual {
  // canvas mounter
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

    let myActionArray = new ActionArray({
      array: [],
      onBuild: (value) => {
        new Bally({ ctx: ctx.node({ _id: value._id, name: 'Bally1' }) })
      },
      onDetach: (value) => {
        ctx.removeByID({ _id: value._id })
      },
      onPatch: ({ after, before }) => {
        if (after._id === before._id) {
          let current = ctx.getByID({ _id: after._id })
          if (current) {
            current.events.emit('update-data', { before, after })
          }
        } else {
          ctx.removeByID({ _id: before._id })
          new Bally({ ctx: ctx.node({ _id: after._id, name: 'Bally1' }) })
        }
      }
    })

    myActionArray.push({
      _id: 'ball1'
    })

    let idx = myActionArray.findIndex(e => e._id === 'ball1')
    setTimeout(() => {
      myActionArray.splice(idx, 1)
    }, 1000)
  }
}
