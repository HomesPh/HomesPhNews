<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #c10007;
            padding: 30px;
            text-align: center;
        }
        .header img {
            max-height: 40px;
            filter: brightness(0) invert(1);
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
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .info-title {
            font-size: 13px;
            font-weight: 700;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 15px;
        }
        .info-item {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: 600;
            color: #374151;
            width: 100px;
            flex-shrink: 0;
        }
        .info-value {
            color: #111827;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
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
            color: #c10007;
            margin-bottom: 5px;
        }
        .article-summary {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        .btn {
            display: inline-block;
            background-color: #c10007;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none;
            margin-top: 20px;
            text-align: center;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 15px;
        }
        .footer-links a {
            color: #6b7280;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
        }
        .footer-links a:hover {
            color: #c10007;
        }
        .tag {
            display: inline-block;
            padding: 2px 8px;
            background-color: #fee2e2;
            color: #c10007;
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
            <img src="https://news.homes.ph/images/HomesTV.png" alt="HomesTV">
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
            <div class="footer-text">
                &copy; {{ date('Y') }} HomesTV. All rights reserved.<br>
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
