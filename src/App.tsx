import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { stories } from "./data/stories";

/** simple hash router to work perfectly on static hosts */
type Route = "#/" | "#/screening";
const HOME: Route = "#/";
const SCREEN: Route = "#/screening";

export default function App() {
  const [route, setRoute] = useState<Route>((window.location.hash as Route) || HOME);

  useEffect(() => {
    const onHash = () => setRoute((window.location.hash as Route) || HOME);
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = HOME;
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <Container fluid className="v-frame">
      {route === HOME && <TalesPage onEnter={() => (window.location.hash = SCREEN)} />}
      {route === SCREEN && <ScreeningPage onBack={() => (window.location.hash = HOME)} />}
    </Container>
  );
}

/** utility: pause every <audio> on the page */
function pauseAllAudio() {
  document.querySelectorAll<HTMLAudioElement>("audio").forEach(a => {
    try { a.pause(); } catch {}
  });
}

function Brand() {
  return (
    <Row className="align-items-center mb-3 g-3">
      <Col xs="auto">
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: `conic-gradient(from 220deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))`,
          boxShadow: "0 8px 22px var(--shadow), inset 0 0 0 2px rgba(0,0,0,.5)",
          position: "relative"
        }}>
          <div style={{
            position:"absolute", inset:5, borderRadius:"50%",
            background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,.35), rgba(255,255,255,.02))",
            mixBlendMode:"screen", filter:"blur(.2px)"
          }}/>
        </div>
      </Col>
      <Col>
        <div className="v-brand-title" style={{ fontSize: "clamp(24px,3.6vw,40px)" }}>
          Tales of the Village
        </div>
        <div className="v-brand-sub text-muted-village">
          Stories of why the walls were raised
        </div>
      </Col>
      <Col xs="auto" className="ms-auto d-none d-md-block">
        <Button className="btn-village" href="#/screening">Enter the Village</Button>
      </Col>
    </Row>
  );
}

function TalesPage({ onEnter }: { onEnter: () => void }) {
  // Controlled carousel index so we can pause audio on slide change
  const [active, setActive] = useState(0);

  // Pause any playing audio when this page unmounts
  useEffect(() => {
    return () => pauseAllAudio();
  }, []);

  const handleSelect = (next: number) => {
    setActive(next);
    pauseAllAudio();
  };

  return (
    <>
      <Brand />

      <section className="v-card p-4 mb-4 text-center">
        <h1 className="v-h1 mb-2">Listen. The forest keeps secrets.</h1>
        <p className="mx-auto mb-0" style={{ maxWidth: "70ch", opacity: .85 }}>
          When you are ready, enter the village to begin the screening.
        </p>
      </section>

      <section className="v-card v-carousel">
        <Carousel interval={null} indicators activeIndex={active} onSelect={handleSelect}>
          {stories.map((s, i) => (
            <Carousel.Item key={i}>
              <Row className="align-items-stretch g-3">
                <Col md={6}>
                  <img src={s.image} alt={`${s.label} — illustration`} className="v-img" />
                </Col>
                <Col md={6} className="v-text d-flex flex-column justify-content-center p-3 p-md-4">
                  <div className="text-muted-village" style={{ fontFamily: "var(--headline)" }}>{s.label}</div>
                  <h2 className="v-h2 h3 mt-1 mb-2">{s.title}</h2>

                  {/* preserve manual line breaks if you use template literals */}
                  <p className="mb-2" style={{ lineHeight: 1.55, whiteSpace: "pre-line" }}>{s.text}</p>

                  {/* Optional audio player. You can add `audio: "audio/xyz.mp3"` per story. */}
                  {"audio" in s && (s as any).audio && (
                    <audio
                      controls
                      preload="none"
                      // attach src only for the active slide to save bandwidth on mobile
                      src={active === i ? (s as any).audio : undefined}
                      className="w-100"
                      style={{ borderRadius: 8 }}
                    />
                  )}
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="text-center py-3">
          <a className="v-link" href="#/screening" onClick={(e)=>{e.preventDefault(); pauseAllAudio(); onEnter();}}>
            enter the Village
          </a>
        </div>
      </section>
    </>
  );
}

function ScreeningPage({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    // ensure nothing keeps playing if user jumped here mid-track
    pauseAllAudio();
  }, []);

  return (
    <>
      <Row className="align-items-center mb-3 g-3">
        <Col xs="auto">
          <Button className="btn-village" onClick={() => { pauseAllAudio(); onBack(); }}>
            Back to Tales
          </Button>
        </Col>
        <Col className="text-center">
          <h1 className="v-h1 m-0">The Village Screening Room</h1>
        </Col>
        <Col xs="auto" />
      </Row>

      <section className="v-video p-2">
        <div className="ratio ratio-16x9">
          <video
            controls
            preload="metadata"
            poster="https://ih1.redbubble.net/image.1141507787.8988/flat,750x,075,f-pad,750x1000,f8f8f8.u2.jpg"
            src="https://the-bad-color.sfo3.cdn.digitaloceanspaces.com/red%20is%20bad.mp4"
          />
        </div>
      </section>

      <div className="text-center" style={{ opacity: .75, padding: "20px 10px" }}>
        Bring your own candlelight.
      </div>
    </>
  );
}