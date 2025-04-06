import { useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import AudioPulse from "./components/audio-pulse/AudioPulse";
import cn from "classnames";

// Validate API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("Missing Gemini API Key. Define REACT_APP_GEMINI_API_KEY in your .env file.");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);

  const handleStateChange = (vol: number, isConnected: boolean) => {
    setVolume(vol);
    setConnected(isConnected);
  };

  return (
    <div className="App">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="streaming-console">
          <main className="main-layout">
            
            <header className="chatbot-header">
              <h1 className="brand-title">Chronos<span className="glow">.</span></h1>
              <p className="tagline">Neo-sentient AI Console</p>
            </header>

            <section className="interface-core">
              <Altair />

              <div className="main-audio-pulse-container">
                <AudioPulse volume={volume} active={connected} hover={true} />
              </div>

              <video
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream,
                })}
                ref={videoRef}
                autoPlay
                playsInline
              />
            </section>

            <ControlTray
              videoRef={videoRef}
              supportsVideo={false}
              onVideoStreamChange={setVideoStream}
              onStateChange={handleStateChange}
            />
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
