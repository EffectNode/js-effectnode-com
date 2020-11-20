import { ActionCollection } from "../../Core/ActionCollection"
import { getID } from "../../Core/EffectNode"
import { Bally } from "./Bally"

export class ClickerBalls {
  constructor ({ ctx }) {
    let bucket = new ActionCollection({
      array: [],
      onMake: (value) => {
        new Bally({
          ctx: ctx.node({
            _id: value._id,
            name: 'Bally' + value._id
          }),
          props: value
        })
      },
      onDestroy: (value) => {
        ctx.destroyByID({ _id: value._id })
      }
    })

    let builder = () => {
      let rID = getID()

      bucket.add({
        _id: rID
      })

      setTimeout(() => {
        bucket.remove({ _id: rID })
      }, 1500)
    }

    ctx.el.onclick = () => {
      builder()
    }

    builder()

    return ctx
  }
}
