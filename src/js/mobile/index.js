import io from "socket.io-client";

document.writeln("Lightsaber");

if (window.DeviceOrientationEvent) {
  document.writeln("Supported");
} else {
  document.writeln("Not supported");
}

const startBtn = document.body.appendChild(document.createElement("button"));
startBtn.innerText = "Press to connect";
startBtn.onclick = () => {
  document.body.removeChild(startBtn);

  let count = 0;

  window.addEventListener(
    "compassneedscalibration",
    e => {
      e.preventDefault();
      alert("Calibration requried. Twist your phone a few times");
    },
    true
  );

  let context = new AudioContext();

  let idleSound = null;
  let movingBuffer = null;
  let moving = null;
  Promise.all(
    fetch(require("../../assets/idle.mp3"))
      .then(e => e.arrayBuffer())
      .then(e =>
        context.decodeAudioData(e).then(e => {
          idleSound = context.createBufferSource();
          idleSound.buffer = e;
          idleSound.connect(context.destination);
          idleSound.loop = true;
          idleSound.loopStart = 0.5;
          idleSound.loopEnd = e.duration - 0.55;
          idleSound.start(idleSound.loopStart);
        })
      ),
    fetch(require("../../assets/moving.mp3"))
      .then(e => e.arrayBuffer())
      .then(e =>
        context.decodeAudioData(e).then(e => {
          movingBuffer = e;
        })
      )
  ).then(() => {});

  const feedback = document.body.appendChild(document.createElement("p"));
  const feedbackMotion = document.body.appendChild(document.createElement("p"));

  const socket = io(window.location.href);

  window.addEventListener("deviceorientation", e => {
    feedback.innerText = `${count++} updating`;
    socket.emit("rotation", {
      beta: e.beta,
      gamma: e.gamma
    });
  });

  window.addEventListener("devicemotion", e => {
    const { alpha, beta, gamma } = e.rotationRate;
    feedbackMotion.innerText = `
    Alpha: ${Math.round(alpha)}
    Beta: ${Math.round(beta)}
    Gamma: ${Math.round(gamma)}
    `;
    socket.emit("motion", beta);
    if (alpha ** 2 + beta ** 2 + gamma ** 2 > 100000 && moving == null) {
      moving = context.createBufferSource();
      moving.buffer = movingBuffer;
      moving.connect(context.destination);
      moving.start(0);
      setTimeout(() => (moving = null), movingBuffer.duration * 1000 * 0.5);
    }
  });
};
