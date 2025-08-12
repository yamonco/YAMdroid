// 프로필 파일 저장/로드/내보내기/불러오기
export async function loadProfiles(): Promise<any[]> {
  return window.bridge.loadProfiles();
}
export async function saveProfiles(profiles: any[]) {
  return window.bridge.saveProfiles(profiles);
}
export async function exportProfiles(path: string) {
  return window.bridge.exportProfiles(path);
}
export async function importProfiles(path: string) {
  return window.bridge.importProfiles(path);
}
