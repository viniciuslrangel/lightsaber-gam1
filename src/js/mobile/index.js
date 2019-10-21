import io from 'socket.io-client'
import { Quaternion } from 'three'
import { RelativeOrientationSensor } from 'motion-sensors-polyfill'

document.writeln('Lightsaber')

if (window.DeviceOrientationEvent) {
	document.writeln('Supported')
} else {
	document.writeln('Not supported')
}

const socket = io(window.location.href)

let count = 0

const sensor = new RelativeOrientationSensor({
    frequency: 60,
    referenceFrame: 'device'
})

Promise.all([navigator.permissions.query({ name: "accelerometer" }),
             navigator.permissions.query({ name: "gyroscope" })])
       .then(results => {
         if (results.every(result => result.state === "granted")) {
           sensor.start()
         } else {
           alert("No permissions to use AbsoluteOrientationSensor.")
         }
   });

const btn = document.body.appendChild(document.createElement('button'))
btn.innerText = "Calibrate to zero"

const feedback = document.body.appendChild(document.createElement('p'))

let calibrate = new Quaternion()

btn.onclick = () => {
  calibrate.fromArray(sensor.quaternion).inverse()
}

const readed = new Quaternion()
sensor.onreading = () => {
    feedback.innerText = `${count++} updating`
    readed.fromArray(sensor.quaternion)
    socket.emit('rotation', readed.multiply(calibrate).toArray())
}


