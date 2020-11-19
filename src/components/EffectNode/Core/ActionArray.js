import { BigMouth } from './BigMouth'
export class ActionArray {
  constructor ({ array = []  }) {
    let mouth = new BigMouth()
    this.mouth = mouth
    let proxy = new Proxy(array, {
      get: (obj, key) => {
        if (key === 'on') {
          return mouth.on
        }
        if (key === 'off') {
          return mouth.off
        }
        if (key === 'cancel') {
          return mouth.cancel
        }
        if (key === 'emit') {
          return mouth.emit
        }
        if (key === 'reset') {
          return mouth.reset
        }

        if (key === 'pop') {
          return () => {
            let res = obj.pop()
            mouth.emit('detach', res)
            return res
          }
        }

        if (key === 'shift') {
          return () => {
            let res = obj.shift()
            mouth.emit('detach', res)
            return res
          }
        }

        if (key === 'push') {
          return (val) => {
            array.push(val)
            mouth.emit('build', val)
            return val
          }
        }

        if (key === 'unshift') {
          return (val) => {
            obj.unshift(val)
            mouth.emit('build', val)
            return val
          }
        }

        return obj[key] || this[key]
      },

      deleteProperty: (obj, key) => {
        if (key in obj) {
          mouth.emit('detach', obj[key])
          delete obj[key]
        }
        return true
      },

      set: (obj, key, value) => {
        let before = obj[key]
        obj[key] = value
        let after = value
        mouth.emit('patch', { before, after })
        return true
      }
    })

    return proxy
  }
  onDetach (ev) {
    this.mouth.on('detach', ev)
  }
  onBuild (ev) {
    this.mouth.on('build', ev)
  }
  onPatch (ev) {
    this.mouth.on('patch', ev)
  }
}
