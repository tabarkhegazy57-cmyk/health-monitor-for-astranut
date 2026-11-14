import { CameraControls, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import type { BodyRegionId } from "@/types/domain";

import { ActiveBodyModel } from "./active-model";
import { DEFAULT_VIEW, REGION_VIEWS } from "./camera-presets";
import type { BodyViewerApi } from "./types";

function Rig({
  autoRotate,
  onApi,
  onFirstFrame,
}: {
  autoRotate: boolean;
  onApi: (api: BodyViewerApi) => void;
  onFirstFrame: () => void;
}) {
  const controls = useRef<CameraControls>(null);
  const drawn = useRef(false);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.setLookAt(...DEFAULT_VIEW.position, ...DEFAULT_VIEW.target, false);
    onApi({
      zoomIn: () => void c.dolly(0.45, true),
      zoomOut: () => void c.dolly(-0.45, true),
      rotate: (d) => void c.rotate(d * (Math.PI / 4), 0, true),
      reset: () => void c.setLookAt(...DEFAULT_VIEW.position, ...DEFAULT_VIEW.target, true),
      focus: (id) => {
        const v = id ? REGION_VIEWS[id] : DEFAULT_VIEW;
        void c.setLookAt(...v.position, ...v.target, true);
      },
    });
  }, [onApi]);

  useFrame((_, delta) => {
    if (!drawn.current) {
      drawn.current = true;
      onFirstFrame();
    }
    if (autoRotate && controls.current) {
      controls.current.azimuthAngle += Math.min(delta, 0.05) * 0.35;
    }
  });

  return (
    <CameraControls
      ref={controls}
      minDistance={1}
      maxDistance={5}
      smoothTime={0.35}
      minPolarAngle={0.25}
      maxPolarAngle={Math.PI - 0.35}
    />
  );
}

export default function BodyScene({
  selected,
  onSelect,
  autoRotate,
  onApi,
}: {
  selected: BodyRegionId | null;
  onSelect: (id: BodyRegionId | null) => void;
  autoRotate: boolean;
  onApi: (api: BodyViewerApi) => void;
}) {
  const [hovered, setHovered] = useState<BodyRegionId | null>(null);
  const [ready, setReady] = useState(false);

  return (
    <div className="absolute inset-0" data-scene-ready={ready ? "true" : undefined}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 35, position: DEFAULT_VIEW.position, near: 0.1, far: 50 }}
        onPointerMissed={() => onSelect(null)}
        aria-label="Interactive 3D human body model"
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#cfeee4" />
        <Environment resolution={128}>
          <Lightformer intensity={1.6} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.9} color="#bfe9dc" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
          <Lightformer intensity={0.7} color="#ffd9cc" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
        </Environment>
        <ActiveBodyModel selected={selected} hovered={hovered} onSelect={(id) => onSelect(id)} onHover={setHovered} />
        <ContactShadows position={[0, -0.9, 0]} opacity={0.35} scale={3} blur={2.4} far={1.2} color="#2b5a57" />
        <mesh position={[0, -0.905, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.45, 0.47, 64]} />
          <meshBasicMaterial color="#4f9a94" transparent opacity={0.35} />
        </mesh>
        <Rig autoRotate={autoRotate} onApi={onApi} onFirstFrame={() => setReady(true)} />
      </Canvas>
    </div>
  );
}
