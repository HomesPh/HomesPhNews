<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily News Digest - Homes.ph News</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px 0;
            -webkit-font-smoothing: antialiased;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #dbe2e8;
            padding: 25px 20px;
            text-align: center;
        }

        .logo-text {
            font-size: 32px;
            font-weight: 800;
            color: #1e3a8a !important;
            text-decoration: none;
            display: inline-block;
        }

        .logo-dot-ph {
            font-weight: 500;
        }

        .color-bar {
            width: 100%;
            height: 12px;
        }

        .content {
            padding: 30px 30px;
            color: #111827;
        }

        .top-article {
            margin-bottom: 30px;
        }

        .top-article-img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 15px;
            display: block;
        }

        .top-article-title {
            font-size: 22px;
            font-weight: 800;
            color: #1e3a8a;
            margin-bottom: 10px;
            text-decoration: none;
            display: block;
            line-height: 1.3;
        }

        .top-article-summary {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .article-date {
            font-size: 12px;
            color: #9ca3af;
        }

        .list-article {
            margin-bottom: 20px;
        }

        .list-article-table {
            width: 100%;
            border-collapse: collapse;
        }

        .list-article-img {
            width: 160px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            display: block;
        }

        .list-article-title {
            font-size: 16px;
            font-weight: 800;
            color: #1e3a8a;
            margin-bottom: 5px;
            text-decoration: none;
            display: block;
            line-height: 1.3;
        }

        .list-article-summary {
            font-size: 12px;
            color: #4b5563;
            line-height: 1.5;
            margin-bottom: 5px;
        }

        .bottom-links {
            text-align: center;
            padding: 25px 20px 35px;
            font-size: 13px;
            font-weight: 600;
            color: #1e3a8a;
            line-height: 2.2;
        }

        .bottom-links a {
            color: #1e3a8a;
            text-decoration: none;
        }

        .bottom-links .divider {
            color: #1e3a8a;
            margin: 0 10px;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-left {
            background-color: #1e3a8a;
            padding: 8px 15px;
            color: #ffffff;
            font-size: 11px;
        }

        .footer-right {
            background-color: #eab308;
            padding: 8px 15px;
            text-align: right;
            vertical-align: middle;
        }

        .social-icon {
            display: inline-block;
            margin-left: 12px;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
        }

        .btn {
            display: inline-block;
            background-color: #1e3a8a;
            color: #ffffff !important;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            text-align: center;
            margin-top: 20px;
        }

        @media only screen and (max-width: 600px) {
            .list-article-table td {
                display: block;
                width: 100% !important;
                padding-left: 0 !important;
            }

            .list-article-img {
                width: 100%;
                height: 180px;
                margin-bottom: 12px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; height: 12px;">
            <tr>
                <td width="64%" style="background-color: #16297a;"></td>
                <td width="36%" style="background-color: #d19619;"></td>
            </tr>
        </table>
        <div class="header" style="background-color: #ffffff; padding: 25px 20px;">
            <a href="https://news.homes.ph" style="text-decoration: none;">
                <span class="logo-text"
                    style="color: #16297a !important; font-size: 36px; font-weight: 900; font-family: 'Inter', sans-serif;">Homes<span
                        class="logo-dot-ph" style="font-weight: 500;">.ph</span> News</span>
            </a>
        </div>
        <table class="color-bar" cellpadding="0" cellspacing="0" border="0" style="width: 100%; height: 12px;">
            <tr>
                <td width="33%" style="background-color: #d19619;"></td>
                <td width="67%" style="background-color: #16297a;"></td>
            </tr>
        </table>

        <div class="content" style="padding-bottom: 10px;">
            <div style="font-size: 18px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">{{ $greeting }}
                {{ $greetingEmoji ?? '' }}
            </div>
            <div style="font-size: 14px; color: #4b5563;">
                Here is your personalized news digest from <strong>Homes.ph News</strong>.
            </div>
        </div>

        <div class="content" style="padding-top: 0;">
            @foreach($articles as $index => $article)
                @php
                    $imageUrl = null;
                    if ($article->image) {
                        if (is_array($article->image)) {
                            $imageUrl = $article->image[0] ?? null;
                        } else {
                            $imageUrl = $article->image;
                        }

                        if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
                            $imageUrl = str_replace('homestv.ph', 'news.homes.ph', 'https://news.homes.ph/storage/' . $imageUrl);
                        }
                    }
                @endphp

                @if($index === 0)
                    <div class="top-article">
                        @if($imageUrl)
                            <a href="{{ $clientUrl }}/article?id={{ $article->id }}">
                                <img src="{{ $imageUrl }}" alt="{{ $article->title }}" class="top-article-img">
                            </a>
                        @endif
                        <a href="{{ $clientUrl }}/article?id={{ $article->id }}"
                            class="top-article-title">{{ $article->title }}</a>
                        <div class="top-article-summary">{{ Str::limit(strip_tags($article->summary), 160) }}</div>
                        <div class="article-date">
                            @if(isset($article->created_at))
                                {{ \Carbon\Carbon::parse($article->created_at)->format('F j, Y') }}
                            @else
                                {{ date('F j, Y') }}
                            @endif
                        </div>
                    </div>
                @else
                    <div class="list-article">
                        <table class="list-article-table" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                @if($imageUrl)
                                    <td width="160" valign="top">
                                        <a href="{{ $clientUrl }}/article?id={{ $article->id }}">
                                            <img src="{{ $imageUrl }}" alt="{{ $article->title }}" class="list-article-img">
                                        </a>
                                    </td>
                                @endif
                                <td valign="top" style="padding-left: {{ $imageUrl ? '20px' : '0' }};">
                                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}"
                                        class="list-article-title">{{ $article->title }}</a>
                                    <div class="list-article-summary">{{ Str::limit(strip_tags($article->summary), 120) }}</div>
                                    <div class="article-date">
                                        @if(isset($article->created_at))
                                            {{ \Carbon\Carbon::parse($article->created_at)->format('F j, Y') }}
                                        @else
                                            {{ date('F j, Y') }}
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                @endif
            @endforeach
        </div>

        <div class="bottom-links">
            <div>
                <a href="https://news.homes.ph">News.Homes.ph</a> <span class="divider">|</span>
                <a href="https://news.homes.ph/privacy-policy">Privacy Policy</a> <span class="divider">|</span>
                <span>(+63) 977 815 0888</span> <span class="divider">|</span>
                <a href="mailto:info@homes.ph">info@homes.ph</a>
            </div>
            <div style="margin-top: 10px;">
                <a href="{{ isset($subscriber) ? $clientUrl . '/subscribe/edit?id=' . $subscriber->sub_Id : '#' }}">Unsubscribe
                    from this email</a> <span class="divider">|</span>
                <a href="{{ isset($subscriber) ? $clientUrl . '/subscribe/edit?id=' . $subscriber->sub_Id : '#' }}">Manage
                    preferences</a>
            </div>
        </div>

        <table class="footer-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="footer-left">
                    &copy; {{ date('Y') }} Homes.ph News. All rights reserved.
                </td>
                <td class="footer-right">
                    <a href="#" class="social-icon" title="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="X">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                    </a>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>