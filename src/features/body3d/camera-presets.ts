import type { BodyRegionId } from "@/types/domain";

import type { CameraFocus } from "./types";

export const DEFAULT_VIEW: CameraFocus = { position: [0, 0.15, 3.3], target: [0, 0, 0] };

export const REGION_VIEWS: Record<BodyRegionId, CameraFocus> = {
  head: { position: [0.5, 0.85, 1.9], target: [0, 0.62, 0] },
  chest: { position: [0.6, 0.5, 2.3], target: [0, 0.3, 0] },
  abdomen: { position: [0.6, 0.2, 2.3], target: [0, 0.08, 0] },
  arms: { position: [1.9, 0.4, 1.8], target: [0.2, 0.1, 0] },
  legs: { position: [0.7, -0.2, 2.6], target: [0, -0.45, 0] },
};
