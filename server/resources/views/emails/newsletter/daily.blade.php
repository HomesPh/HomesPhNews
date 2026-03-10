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
            background-color: #ffffff;
            padding: 25px 20px;
            text-align: center;
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
                <img src="https://news.homes.ph/images/HomesLogo.png" alt="Homes.ph News" style="height: 32px; width: auto; display: inline-block; vertical-align: middle;">

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
                    <table align="right" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td>
                                <a href="#" class="social-icon" title="Facebook">
                                    <img src="{{ $message->embed(public_path('img/emails/facebook-icon.png')) }}" width="16" height="16" alt="Facebook" style="display: block;" />
                                </a>
                            </td>
                            <td>
                                <a href="#" class="social-icon" title="LinkedIn">
                                    <img src="{{ $message->embed(public_path('img/emails/linkedin-icon.png')) }}" width="16" height="16" alt="LinkedIn" style="display: block;" />
                                </a>
                            </td>
                            <td>
                                <a href="#" class="social-icon" title="Instagram">
                                    <img src="{{ $message->embed(public_path('img/emails/instagram-icon.png')) }}" width="16" height="16" alt="Instagram" style="display: block;" />
                                </a>
                            </td>
                            <td>
                                <a href="#" class="social-icon" title="X">
                                    <img src="{{ $message->embed(public_path('img/emails/x-icon.png')) }}" width="16" height="16" alt="X" style="display: block;" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>