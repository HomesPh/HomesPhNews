<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily News Digest - HomesTV</title>
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

        .sub-header {
            background-color: #1f2937;
            padding: 14px;
            text-align: center;
            color: #f3f4f6;
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .content {
            padding: 35px 30px;
            color: #1f2937;
            line-height: 1.6;
        }

        .greeting {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 10px;
            letter-spacing: -0.02em;
        }

        .message {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 25px;
        }

        .article-card {
            display: block;
            text-decoration: none;
            color: inherit;
            margin-bottom: 32px;
            background-color: #ffffff;
            border: 1px solid #f1f5f9;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            transition: transform 0.2s ease;
        }

        .article-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
            background-color: #f8fafc;
            display: block;
        }

        .article-body {
            padding: 24px 28px;
        }

        .article-category {
            font-size: 10px;
            font-weight: 900;
            color: #C10007; /* HomesTV Red */
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.15em;
        }

        .article-title {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 12px;
            line-height: 1.3;
            letter-spacing: -0.03em;
        }

        .article-summary {
            font-size: 14px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.65;
        }

        .btn {
            display: inline-block;
            background-color: #334155;
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            margin-top: 15px;
            text-align: center;
        }

        .btn-secondary {
            /* Same as primary but can be tweaked if needed */
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
            padding: 6px 12px;
            background-color: #f8fafc;
            color: #64748b;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            margin-right: 6px;
            margin-bottom: 6px;
            border: 1px solid #e2e8f0;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo-wrapper">
                <img src="{{ $logo }}" alt="" class="logo-img">
                <span class="logo-text">HomesPH News</span>
            </div>
        </div>
        <div class="sub-header">Daily News Digest</div>

        <div class="content">
            <h1 class="greeting">{{ $greeting }} {{ $greetingEmoji }}</h1>
            <p class="message">
                Here is your personalized news digest from <strong>HomesTV</strong>,
                tailored to your interests in
                @foreach($subscriber->category as $cat)<span class="tag">{{ $cat }}</span>@endforeach
                and
                @foreach($subscriber->country as $country)<span class="tag">{{ $country }}</span>@endforeach.
            </p>

            <div style="margin-bottom: 25px; border-left: 4px solid #0f172a; padding-left: 15px;">
                <h2 style="font-size: 16px; font-weight: 700; margin: 0; color: #0f172a;">Top Stories for You</h2>
            </div>

            @foreach($articles as $article)
                @php
                    // Handle image field (can be array or string)
                    $imageUrl = null;
                    if ($article->image) {
                        if (is_array($article->image)) {
                            $imageUrl = $article->image[0] ?? null;
                        } else {
                            $imageUrl = $article->image;
                        }

                        // Add full URL if not already absolute
                        if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
                            $imageUrl = 'https://homestv.ph/storage/' . $imageUrl;
                        }
                    }
                @endphp

                <a href="{{ $clientUrl }}/article?id={{ $article->id }}" class="article-card">
                    @if($imageUrl)
                        <img src="{{ $imageUrl }}" alt="{{ $article->title }}" class="article-image">
                    @endif
                    <div class="article-body">
                        <div class="article-category">{{ $article->category }} | {{ $article->country }}</div>
                        <div class="article-title">{{ $article->title }}</div>
                        <div class="article-summary">{{ Str::limit(strip_tags($article->summary), 140) }}</div>
                        <span class="btn">Read Full Story</span>
                    </div>
                </a>
            @endforeach

            <div
                style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-top: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Manage your experience</div>
                <div style="font-size: 14px; color: #475569; margin-bottom: 24px;">
                    Want to change the topics or locations you follow? You can update your preferences anytime.
                </div>
                <div style="text-align: left;">
                    <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}" class="btn btn-secondary">
                        Edit your Preferences
                    </a>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-logo">
                <img src="{{ $logo }}" alt="" style="max-height: 22px; width: auto; opacity: 0.6; filter: grayscale(1);">
            </div>
            <div class="footer-text">
                This email was sent to you because you subscribed to <strong>HomesTV Daily News</strong>.<br>
                We value your privacy and only send content based on your selected interests.<br>
                &copy; {{ date('Y') }} HomesTV. All rights reserved.
            </div>
            <div class="footer-links">
                <a href="{{ $clientUrl }}/privacy-policy">Privacy Policy</a>
                <a href="{{ $clientUrl }}/terms">Terms of Service</a>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>

</html>