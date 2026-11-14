import type { BodyRegionId } from "@/types/domain";

import type { CameraFocus } from "./types";

export const DEFAULT_VIEW: CameraFocus = { position: [0, 0.15, 3.3], target: [0, 0, 0] };

export const REGION_VIEWS: Record<BodyRegionId, CameraFocus> = {
  head: { position: [0.35, 0.8, 1.35], target: [0, 0.7, 0] },
  chest: { position: [0.4, 0.45, 1.6], target: [0, 0.37, 0] },
  abdomen: { position: [0.4, 0.15, 1.6], target: [0, 0.08, 0] },
  arms: { position: [1.5, 0.35, 1.4], target: [0.25, 0.1, 0] },
  legs: { position: [0.5, -0.3, 2.2], target: [0, -0.45, 0] },
};
