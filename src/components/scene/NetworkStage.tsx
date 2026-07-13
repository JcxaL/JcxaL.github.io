"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/stage/types";

/**
 * NetworkStage — the 3D plane of the Layer Model (CHARTER §2): an abstract
 * "network in space" (wireframe icosahedron + station points) that slowly
 * orbits. Loaded only via StageMount, which code-splits it (next/dynamic,
 * ssr:false) and mounts it only when stageEnabled() — so it never touches the
 * initial bundle or the no-WebGL / reduced-motion / SSR paths. Rotation also
 * checks reduced-motion per-frame as a live backstop.
 */
function NetworkSphere() {
  const group = useRef<THREE.Group>(null);
  const base = useMemo(() => new THREE.IcosahedronGeometry(2, 1), []);
  const wire = useMemo(() => new THREE.WireframeGeometry(base), [base]);

  useFrame((_, delta) => {
    if (group.current && !prefersReducedMotion()) {
      group.current.rotation.y += delta * 0.15;
      group.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color="#ffb000" transparent opacity={0.4} />
      </lineSegments>
      <points geometry={base}>
        <pointsMaterial color="#38bdf8" size={0.1} sizeAttenuation />
      </points>
    </group>
  );
}

export default function NetworkStage() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ height: 340, width: "100%" }}
    >
      <NetworkSphere />
    </Canvas>
  );
}
