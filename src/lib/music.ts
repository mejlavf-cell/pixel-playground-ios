// Background music manager
let audio: HTMLAudioElement | null = null;
let isPlaying = false;

export function startMusic() {
  if (isPlaying) return;
  if (!audio) {
    audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
  }
  audio.play().then(() => { isPlaying = true; }).catch(() => {});
}

export function stopMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
}

export function isMusicPlaying() {
  return isPlaying;
}
