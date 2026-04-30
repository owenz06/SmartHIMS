<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- PWA Meta Tags --}}
        <meta name="application-name" content="HIMS">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="HIMS">
        <meta name="description" content="Hospital Inventory Management System">
        <meta name="format-detection" content="telephone=no">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#0d9488">

        {{-- PWA Manifest --}}
        <link rel="manifest" href="/manifest.json">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'SHIMS') }}</title>

        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='16' fill='%230d9488'/><path d='M16 6c0.8 0 1.5 0.7 1.5 1.5V13h5.5c0.8 0 1.5 0.7 1.5 1.5s-0.7 1.5-1.5 1.5H17.5v5.5c0 0.8-0.7 1.5-1.5 1.5s-1.5-0.7-1.5-1.5V16H9c-0.8 0-1.5-0.7-1.5-1.5S8.2 13 9 13h5.5V7.5C14.5 6.7 15.2 6 16 6z' fill='white'/></svg>" type="image/svg+xml">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        {{-- Service Worker Registration --}}
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                            console.log('Service Worker registered:', registration);
                        })
                        .catch((error) => {
                            console.log('Service Worker registration failed:', error);
                        });
                });
            }
        </script>
    </body>
</html>
