import { WebGLRenderer, PerspectiveCamera, Color, Scene, BoxGeometry, MeshLambertMaterial, Mesh, Vector3 } from 'three'
import io from 'socket.io-client'

const renderer = new WebGLRenderer({
	antialias: true
})
if (process.env.NODE_ENV === 'development') {
	Array.from(document.body.querySelectorAll('canvas')).forEach(e => document.body.removeChild(e))
}
document.body.appendChild(renderer.domElement)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(new Color(0x010101))

const camera = new PerspectiveCamera(50, 1, 0.01, 100)

window.addEventListener(
	'resize',
	(() => {
		const resize = () => {
			const width = window.innerWidth
			const height = window.innerHeight
			renderer.setSize(width, height)
			camera.aspect = width / height
			camera.updateProjectionMatrix()
		}
		resize()
		return resize
	})()
)

camera.position.z = 40

const scene = new Scene()

const lightGeo = new BoxGeometry(1, 10, 1)
const lightMat = new MeshLambertMaterial({ color: 0x000000, emissive: 0x0000ff })

const lightSaber = new Mesh(lightGeo, lightMat)

scene.add(lightSaber)

let lastTime = 0
renderer.setAnimationLoop(time => {
	time *= 0.001
	const delta = time - lastTime
	lastTime = time

	renderer.render(scene, camera)
})

const socket = io(window.location.href)
socket.on('rotation', data => {
    console.log(data)
    lightSaber.quaternion.fromArray(data)
})
