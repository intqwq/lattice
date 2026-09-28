# Third-party notices

## KaTeX

KaTeX 0.18.9, including its distributed fonts, is bundled under `web/vendor/katex/`. Its MIT license is preserved in that directory. Source: https://github.com/KaTeX/KaTeX. `scripts/vendor-assets.mjs` verifies the pinned official package checksum before extracting assets.

## Windows host dependencies

NuGet dependencies are recorded in `native/Lattice.csproj` and `native/packages.lock.json`: Microsoft.WindowsAppSDK, Microsoft.Windows.SDK.BuildTools and Microsoft.Web.WebView2, with their transitive runtime dependencies. Their respective licenses and redistribution terms apply. The repository does not include the NuGet package cache or generated Windows binaries.

## Teaching references

Lesson text, exercises and diagrams in this project are original teaching material. Per-lesson links and the reference manifests in `content/` identify external sources used for scope and verification. External textbooks and websites are not bundled, and a citation does not imply that their licenses cover this project's original content. Review status is recorded separately from source attribution.
