import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three"

export class Bally {
  constructor ({ ctx, props }) {
    this.props = props

    let geo = new SphereBufferGeometry(3, 32, 32)
    let mat = new MeshBasicMaterial({ wireframe: true })
    let mesh = new Mesh(geo, mat)
    ctx.scene.add(mesh)

    ctx.onLoop(() => {
      mesh.rotation.y += 0.003
    })

    ctx.onClean(() => {
      mesh.geometry.dispose()
      mesh.material.dispose()
      ctx.scene.remove(mesh)
    })
  }
}
