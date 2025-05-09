"use client";
import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [objects, setObjects] = useState<cocoSsd.DetectedObject[]>([]);


  useEffect(() => {
    const loadModelAndDetectObjects = async () => {
      await tf.ready();
      const model = await cocoSsd.load();

      if (videoRef.current) {
        const detectObjects = async () => {
          if (videoRef.current) {
            const predictions = await model.detect(videoRef.current);
            setObjects(predictions);
          }
          requestAnimationFrame(detectObjects);
        };

        detectObjects();
      }
    };

    loadModelAndDetectObjects();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
        style={{ borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }}
      />
      <ul>
        {objects.map((obj, index) => (
          <li key={index}>
            {obj.class} ({Math.round(obj.score * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectDetection;
