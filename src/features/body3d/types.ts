import type { BodyRegionId } from "@/types/domain";

/**
 * Contract every body model must satisfy. To replace the procedural figure
 * with a GLB, build a component with these props whose meshes are grouped by
 * region, then point `active-model.ts` at it.
 */
export interface BodyModelProps {
  selected: BodyRegionId | null;
  hovered: BodyRegionId | null;
  onSelect: (id: BodyRegionId) => void;
  onHover: (id: BodyRegionId | null) => void;
}

export type Vec3 = [number, number, number];

export interface CameraFocus {
  position: Vec3;
  target: Vec3;
}

/** Imperative camera API exposed to the page's controls. */
export interface BodyViewerApi {
  zoomIn(): void;
  zoomOut(): void;
  rotate(direction: 1 | -1): void;
  reset(): void;
  focus(id: BodyRegionId | null): void;
}
