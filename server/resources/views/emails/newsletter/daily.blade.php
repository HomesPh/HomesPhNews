<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily News Digest - HomesTV</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f1f5f9;
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
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }

        .header {
            background-color: #ffffff;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 2px solid #f1f5f9;
        }

        .header img {
            max-height: 35px;
        }

        .sub-header {
            background-color: #0f172a;
            padding: 18px;
            text-align: center;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
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
            margin-bottom: 30px;
            background-color: #ffffff;
            border: 2px solid #f1f5f9;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .article-image {
            width: 100%;
            height: auto;
            background-color: #f3f4f6;
            display: block;
        }

        .article-body {
            padding: 20px;
        }

        .article-category {
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
        }

        .article-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            line-height: 1.4;
        }

        .article-summary {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
        }

        .btn-link {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .footer {
            background-color: #060e21ff;
            padding: 40px 30px;
            color: #94a3b8;
            text-align: center;
        }

        .footer-text {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .footer-links a {
            color: #6b7280;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
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
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="{{ $logo }}" alt="HomesTV" width="120" style="display: block; margin: 0 auto; max-height: 40px; border: 0;">
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
                        <div class="btn-link">Read Full Story &rarr;</div>
                    </div>
                </a>
            @endforeach

            <div
                style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-top: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Manage your experience</div>
                <div style="font-size: 14px; color: #475569; margin-bottom: 18px;">
                    Want to change the topics or locations you follow? You can update your preferences anytime.
                </div>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}"
                    style="font-size: 14px; font-weight: 700; color: #0f172a; text-decoration: none;">
                    Edit Preferences &rarr;
                </a>
            </div>
        </div>

        <div class="footer">
            <div class="footer-text">
                This email was sent to you because you subscribed to HomesTV Daily News.<br>
                &copy; {{ date('Y') }} HomesTV all rights reserved.
            </div>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}">Unsubscribe</a>
            </div>
        </div>
    </div>
</body>

</html>