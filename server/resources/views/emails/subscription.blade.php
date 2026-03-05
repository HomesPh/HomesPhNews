<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #dbe2e8; padding: 25px 20px; text-align: center; }
        .logo-text { font-size: 32px; font-weight: 800; color: #1e3a8a !important; text-decoration: none; display: inline-block; }
        .logo-dot-ph { font-weight: 500; }
        .color-bar { width: 100%; height: 12px; }
        .content { padding: 30px 30px; color: #111827; }
        .top-article { margin-bottom: 30px; }
        .top-article-img { width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 15px; display: block; }
        .top-article-title { font-size: 22px; font-weight: 800; color: #1e3a8a; margin-bottom: 10px; text-decoration: none; display: block; line-height: 1.3; }
        .top-article-summary { font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 10px; }
        .article-date { font-size: 12px; color: #9ca3af; }
        .list-article { margin-bottom: 20px; }
        .list-article-table { width: 100%; border-collapse: collapse; }
        .list-article-img { width: 160px; height: 100px; object-fit: cover; border-radius: 8px; display: block; }
        .list-article-title { font-size: 16px; font-weight: 800; color: #1e3a8a; margin-bottom: 5px; text-decoration: none; display: block; line-height: 1.3; }
        .list-article-summary { font-size: 12px; color: #4b5563; line-height: 1.5; margin-bottom: 5px; }
        .bottom-links { text-align: center; padding: 25px 20px 35px; font-size: 13px; font-weight: 600; color: #1e3a8a; line-height: 2.2; }
        .bottom-links a { color: #1e3a8a; text-decoration: none; }
        .bottom-links .divider { color: #1e3a8a; margin: 0 10px; }
        .footer-table { width: 100%; border-collapse: collapse; }
        .footer-left { background-color: #1e3a8a; padding: 8px 15px; color: #ffffff; font-size: 11px; }
        .footer-right { background-color: #eab308; padding: 8px 15px; text-align: right; vertical-align: middle; }
        .social-icon { display: inline-block; margin-left: 12px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; }
        .btn { display: inline-block; background-color: #1e3a8a; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 800; text-decoration: none; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; height: 8px;">
            <tr>
                <td width="64%" style="background-color: #05103c;"></td>
                <td width="36%" style="background-color: #8c6b1c;"></td>
            </tr>
        </table>
        <div class="header" style="background-color: #bdc5cc; padding: 25px 20px;">
            <a href="https://news.homes.ph" style="text-decoration: none;">
                <span class="logo-text" style="color: #16297a !important; font-size: 36px; font-weight: 900; font-family: 'Inter', sans-serif;">Homes<span class="logo-dot-ph" style="font-weight: 500;">.ph</span> News</span>
            </a>
        </div>
        <table class="color-bar" cellpadding="0" cellspacing="0" border="0" style="width: 100%; height: 12px;">
            <tr>
                <td width="33%" style="background-color: #d19619;"></td>
                <td width="67%" style="background-color: #16297a;"></td>
            </tr>
        </table>

        <div class="content">
            <h1 class="top-article-title" style="font-size: 24px;">{{ $title }}</h1>
            <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">{{ $messageText }}</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e3a8a; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 800;">Subscription Details</h3>
                <div style="font-size: 14px; margin-bottom: 8px;"><strong style="color: #64748b; width: 80px; display: inline-block;">Email:</strong> <span style="color: #1e3a8a; font-weight: 600;">{{ $email }}</span></div>
                
                @if(isset($categories) && count($categories) > 0)
                <div style="font-size: 14px; margin-bottom: 8px;"><strong style="color: #64748b; width: 80px; display: inline-block;">Categories:</strong> <span style="color: #1e3a8a; font-weight: 600;">
                    @foreach($categories as $cat)
                        <span style="display: inline-block; padding: 2px 8px; background-color: #e2e8f0; color: #334155; border-radius: 4px; font-size: 11px; margin-right: 4px;">{{ $cat }}</span>
                    @endforeach
                </span></div>
                @endif
                
                @if(isset($countries) && count($countries) > 0)
                <div style="font-size: 14px;"><strong style="color: #64748b; width: 80px; display: inline-block;">Countries:</strong> <span style="color: #1e3a8a; font-weight: 600;">
                    @foreach($countries as $country)
                        <span style="display: inline-block; padding: 2px 8px; background-color: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 11px; margin-right: 4px;">{{ $country }}</span>
                    @endforeach
                </span></div>
                @endif
            </div>

            @if(count($articles) > 0)
                <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Latest tailoring for you</div>
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
                                $imageUrl = 'https://news.homes.ph/storage/' . $imageUrl;
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
                            <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="top-article-title">{{ $article->title }}</a>
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
                                        <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="list-article-title">{{ $article->title }}</a>
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
            @endif

            <div style="text-align: left;">
                <a href="{{ $actionUrl }}" class="btn">{{ $actionText }}</a>
            </div>
        </div>

        <div class="bottom-links">
            <div>
                <a href="https://news.homes.ph">News.Homes.ph</a> <span class="divider">|</span>
                <a href="https://news.homes.ph/privacy-policy">Privacy Policy</a> <span class="divider">|</span>
            </div>
            <div style="margin-top: 10px;">
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subId }}">Unsubscribe from this email</a> <span class="divider">|</span>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subId }}">Manage preferences</a>
            </div>
        </div>

        <table class="footer-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td class="footer-left">
                    &copy; {{ date('Y') }} Homes.ph News. All rights reserved.
                </td>
                <td class="footer-right">
                    <a href="#" class="social-icon">f</a>
                    <a href="#" class="social-icon">in</a>
                    <a href="#" class="social-icon">ig</a>
                    <a href="#" class="social-icon">X</a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
