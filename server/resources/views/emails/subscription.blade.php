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

        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
            border: 1px solid #eef2f6;
            border-top: 6px solid #C10007; /* HomesTV Red */
        }

        .header {
            background-color: #111827;
            padding: 32px 20px;
            text-align: center;
            border-bottom: none;
        }

        .logo-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .logo-img {
            max-height: 28px;
            width: auto;
            margin-right: 12px;
        }

        .logo-text {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.04em;
            font-family: 'Inter', sans-serif;
        }
        .content {
            padding: 40px 30px;
            color: #1f2937;
            line-height: 1.6;
        }
        .greeting {
            font-size: 24px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 10px;
            letter-spacing: -0.025em;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
        }
        .info-card {
            background-color: #ffffff;
            border: 2px solid #f1f5f9;
            border-radius: 14px;
            padding: 25px;
            margin-bottom: 30px;
        }
        .info-title {
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
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
            font-size: 16px;
            font-weight: 800;
            color: #1a1d2e;
            margin-bottom: 20px;
            border-left: 4px solid #1a1d2e;
            padding-left: 15px;
        }
        .article-card {
            display: block;
            text-decoration: none;
            color: inherit;
            margin-bottom: 20px;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 20px;
        }
        .article-card:last-child {
            border-bottom: none;
        }
        .article-title {
            font-size: 16px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 5px;
        }
        .article-summary {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        .btn {
            display: inline-block;
            background-color: #334155;
            color: #ffffff !important;
            padding: 14px 30px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            margin-top: 20px;
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
        .footer {
            background-color: #111827;
            padding: 50px 30px;
            color: #94a3b8;
            text-align: center;
        }

        .footer-logo {
            margin-bottom: 25px;
            opacity: 0.8;
        }

        .footer-text {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 24px;
            line-height: 1.6;
        }

        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 12px;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 1px solid rgba(148, 163, 184, 0.2);
            padding-bottom: 2px;
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
                <img src="https://news.homes.ph/images/HomesTV.png" alt="" class="logo-img">
                <span class="logo-text">HomesTV</span>
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
                    <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="article-card">
                        <div class="article-title">{{ $article->title }}</div>
                        <div class="article-summary">{{ Str::limit($article->summary, 120) }}</div>
                        <div style="font-size: 12px; font-weight: 600; color: #9ca3af;">Read more &rarr;</div>
                    </a>
                @endforeach
            @endif

            <div style="text-align: center;">
                <a href="{{ $actionUrl }}" class="btn">{{ $actionText }}</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-logo">
                <img src="https://news.homes.ph/images/HomesTV.png" alt="" style="max-height: 22px; width: auto; opacity: 0.6; filter: grayscale(1);">
            </div>
            <div class="footer-text">
                This email was sent to you because you are a registered user of <strong>HomesTV</strong>.<br>
                &copy; {{ date('Y') }} HomesTV. All rights reserved.
            </div>
            <div class="footer-links">
                <a href="{{ $clientUrl }}/privacy-policy">Privacy Policy</a>
                <a href="{{ $clientUrl }}/terms-and-policy">Terms of Service</a>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subId }}">Preference Center</a>
            </div>
        </div>
    </div>
</body>
</html>
