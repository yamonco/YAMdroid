// SCRCPY 세션 타입 정의
export type ScrcpySession = {
  id: string;
  pid: number;
  folder: string;
  device: string;
  resolution: string;
  dpi: string;
  foreground: boolean;
};
