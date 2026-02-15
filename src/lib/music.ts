// Background music manager
let audio: HTMLAudioElement | null = null;
let isPlaying = false;
let unlocked = false;

/** Call this synchronously inside a user gesture (click/tap) to unlock and start music */
export function startMusic() {
  if (isPlaying) return;
  if (!audio) {
    audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.3;
  }
  // Synchronous play attempt within user gesture context unlocks audio on mobile
  audio.play().then(() => {
    isPlaying = true;
    unlocked = true;
  }).catch(() => {});
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
