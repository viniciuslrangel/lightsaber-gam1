import io from 'socket.io-client'

document.writeln('Lightsaber')

if (window.DeviceOrientationEvent) {
	document.writeln('Supported')
} else {
	document.writeln('Not supported')
}

const socket = io(window.location.href)

let count = 0

// eslint-disable-next-line no-undef
const sensor = new AbsoluteOrientationSensor()

sensor.onreading = () => {
    document.body.innerText = `${count++} updating`
    socket.emit('rotation', sensor.quaternion)
}
sensor.start()
