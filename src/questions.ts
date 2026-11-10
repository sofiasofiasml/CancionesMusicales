// OJO: revisar letras antes de entregar. Editar aquí para cambiar el reto.
// answer = respuestas válidas (sin importar tildes ni mayúsculas).
export type Q = { artist: string; song: string; before: string; after: string; answer: string[] };

export const questions: Q[] = [
  { artist: "Rocío Jurado", song: "Se nos rompió el amor", before: "Se nos rompió el amor", after: "se nos rompió el amor", answer: ["de tanto usarlo"] },
  { artist: "Rocío Jurado", song: "Como una ola", before: "Como una ola de fuego y", after: "", answer: ["de luz"] },
  { artist: "Mónica Naranjo", song: "Sobreviviré", before: "Yo", after: "", answer: ["sobreviviré"] },
  { artist: "Mónica Naranjo", song: "Desátame", before: "Desátame, desátame, que me", after: "", answer: ["muero", "me muero"] },
  { artist: "Pastora Soler", song: "Quédate conmigo", before: "Quédate", after: "", answer: ["conmigo"] },
  { artist: "Pastora Soler", song: "Dámelo ya", before: "Dámelo", after: "", answer: ["ya"] },
  { artist: "Rocío Dúrcal", song: "Amor eterno", before: "Como quisiera", after: "", answer: ["poder vivir sin aire"] },
  { artist: "Whitney Houston", song: "I Wanna Dance with Somebody", before: "I wanna dance with somebody,", after: "", answer: ["i wanna feel the heat with somebody"] },
  { artist: "Céline Dion", song: "My Heart Will Go On", before: "Near, far,", after: "", answer: ["wherever you are"] },
  { artist: "Gloria Gaynor", song: "I Will Survive", before: "At first I was afraid,", after: "", answer: ["i was petrified"] },
  { artist: "Tina Turner", song: "The Best", before: "You're simply the best,", after: "", answer: ["better than all the rest"] },
  { artist: "Cher", song: "Believe", before: "Do you believe in", after: "", answer: ["life after love"] },
  { artist: "Gloria Estefan", song: "Conga", before: "Come on, shake your body baby,", after: "", answer: ["do the conga"] },
  { artist: "Beyoncé", song: "Single Ladies", before: "If you liked it, then you should have", after: "", answer: ["put a ring on it"] },
  { artist: "Lady Gaga", song: "Born This Way", before: "Baby,", after: "", answer: ["i was born this way"] },
  { artist: "Madonna", song: "Like a Prayer", before: "Life is a mystery,", after: "", answer: ["everyone must stand alone"] },
];

/** Frases al azar en cada partida. */
export const DECK_SIZE = 10;
export const pickDeck = (): Q[] => [...questions].sort(() => Math.random() - 0.5).slice(0, DECK_SIZE);

export const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-zñ0-9 ]/g, "").replace(/\s+/g, " ").trim();
