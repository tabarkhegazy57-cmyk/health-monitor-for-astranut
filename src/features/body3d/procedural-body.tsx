import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import * as THREE from "three";

import type { BodyRegionId } from "@/types/domain";

import type { BodyModelProps } from "./types";

/** Material palette mirrors the app tokens (teal / mint / soft white). */
const COLORS = {
  base: new THREE.Color("#e9f1ee"),
  hover: new THREE.Color("#c4e6da"),
  selected: new THREE.Color("#2f7f7a"),
  dimmed: new THREE.Color("#dfe7e4"),
};

function Capsule({ r, len, position, rotation, scale }: { r: number; len: number; position: [number, number, number]; rotation?: [number, number, number] | undefined; scale?: [number, number, number] | undefined }) {
  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]} scale={scale ?? [1, 1, 1]} castShadow>
      <capsuleGeometry args={[r, len, 8, 20]} />
      <RegionMaterial />
    </mesh>
  );
}

// Each region's meshes share one material provided by the enclosing RegionGroup.
const RegionMaterialContext = createContext<THREE.Material | null>(null);
function RegionMaterial() {
  const material = useContext(RegionMaterialContext);
  return material ? <primitive object={material} attach="material" /> : null;
}

function RegionGroup({
  id,
  props,
  children,
}: {
  id: BodyRegionId;
  props: BodyModelProps;
  children: ReactNode;
}) {
  const { selected, hovered, onSelect, onHover } = props;
  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({ roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.5 }),
    [],
  );
  const isSelected = selected === id;
  const isHovered = hovered === id;
  const color = isSelected ? COLORS.selected : isHovered ? COLORS.hover : selected ? COLORS.dimmed : COLORS.base;
  material.color.copy(color);
  material.emissive.copy(isSelected ? COLORS.selected : COLORS.base);
  material.emissiveIntensity = isSelected ? 0.18 : 0;

  return (
    <group
      name={`region-${id}`}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <RegionMaterialContext.Provider value={material}>{children}</RegionMaterialContext.Provider>
    </group>
  );
}

/**
 * Stylised, anatomically simplified figure built from primitives so each
 * region is its own selectable group. Replaceable via `active-model.ts`.
 */
export function ProceduralBody(props: BodyModelProps) {
  useCursor(props.hovered !== null);
  const sides = [-1, 1] as const;

  return (
    <group position={[0, -0.9, 0]}>
      <RegionGroup id="head" props={props}>
        <>
            <mesh position={[0, 1.63, 0]} scale={[0.9, 1.08, 0.95]} castShadow>
              <sphereGeometry args={[0.115, 40, 32]} />
              <RegionMaterial />
            </mesh>
            <Capsule r={0.048} len={0.06} position={[0, 1.48, 0]} />
        </>
      </RegionGroup>

      <RegionGroup id="chest" props={props}>
        <>
            <Capsule r={0.16} len={0.2} position={[0, 1.27, 0]} scale={[1.3, 1, 0.72]} />
            {sides.map((s) => (
              <mesh key={s} position={[s * 0.21, 1.375, 0]} castShadow>
                <sphereGeometry args={[0.068, 24, 20]} />
                <RegionMaterial />
              </mesh>
            ))}
        </>
      </RegionGroup>

      <RegionGroup id="abdomen" props={props}>
        <>
            <Capsule r={0.135} len={0.12} position={[0, 1.02, 0]} scale={[1.15, 1, 0.72]} />
            <mesh position={[0, 0.87, 0]} scale={[1.32, 0.72, 0.85]} castShadow>
              <sphereGeometry args={[0.13, 32, 24]} />
              <RegionMaterial />
            </mesh>
        </>
      </RegionGroup>

      <RegionGroup id="arms" props={props}>
        <>
            {sides.map((s) => (
              <group key={s}>
                <Capsule r={0.052} len={0.24} position={[s * 0.27, 1.2, 0]} rotation={[0, 0, s * 0.12]} />
                <Capsule r={0.044} len={0.22} position={[s * 0.31, 0.92, 0.015]} rotation={[0, 0, s * 0.05]} />
                <mesh position={[s * 0.325, 0.75, 0.02]} scale={[0.8, 1.15, 0.55]} castShadow>
                  <sphereGeometry args={[0.05, 20, 16]} />
                  <RegionMaterial />
                </mesh>
              </group>
            ))}
        </>
      </RegionGroup>

      <RegionGroup id="legs" props={props}>
        <>
            {sides.map((s) => (
              <group key={s}>
                <Capsule r={0.078} len={0.34} position={[s * 0.095, 0.6, 0]} rotation={[0, 0, s * -0.03]} />
                <Capsule r={0.058} len={0.34} position={[s * 0.105, 0.2, -0.005]} />
                <mesh position={[s * 0.108, 0.015, 0.045]} castShadow>
                  <boxGeometry args={[0.085, 0.04, 0.2]} />
                  <RegionMaterial />
                </mesh>
              </group>
            ))}
        </>
      </RegionGroup>
    </group>
  );
}
