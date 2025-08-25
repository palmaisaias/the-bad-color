import { useEffect, useMemo, useRef, useState } from "react";

// --- Quick setup notes -------------------------------------------------------
// 1) Drop your PNGs (image1.png, image2.png, ...) and your MP4 into the same
//    directory that hosts this file OR adjust the src paths below.
// 2) Replace the placeholder poster.jpg with a real poster if you have one.
// 3) All story text came from your PDF. You can edit the `stories` array.
// 4) No Tailwind. Pure CSS with variables and some tasteful animations.
// -----------------------------------------------------------------------------

export default function App() {
  const routes = {
    home: "#/",
    screening: "#/screening",
  } as const;

  const [route, setRoute] = useState(window.location.hash || routes.home);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || routes.home);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="village-root">
      <HeadTags />
      <StyleBlock />
      {(!route || route === routes.home || route === "#") && <TalesPage />}
      {route === routes.screening && <ScreeningPage />}
    </div>
  );
}

function HeadTags() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet"
      />
      <title>Tales of the Village</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}

function StyleBlock() {
  return (
    <style>{`
      :root {
        --bg: #0c0b09;
        --bg-2: #12110d;
        --paper: #1b1a14;
        --ink: #eadfca;
        --muted: #c8b999;
        --accent: #c4a13a;
        --accent-2: #7d3a1f;
        --accent-3: #355b3a; /* subtle pine */
        --ring: rgba(196, 161, 58, 0.35);
        --shadow: rgba(0,0,0,0.35);
        --radius: 18px;
        --radius-lg: 26px;
        --gap: clamp(14px, 2.1vw, 24px);
        --pad: clamp(16px, 2.8vw, 36px);
        --headline: 'Cinzel', serif;
        --display: 'IM Fell English', serif;
        --body: 'Crimson Text', serif;
      }

      * { box-sizing: border-box; }
      html, body, #root { height: 100%; }
      body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--body); }
      .village-root { min-height: 100vh; position: relative; }

      /* Background texture and vignette */
      .village-root::before {
        content: "";
        position: fixed; inset: 0; pointer-events: none;
        background: radial-gradient(120% 90% at 50% 10%, rgba(255,221,130,0.08), transparent 55%),
                    radial-gradient(100% 60% at 50% 120%, rgba(0,0,0,0.6), rgba(0,0,0,0.9));
        z-index: -2;
      }
.village-root::after {
  /* keep the texture inside the viewport */
  inset: 0;               /* was: -50% -50% */
  background: repeating-radial-gradient(circle at 20% 30%,
    rgba(255,255,255,0.02), rgba(255,255,255,0.02) 2px,
    transparent 3px, transparent 6px);
  filter: contrast(120%) brightness(90%);
  animation: grain 14s steps(10) infinite;
}
      @keyframes grain { 0% { transform: translate(0,0);} 100% { transform: translate(10px, -12px);} }

      .frame {
        max-width: 1200px; margin: 0 auto; padding: calc(var(--pad) + 8px) var(--pad);
      }

      .titlebar {
        display: flex; align-items: center; justify-content: space-between;
        gap: var(--gap); margin-bottom: calc(var(--pad) * 0.6);
      }
      .brand {
        display: flex; align-items: center; gap: 14px;
      }
      .brand-badge {
        width: 42px; height: 42px; border-radius: 50%;
        background: conic-gradient(from 220deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent));
        box-shadow: 0 8px 22px var(--shadow), inset 0 0 0 2px rgba(0,0,0,.5);
        position: relative;
      }
      .brand-badge::after {
        content: ""; position: absolute; inset: 5px; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.02));
        mix-blend-mode: screen; filter: blur(0.2px);
      }
      .brand-title { font-family: var(--display); font-size: clamp(24px, 3.6vw, 40px); letter-spacing: 0.5px; }
      .brand-sub { opacity: 0.7; font-size: 14px; }

      .btn {
        --h: 44px;
        height: var(--h); padding: 0 18px; border-radius: var(--radius);
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(180deg, rgba(255,245,220,0.08), rgba(0,0,0,0.12));
        color: var(--ink); cursor: pointer;
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        box-shadow: 0 2px 10px var(--shadow), inset 0 0 0 1px rgba(255,255,255,0.06);
        font-family: var(--headline); letter-spacing: 0.4px;
      }
      .btn:hover { transform: translateY(-1px); border-color: var(--ring); box-shadow: 0 6px 22px var(--shadow), 0 0 0 3px var(--ring); }
      .btn:active { transform: translateY(0); }

      .card {
        background: linear-gradient(180deg, rgba(255,240,200,0.03), rgba(0,0,0,0.25)), var(--paper);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 26px var(--shadow), inset 0 0 0 1px rgba(255,255,255,0.03);
        overflow: hidden;
      }

      .hero {
        display: grid; grid-template-columns: 1fr; gap: var(--gap); align-items: center;
      }
      .hero h1 {
        font-family: var(--headline); font-weight: 700; font-size: clamp(28px, 5vw, 56px);
        line-height: 1.05; margin: 0 0 6px 0;
        text-shadow: 0 2px 0 rgba(0,0,0,0.4);
      }
      .hero p { margin: 0; opacity: 0.8; max-width: 70ch; }

      /* Carousel layout */
      .carousel {
        position: relative; overflow: clip; display: grid; grid-template-columns: 1fr 1fr;
        min-height: 420px;
      }
      @media (max-width: 860px) {
        .carousel { grid-template-columns: 1fr; }
      }

      .slide-media { position: relative; }
      .slide-media img {
        width: 100%; height: 100%; object-fit: cover; display: block;
        transform: scale(1.015);
        animation: slow-pan 14s ease-in-out infinite alternate;
      }
      @keyframes slow-pan { from { transform: scale(1.015) translateX(0); } to { transform: scale(1.06) translateX(-6px); } }

      .slide-text {
        padding: clamp(18px, 2.6vw, 34px); display: flex; flex-direction: column; gap: 10px;
      }
      .slide-text h3 { font-family: var(--headline); font-size: clamp(20px, 2.6vw, 28px); margin: 0; color: var(--muted); letter-spacing: 0.4px; }
      .slide-text h2 { font-family: var(--display); font-size: clamp(26px, 3.2vw, 38px); margin: 4px 0 6px; color: var(--ink); }
      .slide-text p { line-height: 1.5; font-size: clamp(16px, 2vw, 18px); opacity: 0.92; }

      .controls {
        position: absolute; inset: auto 0 0; display: flex; align-items: center; justify-content: space-between;
        padding: 10px; gap: 10px; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.4));
      }
      .pill {
        display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px;
        background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08);
        font-family: var(--headline);
      }

      .dots { display: inline-flex; gap: 8px; }
      .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.35); border: 1px solid rgba(255,255,255,0.2); }
      .dot.is-active { background: var(--accent); box-shadow: 0 0 0 2px var(--ring); }

      .link-enter {
        display: inline-block; margin-top: 18px; text-decoration: none; color: var(--ink);
        border-bottom: 1px solid rgba(255,255,255,0.25);
      }
      .link-enter:hover { color: var(--muted); border-bottom-color: var(--accent); }

      /* Screening page */
      .screening-wrap { display: grid; gap: var(--gap); }
      .screening-head { display: flex; align-items: center; justify-content: space-between; gap: var(--gap); }
      .screening-title { font-family: var(--headline); margin: 0; font-size: clamp(24px, 4vw, 40px); }

      .video-shell {
        position: relative; border-radius: var(--radius-lg); overflow: hidden; isolation: isolate;
        background: radial-gradient(120% 140% at 30% 10%, rgba(250,230,165,0.05), rgba(0,0,0,0.7));
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 18px 40px var(--shadow), inset 0 0 0 1px rgba(255,255,255,0.04);
      }
      .video-shell::after {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(60% 40% at 80% 0%, rgba(195,161,58,0.10), transparent 60%);
        mix-blend-mode: screen;
      }
      video { width: 100%; height: auto; display: block; }

      .footer {
        display: grid; place-items: center; padding: 30px 10px; opacity: 0.7; font-size: 14px;
      }
    `}</style>
  );
}

