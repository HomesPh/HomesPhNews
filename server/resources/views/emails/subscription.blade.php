<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f4f7fa;
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
            color: #ffffff !important;
            letter-spacing: -0.04em;
            text-decoration: none;
            display: inline-block;
        }

        .logo-dot-ph {
            font-weight: 500;
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
        .info-card {
            background-color: #ffffff;
            border: 1px solid #f3f4f6;
            border-radius: 16px;
            padding: 30px;
            margin-top: 40px;
            margin-bottom: 40px;
            text-align: left;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .info-title {
            font-weight: 800;
            color: #111827;
            font-size: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            display: flex;
            margin-bottom: 12px;
        }
        .info-label {
            font-weight: 700;
            color: #64748b;
            font-size: 13px;
            width: 100px;
            flex-shrink: 0;
            display: inline-block;
        }
        .info-value {
            color: #1a1d2e;
            font-size: 14px;
            font-weight: 600;
        }
        .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 25px;
            border-left: 4px solid #C10007;
            padding-left: 14px;
            text-align: left;
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
        .article-card:last-child {
            border-bottom: 1px solid #e5e7eb;
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
            letter-spacing: 0.02em;
        }
        .tag {
            display: inline-block;
            padding: 4px 10px;
            background-color: #f1f5f9;
            color: #475569;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            margin-right: 6px;
            border: 1px solid #e2e8f0;
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
        .tag {
            display: inline-block;
            padding: 4px 10px;
            background-color: #f1f5f9;
            color: #475569;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            margin-right: 6px;
            border: 1px solid #e2e8f0;
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
            margin: 0 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .tag {
            display: inline-block;
            padding: 2px 8px;
            background-color: #f1f5f9;
            color: #334155;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-wrapper">
                <span class="logo-text">Homes<span class="logo-dot-ph">.ph</span> News</span>
            </div>
        </div>
        
        <div class="content">
            <h1 class="greeting">{{ $title }}</h1>
            <p class="message">{{ $messageText }}</p>
            
            <div class="info-card">
                <div class="info-title">Subscription Details</div>
                <div class="info-item">
                    <div class="info-label">Email:</div>
                    <div class="info-value">{{ $email }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Categories:</div>
                    <div class="info-value">
                        @foreach($categories as $cat)
                            <span class="tag">{{ $cat }}</span>
                        @endforeach
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Countries:</div>
                    <div class="info-value">
                        @foreach($countries as $country)
                            <span class="tag" style="background-color: #e0f2fe; color: #0369a1;">{{ $country }}</span>
                        @endforeach
                    </div>
                </div>
            </div>

            @if(count($articles) > 0)
                <div class="section-title">Latest tailoring for you</div>
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
                                $imageUrl = 'https://news.homes.ph/storage/' . $imageUrl;
                            }
                        }
                    @endphp
                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="article-card">
                        @if($imageUrl)
                            <div class="article-image-wrapper">
                                <img src="{{ $imageUrl }}" alt="{{ $article->title }}" class="article-image">
                            </div>
                        @endif
                        <div class="article-title">{{ $article->title }}</div>
                        <div class="article-summary">{{ Str::limit(strip_tags($article->summary), 120) }}</div>
                        <div style="font-size: 12px; font-weight: 600; color: #9ca3af;">Read more &rarr;</div>
                    </a>
                @endforeach
            @endif

            <div style="text-align: left;">
                <a href="{{ $actionUrl }}" class="btn">{{ $actionText }}</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-logo">
                <div class="logo-wrapper-footer">
                    <span class="logo-text" style="font-size: 20px;">Homes<span class="logo-dot-ph">.ph</span> News</span>
                </div>
            </div>
            <div class="footer-text">
                This email was sent to you because you are a registered user of <strong>Homes.ph News</strong>.<br>
                &copy; {{ date('Y') }} Homes.ph News. All rights reserved.
            </div>
            <div class="footer-links">
                <a href="{{ $clientUrl }}/privacy-policy">Privacy Policy</a>
                <a href="{{ $clientUrl }}/terms-and-policy">Terms of Service</a>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subId }}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>
</html>
