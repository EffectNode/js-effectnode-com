/* CopyRight © Wong Lok 2020, MIT Licensed */

class TellerEmitter {
  constructor () {
    const eventMap = {}

    const on = (name, fn) => {
      if (!eventMap[name]) {
        eventMap[name] = []
      }
      eventMap[name].push(fn)
    }

    const emit = (name, data) => {
      if (!eventMap[name]) {
        return false
      }
      eventMap[name].forEach((fn) => fn(data))
    }

    const off = (name, fn) => {
      if (eventMap[name]) {
        const index = eventMap[name].indexOf(fn)
        if (index >= 0) {
          eventMap[name].splice(index, 1)
        }
      }
    }

    const cancel = (name) => {
      if (eventMap[name]) {
        delete eventMap[name]
      }
    }

    return {
      on,
      emit,

      off,
      cancel
    }
  }
}

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

  static getUndefined (vm, key) {
    console.log('access undefinedd', vm, key)
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

class MiniEngine {
  constructor ({ name }) {
    this.name = name
    this.debug = false
    let isAborted = false
    this.tasks = []
    this.resizeTasks = []
    this.cleanTasks = []
    this.onLoop = (fnc) => {
      this.tasks.push(fnc)
    }

    this.onResize = (fnc) => {
      fnc()
      this.resizeTasks.push(fnc)
    }

    this.onClean = (func) => {
      this.cleanTasks.push(func)
    }

    let intv = 0
    let internalResize = () => {
      clearTimeout(intv)
      intv = setTimeout(() => {
        this.resizeTasks.forEach(e => e())
      }, 16.8888 * 10.)
    }

    window.addEventListener('resize', () => {
      internalResize()
    })

    this.doCleanUp = () => {
      isAborted = true
      try {
        this.cleanTasks.forEach(e => e())
      } catch (e) {
        console.error(e)
      }
    }

    let isPaused = false
    this.toggle = () => {
      isPaused = !isPaused
    }
    this.pause = () => {
      isPaused = true
    }
    this.play = () => {
      isPaused = false
    }

    this.doMyWork = () => {
      if (isAborted) {
        return {
          name: this.name,
          duration: 0
        }
      }
      if (isPaused) {
        return {
          name: this.name,
          duration: 0
        }
      }
      let start = window.performance.now()
      try {
        this.tasks.forEach(e => e())
      } catch (e) {
        console.error(e)
      }
      let end = window.performance.now()
      let duration = end - start

      return {
        name: this.name,
        duration
      }
    }
  }
}

class EffectNode {
  constructor ({ _id, name = '', type = 'EffectNode', root = false, parent = false, ownLoop = false, ...props } = {}) {
    this.props = props
    this.type = type
    this.root = root || this
    this.parent = parent || false
    this._id = _id || EN.genID()
    this.name = name || this.root === this ? 'Root Node' : 'Sub Node'
    this.engine = new MiniEngine({ name: this.name })
    this.children = []
    this.events = new TellerEmitter()

    let protectedProperties = [
      'root',
      'onLoop',
      'onResize',
      'onCleanUp',
      '_',
      'on',
      'off',
      'cancel',
      'emit'
    ]

    this.context = new Proxy(this, {
      get: (obj, key) => {
        // fast access
        if (key === 'root') {
          return obj.root
        }
        if (key === 'onLoop') {
          return this.engine.onLoop
        }
        if (key === 'onResize') {
          return this.engine.onResize
        }
        if (key === 'onCleanUp') {
          return this.engine.onCleanUp
        }
        if (key === '_') {
          return this
        }
        if (key === 'on') {
          return this.events.on
        }
        if (key === 'off') {
          return this.events.off
        }
        if (key === 'cancel') {
          return this.events.cancel
        }
        if (key === 'emit') {
          return this.events.emit
        }
        if (key === 'clean') {
          return () => {
            let idx = this.root.instances.findIndex(e => e === this.context)
            let me = this.root.instances[idx]
            me.engine.doCleanUp()
            this.root.instances.splice(idx, 1)
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

    if (this.isRoot) {
      this.instances = []
    }

    if (this.parent) {
      this.parent.children.push(this.context)
    }
    this.root.instances.push(this.context)

    if (this.isRoot && !ownLoop) {
      this.startAll()
    }

    return this.context
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

  get isRoot () {
    return this.root === this
  }

  get allNodes () {
    return this.root.instances
  }

  node (props) {
    let ctx = new EffectNode({ ...props, root: this.root, parent: this })
    return ctx
  }
}

export { EffectNode }

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
