import io from "socket.io-client";

document.writeln("Lightsaber");

if (window.DeviceOrientationEvent) {
  document.writeln("Supported");
} else {
  document.writeln("Not supported");
}

const socket = io(window.location.href);

let count = 0;

window.addEventListener(
  "compassneedscalibration",
  e => {
    e.preventDefault();
    alert("Calibration requried. Twist your phone a few times");
  },
  true
);

const feedback = document.body.appendChild(document.createElement("p"));

window.addEventListener("deviceorientation", e => {
  feedback.innerText = `${count++} updating`;
  socket.emit("rotation", {
    beta: e.beta,
    gamma: e.gamma
  });
});
