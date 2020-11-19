import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three"

export class Bally {
  constructor ({ ctx }) {
    let geo = new SphereBufferGeometry(3, 32, 32)
    let mat = new MeshBasicMaterial({ wireframe: true })
    let mesh = new Mesh(geo, mat)
    ctx.scene.add(mesh)

    ctx.onLoop(() => {
      mesh.rotation.y += 0.003
    })

    ctx.onClean(() => {
      ctx.scene.remove(mesh)
    })

    return ctx
  }
}
