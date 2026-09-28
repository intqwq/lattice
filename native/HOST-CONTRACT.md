# Lattice Windows host

The app is an unpackaged WinUI 3 / C# executable with a bundled local WebView2 lesson surface. Build using `pwsh -File scripts/build-windows.ps1`; add `-SmokeTest` for a native launch check. The executable and its required sibling files are published in `native/bin/publish-v0.2/`. Use `-OutputDirectory` for a separate build destination.

The build bundles .NET and Windows App SDK. Microsoft Edge WebView2 Evergreen Runtime must already be installed. This machine has the runtime; the current folder distribution does not yet include an offline WebView2 installer. Do not call it a complete installer for a clean Windows machine.

The `web/` tree is mapped to `https://lattice.local/`. Embedded nonlocal navigation, new windows, downloads, permissions, host objects, and nonlocal resource requests are blocked. An explicit learner click on an HTTP/HTTPS source link opens that link in the default browser; no remote page enters the app's trusted surface. The host exposes no generic file access, shell command, or code execution API. Runtime profile data is kept in `%LOCALAPPDATA%/Lattice/WebView2`; the frontend's localStorage persists inside that profile. SQLite is not implemented in this starter host.

## Backup bridge

Use `window.chrome.webview.postMessage({type, requestId, data})`. Receive replies through `window.chrome.webview.addEventListener('message', e => ...)`. Replies are `{type:'lattice.result', requestId, ok, data, error}`.

- `lattice.host-info`: returns platform, shell, version and offline status.
- `lattice.export`: `data` must be a JSON object under 8 MB. Opens the Windows save picker; the user chooses the destination.
- `lattice.import`: opens the Windows JSON picker and returns a JSON object under 8 MB. The frontend must validate the backup schema and obtain the learner's explicit restore action before replacing local progress.
- `lattice.export-code`: `data` must be `{text:string}` with at most 200,000 characters. Opens a Windows save picker with suggested name `example.cpp` and the fixed `.cpp` file type. This saves source text; it does not compile or execute it.

Cancelled pickers return `ok:false,error:'cancelled'`. The native host validates the message origin and accepts no caller-supplied paths. Only one file picker can be active. `document.documentElement.dataset.nativeHost` becomes `winui3` and a `lattice:native-ready` event is dispatched after navigation.

## Smoke test

`Lattice.exe --smoke-test` uses a fresh, uniquely named profile under `smoke-profile` beside the publish directory, waits for `#app` plus `data-app-ready` and loaded curriculum counts, tests localStorage and the host bridge, probes the nonlocal resource block, records JavaScript errors and the native WebView2 version in `smoke-test.json`, and exits. It never opens the normal learner profile. The build script passes `--smoke-output` to save a real WebView capture in `native/smoke/lattice-native.png` and a report in `native/smoke/native-app-smoke.json`. The frontend readiness contract is `document.documentElement.dataset.appReady='true'` plus `window.__latticeDiagnostics={courses,modules,lessons}` after successful load. The smoke test does not establish accessibility, IME, or clean-machine compatibility, nor certify lesson quality. File pickers are disabled in this mode.

Official references: [unpackaged WinUI deployment](https://learn.microsoft.com/windows/apps/package-and-deploy/unpackage-winui-app), [WebView2 local content](https://learn.microsoft.com/microsoft-edge/webview2/concepts/working-with-local-content), [WebView2 security](https://learn.microsoft.com/microsoft-edge/webview2/concepts/security).
