// scrcpy.types.ts
// SCRCPY 관련 타입/DTO 정의 (Atomic 패턴, features 분리)

export type ScrcpySession = {
  id: string;
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
  pid?: number;
  foreground: boolean;
};

export type RunScrcpyArgs = {
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
};

export type Result<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// 기타 확장 타입 필요시 아래에 추가
