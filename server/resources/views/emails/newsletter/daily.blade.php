<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily News Digest - HomesTV</title>
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
            padding: 25px;
            text-align: center;
        }
        .header img {
            max-height: 35px;
            filter: brightness(0) invert(1);
        }
        .sub-header {
            background-color: #111827;
            padding: 15px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
        .content {
            padding: 35px 30px;
            color: #1f2937;
            line-height: 1.6;
        }
        .greeting {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
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
            margin-bottom: 25px;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s;
        }
        .article-image {
            width: 100%;
            height: 200px;
            object-cover: cover;
            background-color: #f3f4f6;
        }
        .article-body {
            padding: 20px;
        }
        .article-category {
            font-size: 11px;
            font-weight: 800;
            color: #c10007;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
        }
        .article-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        .article-summary {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
        }
        .btn-link {
            font-size: 14px;
            font-weight: 700;
            color: #c10007;
            text-decoration: none;
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
        .tag {
            display: inline-block;
            padding: 2px 8px;
            background-color: #f3f4f6;
            color: #4b5563;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ $logo }}" alt="HomesTV" style="max-height:35px; filter:brightness(0) invert(1);">
        </div>
        <div class="sub-header">Daily News Digest</div>
        
        <div class="content">
            <h1 class="greeting">Good Morning! ☀️</h1>
            <p class="message">
                Here is your personalized news digest from <strong>HomesTV</strong>, 
                tailored to your interests in 
                @foreach($subscriber->category as $cat)<span class="tag">{{ $cat }}</span>@endforeach
                and 
                @foreach($subscriber->country as $country)<span class="tag">{{ $country }}</span>@endforeach.
            </p>
            
            <div style="margin-bottom: 25px; border-left: 4px solid #c10007; padding-left: 15px;">
                <h2 style="font-size: 16px; font-weight: 700; margin: 0; color: #111827;">Top Stories for You</h2>
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
                        <div class="article-summary">{{ Str::limit($article->summary, 140) }}</div>
                        <div class="btn-link">Read Full Story &rarr;</div>
                    </div>
                </a>
            @endforeach

            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <div style="font-weight: 700; color: #92400e; margin-bottom: 5px;">Manage your experience</div>
                <div style="font-size: 14px; color: #b45309; margin-bottom: 15px;">
                    Want to change the topics or locations you follow? You can update your preferences anytime.
                </div>
                <a href="{{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }}" style="font-size: 14px; font-weight: 700; color: #c10007; text-decoration: none;">
                    Edit Preferences &rarr;
                </a>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                This email was sent to you because you subscribed to HomesTV Daily News.<br>
                &copy; {{ date('Y') }} HomesTV. 133 MH Aznar St, Cebu City, 6000 Cebu All rights reserved.
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
