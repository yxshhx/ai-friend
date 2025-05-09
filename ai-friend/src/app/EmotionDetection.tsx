"use client";
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [objects, setObjects] = useState<cocoSsd.DetectedObject[]>([]);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const loadModel = async () => {
      await tf.ready(); // Ensure TensorFlow.js is initialized
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    setupCamera();
    loadModel();
  }, []);

  useEffect(() => {
    if (!model) return; // Ensure the model is loaded

    const detectObjects = async () => {
      if (videoRef.current && model) {
        try {
          const predictions = await model.detect(videoRef.current);
          setObjects(predictions);
        } catch (error) {
          console.error("Detection error:", error);
        }
      }
      requestAnimationFrame(detectObjects);
    };

    detectObjects();
  }, [model]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay playsInline muted width="640" height="480" className="rounded-lg shadow-lg border" />
      <ul className="mt-4 p-2 bg-gray-200 rounded-lg">
        {objects.map((obj, index) => (
          <li key={index} className="text-lg font-semibold">
            {obj.class} ({Math.round(obj.score * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectDetection;
