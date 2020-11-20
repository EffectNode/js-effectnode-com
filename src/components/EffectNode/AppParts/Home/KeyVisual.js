import { Scene } from "three"
import { ActionArray } from "../../Core/ActionArray"
import { EffectNode, genID, getID } from "../../Core/EffectNode"
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
      array: [
        { _id: getID() }
      ],
      onAttach: (value) => {
        new Bally({ ctx: ctx.node({ _id: value._id, name: 'Bally1' }) })
      },
      onDetach: (value) => {
        ctx.removeByID({ _id: value._id })
      }
    })

    el.onclick = () => {
      let rID = genID()
      manager.add({
        _id: rID
      })
      setTimeout(() => {
        manager.remove({ _id: rID })
      }, 1000)
    }
  }
}
