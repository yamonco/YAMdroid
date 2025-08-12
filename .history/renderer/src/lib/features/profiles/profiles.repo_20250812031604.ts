// 프로필 파일 저장/로드/내보내기/불러오기
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PROFILE_PATH = join(process.cwd(), 'resources', 'profiles', 'profiles.json');

export function loadProfiles(): any[] {
  try {
    const raw = readFileSync(PROFILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveProfiles(profiles: any[]) {
  writeFileSync(PROFILE_PATH, JSON.stringify(profiles, null, 2), 'utf-8');
}

export function exportProfiles(path: string) {
  const raw = readFileSync(PROFILE_PATH, 'utf-8');
  writeFileSync(path, raw, 'utf-8');
}

export function importProfiles(path: string) {
  const raw = readFileSync(path, 'utf-8');
  writeFileSync(PROFILE_PATH, raw, 'utf-8');
}
