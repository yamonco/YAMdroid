// devDebug.ts
export function enableGlobalEventDebug() {
  if (import.meta.env?.DEV) {
    document.addEventListener('click', e => {
      const t = e.target as HTMLElement;
      console.log('[DEV][click]', t?.tagName, t?.className, t?.id, t?.outerText?.slice(0, 40));
    }, true);
    document.addEventListener('input', e => {
      const t = e.target as HTMLElement;
      console.log('[DEV][input]', t?.tagName, t?.className, t?.id, (t as any).value);
    }, true);
    // 필요시 더 추가
  }
}
