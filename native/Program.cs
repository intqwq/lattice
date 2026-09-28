using Microsoft.UI.Xaml;
using Microsoft.UI.Dispatching;

namespace Lattice;

internal static class Program
{
    [STAThread]
    public static void Main(string[] args)
    {
        var outputOption = Array.IndexOf(args, "--smoke-output");
        var smokeOutput = outputOption >= 0 && outputOption + 1 < args.Length ? args[outputOption + 1] : null;
        WinRT.ComWrappersSupport.InitializeComWrappers();
        Application.Start(initialization =>
        {
            SynchronizationContext.SetSynchronizationContext(new DispatcherQueueSynchronizationContext(DispatcherQueue.GetForCurrentThread()));
            _ = new LatticeApplication(args.Contains("--smoke-test", StringComparer.Ordinal), smokeOutput);
        });
    }
}

internal sealed class LatticeApplication(bool smokeTest, string? smokeOutput) : Application
{
    private MainWindow? _window;

    protected override void OnLaunched(LaunchActivatedEventArgs args)
    {
        _window = new MainWindow(smokeTest, smokeOutput);
        _window.Activate();
    }
}
