"use client";
import "regenerator-runtime/runtime";
import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";


export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [chatResponse, setChatResponse] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") return;

    const setupCamera = async () => {
      try {
        console.log("Accessing webcam...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            console.log("Webcam loaded, initializing models...");
            await loadModels();
          };
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("Face API Models Loaded!");
        detectEmotions();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const detectEmotions = async () => {
      if (!videoRef.current) return;
      try {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
        if (detections.length > 0) {
          const emotionsDetected = detections[0].expressions;
          const maxEmotion = Object.entries(emotionsDetected).reduce((a, b) => (a[1] > b[1] ? a : b));
          setEmotions([maxEmotion[0]]);
        } else {
          setEmotions(["No Face Detected"]);
        }
      } catch (error) {
        console.error("Error detecting emotions:", error);
      }
      setTimeout(detectEmotions, 500);
    };

    setupCamera();
  }, []);

  const askAIFriend = async () => {
    if (!transcript) {
      alert("Please speak before asking AI Friend.");
      return;
    }

    console.log("User asked:", transcript);

    try {
      console.log("Sending request to AI...");
      const res = await fetch("/api/askAIFriend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: transcript }),
      });
      const data = await res.json();
      console.log("API Response:", data);
      setChatResponse(data.response || "No valid response from AI Friend.");
    } catch (error) {
      console.error("Error calling AI:", error);
      setChatResponse("Error getting response.");
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  useEffect(() => {
    if (chatResponse) {
      const utterance = new SpeechSynthesisUtterance(chatResponse);
      utterance.lang = "ja-JP";
      speechSynthesis.speak(utterance);
    }
  }, [chatResponse]);

  if (!isClient) return null;
  if (!browserSupportsSpeechRecognition) return <p>Speech recognition is not supported in this browser.</p>;

 
  function Model() {
    const { scene } = useGLTF("/models/model.glb"); 
    return <primitive object={scene} scale={1} />;
  }
  

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", background: "linear-gradient(to right, #000428, #004e92)", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ position: "absolute", top: "20px", right: "20px", fontSize: "24px" }}>AI Friend</h1>
      
      {/*  Background Music */}
      <audio autoPlay loop>
        <source src="/bg-music.mp3"type="audio/mp3" />
      </audio>
     

      <div style={{ width: "100%", height: "100%", marginTop: "0px" }}>
        <Canvas camera={{ zoom: 4.5, position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <Model />
          <OrbitControls />
        </Canvas>
      </div>
      
      <button style={{ position: "absolute", top: "300px", left: "30px", padding: "10px 20px", margin: "10px", background: "#1e3c72", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={startListening}>
        {listening ? "Listening..." : "Start Voice Input"}
      </button>

      <p style={{ position: "absolute", top: "350px", left: "40px", fontSize: "18px", maxWidth: "300px", wordWrap: "break-word", textAlign: "left" }}>
        Speech Input: {transcript}
      </p>

      <button style={{ position: "absolute", bottom: "28px", left: "475px", padding: "10px 20px", textAlign: "left", margin: "10px", background: "#1e3c72", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={askAIFriend}>
        Ask Friend
      </button>

      <p style={{ position: "absolute", bottom: "20px", left: "650px", fontSize: "18px", maxWidth: "300px", wordWrap: "break-word", textAlign: "left", backgroundColor: "#2A2A2A", color: "#fff", padding: "10px 15px", borderRadius: "18px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
        Friend Response: {chatResponse}
      </p>

      <h2 style={{ position: "absolute", top: "30px", left: "40px", fontSize: "10px", maxWidth: "300px", wordWrap: "break-word", textAlign: "left" }}>Detected Emotions:</h2>
      {emotions.length > 0 ? emotions.map((emotion, index) => <p key={index} style={{ position: "absolute", top: "40px", left: "40px", fontSize: "9px", maxWidth: "300px", wordWrap: "break-word", textAlign: "left" }}>{emotion}</p>) : <p style={{ position: "absolute", top: "80px", left: "40px", fontSize: "18px", maxWidth: "300px", wordWrap: "break-word", textAlign: "left" }}>No emotions detected.</p>}

      <video ref={videoRef} autoPlay playsInline style={{ transform: "scaleX(-1)", position: "absolute", bottom: "10px", right: "10px", width: "300px", height: "200px", objectFit: "cover", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}></video>
    </div>
  );
}

