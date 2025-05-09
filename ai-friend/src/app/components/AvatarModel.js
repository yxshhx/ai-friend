"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
    const modelRef = useRef();
    const { scene } = useGLTF("/models/avatar.glb");

    return <primitive ref={modelRef} object={scene} scale={1.5} position={[0, -1, 0]} />;
}

export default function AvatarModel() {
    return (
        <Canvas
            camera={{ position: [0, 1, 3], fov: 50 }}
            style={{ width: "100vw", height: "100vh" }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 2, 5]} intensity={1} />
            <Model />
            <OrbitControls />
        </Canvas>
    );
}
