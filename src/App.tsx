import { useEffect, useRef, useState } from "react";
import { Microphone, ArrowRight, ArrowCounterClockwise, Crown, Heart, Lightbulb, Timer, PencilSimple } from "@phosphor-icons/react";
import { pickDeck, norm } from "./questions";

const TIME = 25; // segundos por frase
const LIVES = 3;

export default function App() {
  const [deck, setDeck] = useState(pickDeck);
  const [step, setStep] = useState(0); // 0 = entrada, 1..n = preguntas, n+1 = final
  const [points, setPoints] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [time, setTime] = useState(TIME);
  const [text, setText] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<null | "ok" | "ko">(null);
  const input = useRef<HTMLInputElement>(null);
  const n = deck.length;
  const over = lives === 0;

  const q = deck[step - 1];
  const playing = step >= 1 && step <= n && !result;

  // cuenta atrás
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [playing, step]);

  useEffect(() => {
    if (playing && time <= 0) fail();
  }, [time]); // eslint-disable-line

  useEffect(() => { if (playing) input.current?.focus(); }, [step]); // eslint-disable-line

  function fail() {
    setResult("ko");
    setLives((l) => l - 1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!playing || !text.trim()) return;
    if (q.answer.some((a) => norm(a) === norm(text))) {
      setResult("ok");
      setPoints((p) => p + Math.round((100 + time * 4) / (hint ? 2 : 1)));
    } else fail();
  }

  function next() {
    setStep(over || step === n ? n + 1 : step + 1);
    setText(""); setHint(false); setResult(null); setTime(TIME);
  }

  function restart() {
    setDeck(pickDeck()); setStep(0); setPoints(0); setLives(LIVES); setText(""); setHint(false); setResult(null); setTime(TIME);
  }

  if (step === 0)
    return (
      <main className="stage">
        <article className="ticket" aria-label="Entrada Fila Cero para Irina">
          <div className="ticket-main">
            <p className="eyebrow">Pastora Soler Experience</p>
            <h1>Fila<br />Cero</h1>
            <p className="lead">Primera fila para Irina. El mejor sitio de la sala es tuyo.</p>
            <dl className="meta">
              <div><dt>Para</dt><dd>Irina</dd></div>
              <div><dt>Día</dt><dd>15</dd></div>
              <div><dt>Fila</dt><dd>0</dd></div>
            </dl>
            <button className="cta" onClick={() => setStep(-1)}>
              <Microphone size={20} weight="fill" aria-hidden="true" /> Entrar
            </button>
          </div>
          <div className="ticket-stub" aria-hidden="true">
            <div className="barcode" />
            <span>N.º 0015</span>
          </div>
        </article>
      </main>
    );

  if (step === -1)
    return (
      <main className="stage">
        <section className="panel">
          <p className="eyebrow">Antes de salir al escenario</p>
          <h2>Completa los himnos</h2>
          <p className="lead">
            Te daremos un verso de una canción de una gran diva (Pastora Soler, Mónica Naranjo, Rocío Jurado, Whitney, Céline y más) con un hueco.
            Escribe lo que falta y adivina de qué canción es.
          </p>
          <ul className="rules">
            <li><PencilSimple size={22} aria-hidden="true" /><span>Escribe la palabra o palabras que faltan. Las tildes y mayúsculas no importan.</span></li>
            <li><Timer size={22} aria-hidden="true" /><span>Tienes {TIME} segundos por frase. Cuanto antes aciertes, más puntos.</span></li>
            <li><Heart size={22} aria-hidden="true" /><span>Tienes {LIVES} vidas. Cada fallo o tiempo agotado quita una.</span></li>
            <li><Lightbulb size={22} aria-hidden="true" /><span>Una pista enseña las iniciales, pero la frase vale la mitad.</span></li>
          </ul>
          <button className="cta" onClick={() => setStep(1)}>
            Empezar <ArrowRight size={20} aria-hidden="true" />
          </button>
        </section>
      </main>
    );

  if (step > n)
    return (
      <main className="stage">
        <section className="panel">
          <Crown size={40} weight="fill" className="accent" aria-hidden="true" />
          <h1 className="score">{points}<span> puntos</span></h1>
          <p className="lead">
            {over ? "Sin vidas. El público pide bis."
              : points >= n * 150 ? "Diva total. Fila cero merecida."
              : "Terminaste el concierto. Aún hay margen de bis."}
          </p>
          <button className="cta" onClick={restart}>
            <ArrowCounterClockwise size={20} aria-hidden="true" /> Otra vez
          </button>
        </section>
      </main>
    );

  const words = q.answer[0].split(" ");
  const hintText = words.map((w) => w[0] + "_".repeat(w.length - 1)).join(" ");

  return (
    <main className="stage">
      <form className="panel" onSubmit={submit}>
        <div className="topbar">
          <span className="eyebrow">{step} de {n}. {q.artist}</span>
          <span className="lives" aria-label={`${lives} vidas`}>
            {Array.from({ length: LIVES }, (_, i) => (
              <Heart key={i} size={22} weight={i < lives ? "fill" : "regular"} className={i < lives ? "accent" : "dim"} aria-hidden="true" />
            ))}
          </span>
        </div>

        <div className="timer" role="timer" aria-label={`${time} segundos`}>
          <i style={{ transform: `scaleX(${Math.max(time, 0) / TIME})` }} className={time <= 5 ? "low" : ""} />
        </div>

        <p className="song">{result ? `Canción: ${q.song}` : "¿De qué canción es? Adivínala."}</p>
        <h2>“{q.before} <u>{result ? q.answer[0] : "_____"}</u> {q.after}”</h2>

        {!result ? (
          <>
            <label className="field">
              <span>Completa la frase</span>
              <input ref={input} value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} />
            </label>
            {hint && <p className="hint">Pista: {hintText} (vale la mitad)</p>}
            <div className="row">
              <button type="submit" className="cta">Cantar <ArrowRight size={20} aria-hidden="true" /></button>
              {!hint && (
                <button type="button" className="ghost" onClick={() => { setHint(true); input.current?.focus(); }}>
                  <Lightbulb size={20} aria-hidden="true" /> Pista
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className={"verdict " + result} role="status">
              {result === "ok" ? "Perfecto. Sumas puntos." : time <= 0 ? "Se acabó el tiempo. Pierdes una vida." : "Esa no es. Pierdes una vida."}
            </p>
            <button type="button" className="cta" onClick={next}>
              {over || step === n ? "Ver resultado" : "Siguiente"} <ArrowRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
        <p className="pts">{points} puntos</p>
      </form>
    </main>
  );
}
