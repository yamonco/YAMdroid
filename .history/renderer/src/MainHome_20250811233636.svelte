<script lang="ts">
  import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';
  // 상태 let 선언 (불필요한 $state, $profiles 등 제거)
  let scrcpyFolders: string[] = [];
  let loading = false;
  let selected = '';
  let profiles: { name: string; device: string; resolution: string; dpi: string }[] = [];
  let activeProfileIdx = 0;
  let newProfileName = '';
  let showSaved = false;
  let scrcpySessions = [];
  let running = false;
  let killRunning = false;
  let runError = '';
  let scrcpyLogs: string[] = [];
  let showConsole = false;
  let minimizedConsole = false;
  import { addProfile as addProfileAction, removeProfile as removeProfileAction, selectProfile as selectProfileAction, updateProfileField as updateProfileFieldAction } from './lib/features/scrcpy/scrcpy.actions';
  // 프로필 관련 상태 변경은 액션 함수로만 처리
  function handleAddProfile() {
    profiles = addProfileAction(profiles, newProfileName);
    newProfileName = '';
    activeProfileIdx = profiles.length - 1;
  }
  function handleRemoveProfile(idx: number) {
    profiles = removeProfileAction(profiles, idx);
    if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;
  }
  function handleSelectProfile(idx: number) {
    activeProfileIdx = selectProfileAction(idx);
  }
  function handleUpdateProfileField(field: string, value: string) {
    if (field === 'newProfileName') {
      <script lang="ts">
      import ScrcpyHomePage from './components/pages/ScrcpyHomePage.svelte';
      import { addProfile as addProfileAction, removeProfile as removeProfileAction, selectProfile as selectProfileAction, updateProfileField as updateProfileFieldAction, loadFolders } from './lib/features/scrcpy/scrcpy.actions';

      // Svelte 5 반응형 상태 선언
      const scrcpyFolders = $state<string[]>([]);
      const loading = $state(false);
      const selected = $state('');
      const profiles = $state<{ name: string; device: string; resolution: string; dpi: string }[]>([]);
      const activeProfileIdx = $state(0);
      const newProfileName = $state('');
      const showSaved = $state(false);
      const scrcpySessions = $state<any[]>([]);
      const running = $state(false);
      const killRunning = $state(false);
      const runError = $state('');
      const scrcpyLogs = $state<string[]>([]);
      const showConsole = $state(false);
      const minimizedConsole = $state(false);

      function handleAddProfile() {
        profiles = addProfileAction(profiles, newProfileName);
        if (field === 'newProfileName') {
          newProfileName = value;
          return;
        }
        profiles = removeProfileAction(profiles, idx);

        if (activeProfileIdx >= profiles.length) activeProfileIdx = profiles.length - 1;

      }
