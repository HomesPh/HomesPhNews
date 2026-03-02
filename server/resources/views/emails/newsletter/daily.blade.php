<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily News Digest - Homes.ph News</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        @media only screen and (max-width: 600px) {
            .article-title { font-size: 20px !important; }
            .article-summary { font-size: 13px !important; }
            .greeting { font-size: 22px !important; }
            .message { font-size: 13px !important; }
            .section-title { font-size: 13px !important; }
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            overflow: hidden;
            border-top: 5px solid #C10007;
        }

        .header {
            background-color: #111827;
            padding: 24px 20px;
            text-align: center;
        }

        .logo-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .logo-img {
            max-height: 24px;
            width: auto;
            margin-right: 12px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.04em;
        }

        .sub-header {
            background-color: #1f2937;
            padding: 12px;
            text-align: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.3em;
            text-transform: uppercase;
        }

        .content {
            padding: 40px 25px;
            color: #111827;
        }

        .greeting {
            font-size: 28px;
            font-weight: 900;
            color: #111827;
            margin-bottom: 12px;
            letter-spacing: -0.03em;
            text-align: left;
        }

        .message {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
            line-height: 1.6;
            text-align: left;
        }

        .tags-container {
            margin-bottom: 35px;
            text-align: left;
            line-height: 2.4;
        }

        .tag {
            display: inline-block;
            padding: 6px 16px;
            background-color: #f8fafc;
            color: #475569;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            margin-right: 4px;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }

        .connector {
            font-size: 14px;
            color: #64748b;
            margin: 0 8px;
            vertical-align: middle;
        }

        .section-title-wrapper {
            border-left: 4px solid #C10007;
            padding-left: 14px;
            margin: 40px 0 25px 0;
            text-align: left;
        }

        .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #111827;
            text-transform: none;
        }

        .article-card {
            display: block;
            text-decoration: none;
            color: inherit;
            margin-bottom: 30px;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 24px;
            text-align: left;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .article-image-wrapper {
            width: 100%;
            height: 250px;
            overflow: hidden;
            border-radius: 12px;
            background-color: #f3f4f6;
            margin-bottom: 20px;
        }

        .article-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .article-category {
            font-size: 11px;
            font-weight: 900;
            color: #C10007;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 0.05em;
        }

        .article-title {
            font-size: 24px;
            font-weight: 900;
            color: #111827;
            margin-bottom: 12px;
            line-height: 1.2;
            letter-spacing: -0.04em;
        }

        .article-summary {
            font-size: 14px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .btn {
            display: inline-block;
            background-color: #374151;
            color: #ffffff !important;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            text-align: center;
        }

        .preferences-box {
            background-color: #ffffff;
            border: 1px solid #f3f4f6;
            border-radius: 16px;
            padding: 30px;
            margin-top: 40px;
            text-align: left;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .preferences-title {
            font-weight: 800;
            color: #111827;
            font-size: 15px;
            margin-bottom: 8px;
        }

        .preferences-text {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 25px;
            line-height: 1.5;
        }

        .btn-preferences {
            background-color: #374151;
            color: #ffffff !important;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 800;
            text-decoration: none;
            display: inline-block;
        }

        .footer {
            background-color: #111827;
            padding: 60px 40px;
            color: #94a3b8;
            text-align: center;
        }

        .footer-logo {
            margin-bottom: 30px;
        }

        .logo-wrapper-footer {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            opacity: 0.6;
        }

        .footer-text {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo-wrapper">
                <img src="{{ $logo }}" alt="Homes.ph News" class="logo-img">
            </div>
        </div>
        <div class="sub-header">Daily News Digest</div>

        <div class="content">
            <h1 class="greeting">{{ $greeting }} {{ $greetingEmoji }}</h1>
            <div class="message">
                Here is your personalized news digest from <strong>Homes.ph News</strong>, tailored to your interests in 
                @foreach($subscriber->category as $cat)
                    <span class="tag">{{ $cat }}</span>
                @endforeach
                
                @if(count($subscriber->category) > 0 && count($subscriber->country) > 0)
                    <span class="connector">and</span>
                @endif
                
                @foreach($subscriber->country as $country)
                    <span class="tag">{{ $country }}</span>
                @endforeach.
            </div>

            <div class="section-title-wrapper">
                <h2 class="section-title">Top Stories for You</h2>
            </div>

            @foreach($articles as $article)
                @php
                    $imageUrl = null;
                    if ($article->image) {
                        if (is_array($article->image)) {
                            $imageUrl = $article->image[0] ?? null;
                        } else {
                            $imageUrl = $article->image;
                        }

                        if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
                            $imageUrl = 'https://homestv.ph/storage/' . $imageUrl;
                        }
                    }
                @endphp

                <div class="article-card">
                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}">
                        <div class="article-image-wrapper">
                            @if($imageUrl)
                                <img src="{{ $imageUrl }}" alt="{{ $article->title }}" class="article-image">
                            @endif
                        </div>
                    </a>
                    <div class="article-category">
                        @if($article->category) {{ $article->category }} @endif
                        @if($article->category && $article->country) | @endif
                        @if($article->country) {{ $article->country }} @endif
                    </div>
                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}" style="text-decoration: none;">
                        <div class="article-title">{{ $article->title }}</div>
                    </a>
                    <div class="article-summary">{{ Str::limit(strip_tags($article->summary), 160) }}</div>
                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="btn">Read Full Story</a>
                </div>
            @endforeach

            <div class="preferences-box">
                <div class="preferences-title">Manage your experience</div>
                <div class="preferences-text">
                    Want to change the topics or locations you follow? You can update your preferences anytime.
                </div>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}" class="btn-preferences">
                    Edit your Preferences
                </a>
            </div>
        </div>

        <div class="footer">
            <div class="footer-logo">
                <div class="logo-wrapper-footer">
                    <img src="{{ $logo }}" alt="Homes.ph News" style="max-height: 30px; width: auto;">
                </div>
            </div>
            <div class="footer-text">
                This email was sent to you because you subscribed to <strong>Homes.ph News Daily News</strong>.<br>
                We value your privacy and only send content based on your selected interests.<br>
                &copy; {{ date('Y') }} Homes.ph News. All rights reserved.
            </div>
            <div class="footer-links">
                <a href="https://news.homes.ph/privacy-policy">Privacy Policy</a>
                <a href="https://news.homes.ph/terms-and-policy">Terms & Policy</a>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>

</html>