function TalesPage() {
  const stories = useMemo(() => [
    {
      id: 1,
      image: "image1.png",
      label: "Diana",
      title: "The Mother in Mourning",
      text: `Her love for music and lavender was eclipsed when her husband Edward was killed in a senseless act of violence during a late-night store robbery. She was left holding their 7-month-old son, Vincent, knowing he would grow up never hearing his father's voice. Overwhelmed by grief and the ugliness of the world, she became one of the first to believe that a village could be built away from it all, where children could grow in safety and innocence.`,
    },
    {
      id: 2,
      image: "image2.png",
      label: "Edgar",
      title: "The Father Who Lost His Place in the World",
      text: `Edgar loved puzzles and logic, always finding structure where others saw chaos. A workplace shooting took the lives of colleagues he had spent years beside. He survived, but could never sit at a desk without hearing echoes of gunfire. With Alexander, his young son, he turned to the village, believing it to be the only place left where order and peace could endure.`,
    },
    {
      id: 3,
      image: "image3.png",
      label: "Gammy",
      title: "The Outdoorsman Shattered",
      text: `Strong, devoted, and happiest near rivers and trees, Gammy's world collapsed when his fiancée Tiffany was murdered during a break-in while he was away fishing. His dog River was the only survivor. Unable to bear the violence and unpredictability of civilization, he threw himself into building the new village, insisting that nature itself could shelter them better than the world ever had.`,
    },
    {
      id: 4,
      image: "image4.png",
      label: "Ely",
      title: "The Devoted Husband",
      text: `Ely loved Padres games, poker nights, and Vegas trips, but what mattered most was his faith and his wife Becca. After mass one evening, a gunman opened fire outside the church. Ely held her as she died, whispering Latin prayers. His devotion to her memory, and his disgust with a world where even sacred places are not safe, drove him to help found the village.`,
    },
    {
      id: 5,
      image: "image5.png",
      label: "Gregorio",
      title: "The Healer Who Couldn't Save",
      text: `Gregorio worked tirelessly between school and his job, dreaming of healing others. When a robbery turned violent at a market, his closest friend was shot. Gregorio tried to stop the bleeding, but could not save him. He realized the violence of the outside world was a wound no medicine could cure and became convinced the only healing was to leave that world behind.`,
    },
    {
      id: 6,
      image: "image6.png",
      label: "Raquel",
      title: "The Dreamer Destroyed",
      text: `Bright and spirited, Raquel loved color, beauty, and self-expression. A night out with friends turned to tragedy when she was assaulted walking to her car. She survived, but the lightness she carried was replaced by silence and fear. She followed her siblings to the village, hoping to create a place where innocence and joy are kept safe.`,
    },
    {
      id: 7,
      image: "image7.png",
      label: "Rebecca",
      title: "The Seeker of Truth",
      text: `Rebecca's obsession with crime stories was a search for understanding. When her closest confidant was found to be a victim of a serial killer, grief consumed her. The crime podcasts she once enjoyed became unbearable reminders of cruelty. She turned to the village, convinced that by erasing the memory of such violence, truth and safety could return.`,
    },
    {
      id: 8,
      image: "image8.png",
      label: "Mia",
      title: "The Youngest, the Bohemian Spirit",
      text: `Mia loved the Beatles, daisies, and her little dog Pooka. One night, two men attacked her and killed Pooka. Though she survived, the cruelty broke the idea that kindness had a place in the world. She followed her siblings into the village, carrying the image of Pooka and a vow that no child in their new home would know that kind of cruelty.`,
    },
  ], []);

  return (
    <main className="frame">
      <header className="titlebar">
        <div className="brand">
          <div className="brand-badge" aria-hidden />
          <div>
            <div className="brand-title">Tales of the Village</div>
            <div className="brand-sub">Stories of why the walls were raised</div>
          </div>
        </div>
        <a className="btn" href="#/screening" aria-label="Enter the Village">
          Enter the Village
        </a>
      </header>

      <section className="hero card" style={{padding: "var(--pad)"}}>
        <div>
          <h1>Listen. The forest keeps secrets.</h1>
          <p>
            When you are ready, enter the village to begin the screening...
          </p>
        </div>
      </section>

      <section aria-label="Tales carousel" style={{marginTop: "var(--pad)"}}>
        <Carousel items={stories} />
        <div className="footer">
          <a className="link-enter" href="#/screening">enter the Village</a>
        </div>
      </section>
    </main>
  );
}

