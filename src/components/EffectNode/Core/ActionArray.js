// a_____a

export class ActionArray {
  constructor ({ array, onAttach = () => {}, onDetach = () => {} }) {
    array.forEach(e => {
      onAttach(e)
    })

    return new Proxy({}, {
      get: (temp, key) => {

        if (key === 'add') {
          return (v) => {
            onAttach(v)
            array.push(v)
          }
        }

        if (key === 'remove') {
          return (v) => {
            let idx = array.findIndex(e => e._id === v._id)
            array.splice(idx, 1)
            onDetach(v)
          }
        }

        return array[key]
      },
      set: (temp, key, value) => {
        return array[key] = value
      }
    })
  }
}
