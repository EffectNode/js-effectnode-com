/* CopyRight © Wong Lok 2020, MIT Licensed */
import { MiniEngine } from './MiniEngine'
import { BigMouth } from './BigMouth'

class EN {
  static tellKids (vm, ev, data) {
    if (vm) {
      vm.events.emit(ev, data)
      let desc = vm.children
      if (vm.children && desc.length > 0) {
        desc.forEach((kid) => {
          EN.tellKids(kid, ev, data)
        })
      }
    }
  }
  static getUndefined () {
  }
  static getParent (vm) {
    return vm.parent
  }
  static genID () {
    return '_' + Math.random().toString(36).substr(2, 9)
  }
  static lookupHolder (vm, key) {
    if (EN.getParent(vm) && EN.getParent(vm)[key]) {
      return EN.getParent(vm)
    } else {
      vm = EN.getParent(vm)
      if (!vm) {
        return EN.getUndefined(vm, key)
      }
      return EN.lookupHolder(vm, key)
    }
  }

  static traverseParent (vm, key) {
    if (vm[key]) {
      return vm[key]
    } else if (EN.getParent(vm) && EN.getParent(vm)[key]) {
      return EN.getParent(vm)[key]
    } else {
      vm = EN.getParent(vm)
      if (!vm) {
        return EN.getUndefined(vm, key)
      }
      return EN.traverseParent(vm, key)
    }
  }

  static makeNode (node) {
    return new Proxy(node, {
      get: (obj, key) => {
        if (key === 'root') {
          return EN.traverseParent(obj, 'root')
        }
        return EN.traverseParent(obj, key)
      },
      set: (obj, key, val, receiver) => {
        if (key === 'root') {
          console.log('key is preserved for ease of access to root node', key)
          return true
        }
        return Reflect.set(obj, key, val, receiver)
      }
    })
  }
}

export const genID = EN.genID
export const getID = EN.genID

class EffectNode {
  constructor ({ _id, name = '', root = false, type = 'EffectNode', isRoot = true, parent = false, ownLoop = false, ...props } = {}) {
    this.isRoot = isRoot
    this.root = root || this
    this.props = props
    this.parent = parent || false
    this._id = _id || EN.genID()

    this.type = type
    this.name = name

    if (this.isRoot) {
      this.instances = []
    }
    this.engine = new MiniEngine({ name: this.name })
    this.children = []
    this.events = new BigMouth()
    let protectedProperties = [
      'root',
      'onLoop',
      'onResize',
      'onClean',
      '_',
      'on',
      'off',
      'cancel',
      'emit'
    ]
    let vm = this
    this.context = new Proxy(this, {
      get: (obj, key) => {
        if (key === '_') {
          return vm
        }
        if (key === 'root') {
          return vm.root
        }
        if (key === 'isRoot') {
          return vm.isRoot
        }
        if (key === 'onLoop') {
          return vm.engine.onLoop
        }
        if (key === 'onResize') {
          return vm.engine.onResize
        }
        if (key === 'onClean') {
          return vm.engine.onClean
        }
        if (key === 'on') {
          return vm.events.on
        }
        if (key === 'off') {
          return vm.events.off
        }
        if (key === 'cancel') {
          return vm.events.cancel
        }
        if (key === 'emit') {
          return vm.events.emit
        }
        if (key === 'clean') {
          return () => {
            vm.cleanUpWork()
          }
        }

        return EN.traverseParent(obj, key)
      },
      set: (obj, key, val, receiver) => {
        if (protectedProperties.includes(key)) {
          console.warn('protected read only properites', key)
          return true
        }
        return Reflect.set(obj, key, val, receiver)
      }
    })

    this.root.instances.push(this.context)

    if (this.isRoot && !ownLoop) {
      this.startAll()
    }

    return this.context
  }

  removeByID ({ _id }) {
    let node = this.getByID({ _id })
    node.clean()
    console.log(_id, this.root.instances)
  }

  getByID ({ _id }) {
    let node = this.root.instances.find(e => e._id === _id)
    return node
  }

  cleanUpWork () {
    this.engine.doCleanUp()

    let idx = this.root.instances.findIndex(e => e._id === this._id)
    this.root.instances.splice(idx, 1)
    this.events.reset()

    this.children.forEach(kid => {
      kid.cleanUpWork()
    })
  }

  tellDown (ev, data) {
    EN.tellKids(this, ev, data)
  }

  startAll () {
    let rAF = () => {
      this.rAFID = requestAnimationFrame(rAF)
      this.processAllNodes()
    }
    this.rAFID = requestAnimationFrame(rAF)
  }
  stopAll () {
    cancelAnimationFrame(this.rAFID)
  }

  processAllNodes () {
    if (this.root.profile) {
      let stats = {
        total: 0,
        nodes: 0,
        profile: []
      }
      this.root.instances.forEach(each => {
        let res = each.engine.doMyWork()
        stats.profile.push(res)
        stats.total += res.duration || 0
      })
      stats.nodes = stats.profile.length

      console.log(stats)
      this.events.emit('profile', stats)
    } else {
      this.root.instances.forEach(each => {
        each.engine.doMyWork()
      })
    }
  }

  node (props) {
    let ctx = new EffectNode({ ...props, isRoot: false, root: this.root, parent: this })
    this.children.push(ctx)
    return ctx
  }
}

export {
  EffectNode
}

  // class MyBox {
  //   constructor ({ ctx }) {
  //     ctx.me = this
  //   }
  // }
  // class MyApp {
  //   constructor () {
  //     this.ctx = new EffectNode({ name: 'Wong Lok', type: 'RenderRoot' })
  //     new MyBox({ ctx: this.ctx.node(), type: 'MyBox' })
  //   }
  // }

  // new MyApp()