function Carousel({ items }: { items: { id: number; image: string; label: string; title: string; text: string }[] }) {
  const [index, setIndex] = useState(0);
  const len = items.length;
  const clamp = (n: number) => (n + len) % len;
  const go = (dir: number) => setIndex((i) => clamp(i + dir));

  // keyboard support
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="card" tabIndex={0} ref={wrapRef} aria-roledescription="carousel">
      <CarouselViewport index={index} items={items} />
      <div className="controls">
        <button className="btn" onClick={() => go(-1)} aria-label="Previous story">◀︎</button>
        <div className="pill" aria-live="polite">
          <span>{items[index].label}</span>
          <span style={{opacity:.6}}>•</span>
          <span>{index + 1} / {len}</span>
        </div>
        <button className="btn" onClick={() => go(1)} aria-label="Next story">▶︎</button>
      </div>
      <div style={{display:"flex", justifyContent:"center", padding:"10px 0 16px"}}>
        <div className="dots" aria-hidden>
          {items.map((_, i) => (
            <span key={i} className={`dot ${i===index ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselViewport({ index, items }:{ index:number; items:{ id:number; image:string; label:string; title:string; text:string }[] }) {
  // We animate by shifting a 100% width track. Because slides have complex layout
  // (image left, text right), we render only the active item for simplicity.
  const active = items[index];
  return (
    <div className="carousel" role="group" aria-label={`${active.label}: ${active.title}`}>
      <div className="slide-media">
        <img src={active.image} alt={`${active.label} — illustration`} />
      </div>
      <div className="slide-text">
        <h3>{active.label}</h3>
        <h2>{active.title}</h2>
        <p>{active.text}</p>
      </div>
    </div>
  );
}

function ScreeningPage() {
  return (
    <main className="frame">
      <header className="screening-head">
        <h1 className="screening-title">The Village Screening Room</h1>
        <a className="btn" href="#/">Back to Tales</a>
      </header>

      <section className="video-shell" style={{marginTop: "8px"}}>
        <video
          controls
          preload="metadata"
          poster="poster.jpg"
          src="village.mp4"
        >
          Sorry, your browser does not support the video element.
        </video>
      </section>

      <div className="footer">Bring your own candlelight.</div>
    </main>
  );
}
