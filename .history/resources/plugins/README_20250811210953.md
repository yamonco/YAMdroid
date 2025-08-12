# plugins/

이 폴더는 SCRCPY 런처의 서드파티 플러그인(예: 메신저봇R 등) 격리/관리용 디렉터리입니다.

- 각 플러그인은 `resources/plugins/플러그인명/` 하위에 독립적으로 배치합니다.
- 플러그인별로 node_modules, 설정, 실행파일, 데이터 등을 격리할 수 있습니다.
- 플러그인 추가/삭제는 해당 폴더 전체를 복사/삭제하면 됩니다.
- 플러그인별 README, manifest, uninstall 스크립트 등을 포함할 수 있습니다.

## 예시 구조

```
resources/plugins/
  messengerbotr/
    package.json
    index.js
    ...
  another-plugin/
    ...
```

---

플러그인 관리 UI/로더/격리 실행 환경은 추후 확장 가능합니다.
