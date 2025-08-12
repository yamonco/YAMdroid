import { loadProfiles, saveProfiles, exportProfiles, importProfiles } from './profiles.repo';

export async function getProfiles() {
  return loadProfiles();
}

export async function setProfiles(profiles: any[]) {
  saveProfiles(profiles);
}

export async function exportProfilesTo(path: string) {
  exportProfiles(path);
}

export async function importProfilesFrom(path: string) {
  importProfiles(path);
}
