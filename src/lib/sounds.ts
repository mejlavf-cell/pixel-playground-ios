// Simple Web Audio API sound effects
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function beep(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) {
  if (!audioCtx) return;
  // Resume context if suspended (autoplay policy)
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playSound(type: "correct" | "wrong" | "win" | "timeUp" | "tick") {
  switch (type) {
    case "correct":
      beep(880, 0.15, "sine", 0.25);
      setTimeout(() => beep(1100, 0.15, "sine", 0.25), 100);
      break;
    case "wrong":
      beep(200, 0.3, "square", 0.2);
      break;
    case "win":
      beep(523, 0.15, "sine", 0.3);
      setTimeout(() => beep(659, 0.15, "sine", 0.3), 120);
      setTimeout(() => beep(784, 0.15, "sine", 0.3), 240);
      setTimeout(() => beep(1047, 0.3, "sine", 0.3), 360);
      break;
    case "timeUp":
      beep(400, 0.2, "sawtooth", 0.2);
      setTimeout(() => beep(300, 0.3, "sawtooth", 0.2), 200);
      break;
    case "tick":
      beep(600, 0.05, "sine", 0.1);
      break;
  }
}
