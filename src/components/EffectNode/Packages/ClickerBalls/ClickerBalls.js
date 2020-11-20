import { ActionCollection } from "../../Core/ActionCollection"
import { getID } from "../../Core/EffectNode"
import { Bally } from "./Bally"


export class ClickerBalls {
  constructor ({ ctx }) {
    ctx.bucket = new ActionCollection({
      array: [],
      onMake: (value) => {
        new Bally({
          ctx: ctx.node({
            _id: value._id,
            name: 'BallyObject' + value._id
          }),
          props: value
        })

        ctx
          .getByID({ _id: value._id })
          .emit('fadein', {
            done: () => {
            }
          })
      },
      onDestroy: (value) => {
        ctx
          .getByID({ _id: value._id })
          .emit('fadeout', {
            done: () => {
              ctx.destroyByID({ _id: value._id })
            }
          })
      }
    })

    let builder = () => {
      let rID = getID()
      ctx.bucket.add({
        _id: rID
      })
      setTimeout(() => {
        ctx.bucket.remove({ _id: rID })
      }, 2000)
    }
    ctx.el.onclick = () => {
      builder()
    }

    builder()

    return ctx
  }
}
