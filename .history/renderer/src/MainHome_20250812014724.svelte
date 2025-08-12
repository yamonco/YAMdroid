<script lang="ts">
import './app.pane.css';
import Button from './components/atoms/Button.svelte';
import Input from './components/atoms/Input.svelte';
import ProfilePage from './components/pages/ProfilePage.svelte';
import ScrcpySessionList from './components/organisms/ScrcpySessionList.svelte';
import MainNavPane from './components/organisms/MainNavPane.svelte';
import type { ScrcpySession } from './lib/features/scrcpy/scrcpy.types';
import {
  refreshSessions,
  setSessionForeground,
  killSession,
  loadFolders,
  addProfile,
  removeProfile,
  selectProfile,
  updateProfileField,
  saveSelection
} from './lib/features/scrcpy/scrcpy.actions';
  // 폴더 목록 최초 로딩 (Svelte 5 effect)
// Svelte 5 async effect → 즉시실행함수로 변경
if (typeof window !== 'undefined') {
  (async () => {
    if (scrcpyFolders.length === 0 && !loading) {
  </div>
</div>
