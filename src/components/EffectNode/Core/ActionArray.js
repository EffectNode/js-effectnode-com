export class ActionArray {
  constructor ({ array = [], onBuild = () => {}, onDetach = () => {}, onPatch = () => {} }) {
    let proxy = new Proxy(array, {
      get: (obj, key) => {
        if (key === 'pop') {
          return () => {
            let res = obj.pop()
            onDetach(res)
            return res
          }
        }

        if (key === 'shift') {
          return () => {
            let res = obj.shift()
            onDetach(res)
            return res
          }
        }

        if (key === 'push') {
          return (val) => {
            array.push(val)
            onBuild(val)
            return val
          }
        }

        if (key === 'unshift') {
          return (val) => {
            obj.unshift(val)
            onBuild(val)
            return val
          }
        }

        return obj[key]
      },

      deleteProperty: (obj, key) => {
        if (key in obj) {
          onDetach(obj[key])
          delete obj[key]
        }
        return true
      },

      set: (obj, key, value) => {
        let before = obj[key]
        obj[key] = value
        let after = value
        onPatch({ after, before })
        return true
      }
    })

    return proxy
  }
}
