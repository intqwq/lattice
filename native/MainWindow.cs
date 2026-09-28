using System.Runtime.InteropServices;
using System.Text.Json;
using Microsoft.UI;
using Microsoft.UI.Windowing;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media;
using Microsoft.Web.WebView2.Core;
using Windows.Storage;
using Windows.Storage.Pickers;

namespace Lattice;

internal sealed class MainWindow : Window
{
    private const string Origin = "https://lattice.local";
    private const int BackupLimit = 8 * 1024 * 1024;
    private readonly WebView2 _view = new();
    private readonly Grid _root = new();
    private readonly TextBlock _status = new() { Text = "Starting Lattice / 正在启动知序…", Foreground = new SolidColorBrush(Colors.White), FontSize = 20, Margin = new Thickness(40), TextWrapping = TextWrapping.Wrap };
    private readonly bool _smokeTest;
    private readonly string _dataDirectory;
    private readonly string _smokeDirectory;
    private readonly string _webDirectory = Path.Combine(AppContext.BaseDirectory, "web");
    private readonly SubclassProc _subclassProc;
    private bool _started;
    private bool _pickerOpen;
    private int _blockedRequests;
    private nint _hwnd;

    public MainWindow(bool smokeTest, string? smokeOutput)
    {
        _smokeTest = smokeTest;
        _smokeDirectory = Path.GetFullPath(smokeOutput ?? Path.Combine(AppContext.BaseDirectory, "smoke"));
        _dataDirectory = smokeTest ? Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "smoke-profile", Guid.NewGuid().ToString("N"))) : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Lattice");
        Title = "Lattice · 知序";
        _root.Background = new SolidColorBrush(Windows.UI.Color.FromArgb(255, 13, 17, 26));
        _root.Children.Add(_status);
        _view.Opacity = 0;
        _root.Children.Add(_view);
        Content = _root;
        _hwnd = WinRT.Interop.WindowNative.GetWindowHandle(this);
        _subclassProc = HandleWindowMessage;
        SetWindowSubclass(_hwnd, _subclassProc, 1, 0);
        var appWindow = AppWindow.GetFromWindowId(Win32Interop.GetWindowIdFromWindow(_hwnd));
        appWindow.Resize(new Windows.Graphics.SizeInt32(1440, 960));
        if (AppWindowTitleBar.IsCustomizationSupported())
        {
            appWindow.TitleBar.BackgroundColor = Windows.UI.Color.FromArgb(255, 13, 17, 26);
            appWindow.TitleBar.ForegroundColor = Colors.White;
            appWindow.TitleBar.ButtonBackgroundColor = Windows.UI.Color.FromArgb(255, 13, 17, 26);
            appWindow.TitleBar.ButtonForegroundColor = Colors.White;
        }
        Activated += OnActivated;
        Closed += (_, _) => { RemoveWindowSubclass(_hwnd, _subclassProc, 1); _view.Close(); };
    }

    private async void OnActivated(object sender, WindowActivatedEventArgs args)
    {
        if (_started) return;
        _started = true;
        try
        {
            if (!File.Exists(Path.Combine(_webDirectory, "index.html"))) throw new FileNotFoundException("The bundled web/index.html is missing. Rebuild the application after the web assets have been created.");
            Directory.CreateDirectory(_dataDirectory);
            var environment = await CoreWebView2Environment.CreateWithOptionsAsync(null, Path.Combine(_dataDirectory, "WebView2"), new CoreWebView2EnvironmentOptions { AdditionalBrowserArguments = "--disable-features=msEdgeSidebarV2" });
            await _view.EnsureCoreWebView2Async(environment);
            var core = _view.CoreWebView2;
            core.SetVirtualHostNameToFolderMapping("lattice.local", _webDirectory, CoreWebView2HostResourceAccessKind.DenyCors);
            core.Settings.AreDevToolsEnabled = false;
            core.Settings.AreDefaultContextMenusEnabled = false;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.IsGeneralAutofillEnabled = false;
            core.Settings.IsPasswordAutosaveEnabled = false;
            core.Settings.AreHostObjectsAllowed = false;
            core.Settings.IsWebMessageEnabled = true;
            core.NavigationStarting += async (_, e) =>
            {
                if (IsLocal(e.Uri)) return;
                e.Cancel = true;
                if (e.IsUserInitiated && !_smokeTest && IsLocal(core.Source) && IsExternalWebLink(e.Uri)) await Windows.System.Launcher.LaunchUriAsync(new Uri(e.Uri));
            };
            core.NewWindowRequested += async (_, e) =>
            {
                e.Handled = true;
                if (e.IsUserInitiated && !_smokeTest && IsLocal(core.Source) && IsExternalWebLink(e.Uri)) await Windows.System.Launcher.LaunchUriAsync(new Uri(e.Uri));
            };
            core.DownloadStarting += (_, e) => e.Cancel = true;
            core.PermissionRequested += (_, e) => e.State = CoreWebView2PermissionState.Deny;
            core.AddWebResourceRequestedFilter("*", CoreWebView2WebResourceContext.All, CoreWebView2WebResourceRequestSourceKinds.All);
            core.WebResourceRequested += (_, e) =>
            {
                if (IsLocal(e.Request.Uri) || e.Request.Uri.StartsWith("data:", StringComparison.Ordinal) || e.Request.Uri.StartsWith("blob:" + Origin + "/", StringComparison.Ordinal)) return;
                _blockedRequests++;
                e.Response = environment.CreateWebResourceResponse(new Windows.Storage.Streams.InMemoryRandomAccessStream(), 403, "Offline application", "Content-Type: text/plain\r\n");
            };
            core.WebMessageReceived += OnWebMessage;
            if (_smokeTest) await core.AddScriptToExecuteOnDocumentCreatedAsync("window.__latticeSmokeErrors=[];addEventListener('error',e=>window.__latticeSmokeErrors.push(e.message));addEventListener('unhandledrejection',e=>window.__latticeSmokeErrors.push(String(e.reason)));");
            core.NavigationCompleted += async (_, e) =>
            {
                try
                {
                    if (!e.IsSuccess) throw new InvalidOperationException("The local lesson surface could not load: " + e.WebErrorStatus);
                    _status.Visibility = Visibility.Collapsed;
                    _view.Opacity = 1;
                    await core.ExecuteScriptAsync("document.documentElement.dataset.nativeHost='winui3'; window.dispatchEvent(new Event('lattice:native-ready'));");
                    if (_smokeTest) await FinishSmokeTestAsync();
                }
                catch (Exception ex)
                {
                    _status.Text = ex.Message;
                    _status.Visibility = Visibility.Visible;
                    if (_smokeTest) { WriteSmokeReport(new { ok = false, error = ex.ToString() }); Application.Current.Exit(); }
                }
            };
            core.Navigate(Origin + "/index.html");
        }
        catch (Exception ex)
        {
            _status.Text = "Lattice could not start.\n\n" + ex.Message + "\n\nMicrosoft Edge WebView2 Runtime is required. The core learning content works offline once the runtime is installed.";
            if (_smokeTest) { WriteSmokeReport(new { ok = false, error = ex.ToString() }); Application.Current.Exit(); }
        }
    }

    private static bool IsLocal(string source) => Uri.TryCreate(source, UriKind.Absolute, out var uri) && uri.Scheme == "https" && uri.Host == "lattice.local" && uri.IsDefaultPort;
    private static bool IsExternalWebLink(string source) => Uri.TryCreate(source, UriKind.Absolute, out var uri) && uri.Scheme is "https" or "http" && !string.IsNullOrWhiteSpace(uri.Host) && string.IsNullOrEmpty(uri.UserInfo);

    private async void OnWebMessage(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        if (!IsLocal(e.Source)) return;
        string? requestId = null;
        try
        {
            if (System.Text.Encoding.UTF8.GetByteCount(e.WebMessageAsJson) > BackupLimit) throw new InvalidDataException("Backup exceeds 8 MB.");
            using var message = JsonDocument.Parse(e.WebMessageAsJson);
            var root = message.RootElement;
            requestId = root.GetProperty("requestId").GetString();
            if (string.IsNullOrWhiteSpace(requestId) || requestId.Length > 100) return;
            var type = root.GetProperty("type").GetString();
            if (type == "lattice.host-info") { Reply(requestId, true, new { platform = "windows", shell = "winui3", version = typeof(MainWindow).Assembly.GetName().Version?.ToString(3), offline = true }); return; }
            if (type is not ("lattice.export" or "lattice.import" or "lattice.export-code")) { Reply(requestId, false, error: "Unsupported native request."); return; }
            if (_smokeTest) { Reply(requestId, false, error: "File pickers are disabled in smoke tests."); return; }
            if (_pickerOpen) { Reply(requestId, false, error: "Another file picker is already open."); return; }
            _pickerOpen = true;
            try
            {
                if (type is "lattice.export" or "lattice.export-code")
                {
                    var data = root.GetProperty("data");
                    if (data.ValueKind != JsonValueKind.Object) throw new InvalidDataException("Export data must be a JSON object.");
                    var isCode = type == "lattice.export-code";
                    string text;
                    if (isCode)
                    {
                        text = data.GetProperty("text").GetString() ?? throw new InvalidDataException("C++ source must be a string.");
                        if (text.Length > 200000) throw new InvalidDataException("C++ source exceeds 200,000 characters.");
                    }
                    else text = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                    if (System.Text.Encoding.UTF8.GetByteCount(text) > BackupLimit) throw new InvalidDataException("Backup exceeds 8 MB.");
                    var picker = new FileSavePicker { SuggestedStartLocation = PickerLocationId.DocumentsLibrary, SuggestedFileName = isCode ? "example.cpp" : "Lattice-backup-" + DateTime.Now.ToString("yyyy-MM-dd") };
                    picker.FileTypeChoices.Add(isCode ? "C++ source" : "Lattice JSON backup", new[] { isCode ? ".cpp" : ".json" });
                    WinRT.Interop.InitializeWithWindow.Initialize(picker, _hwnd);
                    var file = await picker.PickSaveFileAsync();
                    if (file is null) { Reply(requestId, false, error: "cancelled"); return; }
                    await FileIO.WriteTextAsync(file, text);
                    Reply(requestId, true);
                }
                else
                {
                    var picker = new FileOpenPicker { SuggestedStartLocation = PickerLocationId.DocumentsLibrary };
                    picker.FileTypeFilter.Add(".json");
                    WinRT.Interop.InitializeWithWindow.Initialize(picker, _hwnd);
                    var file = await picker.PickSingleFileAsync();
                    if (file is null) { Reply(requestId, false, error: "cancelled"); return; }
                    var properties = await file.GetBasicPropertiesAsync();
                    if (properties.Size > BackupLimit) throw new InvalidDataException("Backup exceeds 8 MB.");
                    using var backup = JsonDocument.Parse(await FileIO.ReadTextAsync(file));
                    if (backup.RootElement.ValueKind != JsonValueKind.Object) throw new InvalidDataException("Backup must contain a JSON object.");
                    Reply(requestId, true, backup.RootElement.Clone());
                }
            }
            finally { _pickerOpen = false; }
        }
        catch (Exception ex) { if (requestId is not null) Reply(requestId, false, error: ex.Message); }
    }

    private void Reply(string requestId, bool ok, object? data = null, string? error = null) => _view.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new { type = "lattice.result", requestId, ok, data, error }));

    private async Task FinishSmokeTestAsync()
    {
        var core = _view.CoreWebView2;
        for (var attempt = 0; attempt < 100; attempt++)
        {
            var ready = await core.ExecuteScriptAsync("document.documentElement.dataset.appReady==='true'");
            if (ready == "true") break;
            await Task.Delay(100);
        }
        await core.ExecuteScriptAsync("window.__latticeOfflineProbe='pending';fetch('https://offline-probe.invalid/lattice-smoke').then(r=>window.__latticeOfflineProbe=r.status===403?'blocked':'unexpected '+r.status).catch(()=>window.__latticeOfflineProbe='blocked');window.chrome.webview.addEventListener('message',e=>{if(e.data.requestId==='native-smoke-host')window.__latticeBridgeProbe=e.data});window.chrome.webview.postMessage({type:'lattice.host-info',requestId:'native-smoke-host'});");
        await Task.Delay(500);
        var result = await core.ExecuteScriptAsync("JSON.stringify({url:location.href,title:document.title,ready:document.readyState,appReady:document.documentElement.dataset.appReady==='true',appMarker:!!document.querySelector('#app'),counts:window.__latticeDiagnostics,bodyCharacters:document.body.innerText.length,nativeHost:document.documentElement.dataset.nativeHost,offlineProbe:window.__latticeOfflineProbe,bridge:window.__latticeBridgeProbe,errors:window.__latticeSmokeErrors,localStorage:(()=>{localStorage.setItem('lattice-host-smoke','ok');const ok=localStorage.getItem('lattice-host-smoke')==='ok';localStorage.removeItem('lattice-host-smoke');return ok;})()})");
        var document = JsonSerializer.Deserialize<string>(result);
        var state = document is null ? default : JsonSerializer.Deserialize<JsonElement>(document);
        var ok = state.ValueKind == JsonValueKind.Object && state.GetProperty("ready").GetString() == "complete" && state.GetProperty("appReady").GetBoolean() && state.GetProperty("appMarker").GetBoolean() && state.TryGetProperty("counts", out var counts) && counts.GetProperty("courses").GetInt32() > 0 && counts.GetProperty("modules").GetInt32() > 0 && counts.GetProperty("lessons").GetInt32() > 0 && state.GetProperty("bodyCharacters").GetInt32() > 100 && state.GetProperty("localStorage").GetBoolean() && state.GetProperty("offlineProbe").GetString() == "blocked" && state.TryGetProperty("bridge", out var bridge) && bridge.GetProperty("ok").GetBoolean() && state.GetProperty("errors").GetArrayLength() == 0;
        Directory.CreateDirectory(_smokeDirectory);
        var folder = await StorageFolder.GetFolderFromPathAsync(_smokeDirectory);
        var screenshot = await folder.CreateFileAsync("lattice-native.png", CreationCollisionOption.ReplaceExisting);
        using (var capture = await screenshot.OpenAsync(FileAccessMode.ReadWrite)) await core.CapturePreviewAsync(CoreWebView2CapturePreviewImageFormat.Png, capture);
        WriteSmokeReport(new { ok, shell = "WinUI 3", runtime = core.Environment.BrowserVersionString, isolatedProfile = true, blockedRequests = _blockedRequests, document = state, screenshot = screenshot.Path, createdAt = DateTimeOffset.UtcNow });
        Application.Current.Exit();
    }

    private void WriteSmokeReport(object report)
    {
        var json = JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(Path.Combine(AppContext.BaseDirectory, "smoke-test.json"), json);
        Directory.CreateDirectory(_smokeDirectory);
        File.WriteAllText(Path.Combine(_smokeDirectory, "native-app-smoke.json"), json);
    }

    private nint HandleWindowMessage(nint hwnd, uint message, nuint wParam, nint lParam, nuint id, nuint data)
    {
        if (message == 0x0024)
        {
            var minmax = Marshal.PtrToStructure<MinMaxInfo>(lParam);
            var scale = GetDpiForWindow(hwnd) / 96.0;
            minmax.MinTrackSize = new Point { X = (int)(960 * scale), Y = (int)(640 * scale) };
            Marshal.StructureToPtr(minmax, lParam, false);
            return 0;
        }
        return DefSubclassProc(hwnd, message, wParam, lParam);
    }

    [StructLayout(LayoutKind.Sequential)] private struct Point { public int X; public int Y; }
    [StructLayout(LayoutKind.Sequential)] private struct MinMaxInfo { public Point Reserved, MaxSize, MaxPosition, MinTrackSize, MaxTrackSize; }
    private delegate nint SubclassProc(nint hwnd, uint message, nuint wParam, nint lParam, nuint id, nuint data);
    [DllImport("comctl32.dll")] [return: MarshalAs(UnmanagedType.Bool)] private static extern bool SetWindowSubclass(nint hwnd, SubclassProc callback, nuint id, nuint data);
    [DllImport("comctl32.dll")] [return: MarshalAs(UnmanagedType.Bool)] private static extern bool RemoveWindowSubclass(nint hwnd, SubclassProc callback, nuint id);
    [DllImport("comctl32.dll")] private static extern nint DefSubclassProc(nint hwnd, uint message, nuint wParam, nint lParam);
    [DllImport("user32.dll")] private static extern uint GetDpiForWindow(nint hwnd);
}
