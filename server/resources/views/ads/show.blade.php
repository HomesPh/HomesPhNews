<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ad Display</title>
    <style>
        /* ============================================================
           Reset & Base
           ============================================================ */
        *,
        *::before,
        *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            overflow: hidden;
            background: transparent;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* ============================================================
           Common
           ============================================================ */
        a {
            text-decoration: none;
            color: inherit;
            display: block;
            width: 100%;
            height: 100%;
        }

        .ad-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 6px;
        }

        .ad-badge {
            position: absolute;
            top: 6px;
            right: 6px;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #fff;
            font-size: 9px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            padding: 3px 7px;
            border-radius: 4px;
            z-index: 10;
            pointer-events: none;
            font-weight: 600;
        }

        /* ============================================================
           Image Ad
           ============================================================ */
        .image-ad {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #0a0a0a;
        }

        .image-ad img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
            transition: transform 0.35s ease, filter 0.35s ease;
        }

        .ad-container:hover .image-ad img {
            transform: scale(1.02);
            filter: brightness(1.05);
        }

        /* ============================================================
           Carousel
           ============================================================ */
        .carousel {
            position: relative;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
        }

        .carousel-track {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .carousel-slide {
            min-width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .carousel-slide img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        /* Nav arrows */
        .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) scale(0.92);
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            cursor: pointer;
            padding: 0;
            font-size: 16px;
            z-index: 5;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.25s ease;
            opacity: 0;
        }

        .carousel:hover .carousel-nav {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }

        .carousel-nav:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .carousel-prev { left: 10px; }
        .carousel-next { right: 10px; }

        /* Dots */
        .carousel-dots {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 5;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            padding: 5px 8px;
            border-radius: 20px;
        }

        .carousel-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.35);
            cursor: pointer;
            border: none;
            padding: 0;
            transition: all 0.3s ease;
        }

        .carousel-dot:hover {
            background: rgba(255, 255, 255, 0.65);
        }

        .carousel-dot.active {
            background: #fff;
            width: 18px;
            border-radius: 10px;
        }

        /* ============================================================
           Text Ad — image as full background, text overlaid
           ============================================================ */
        .text-ad {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            text-align: left;
            position: relative;
            padding: 20px;
            background: #0a0a0a;
            overflow: hidden;
        }

        /* Background image */
        .text-ad-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.45s ease, filter 0.45s ease;
        }

        .text-ad:hover .text-ad-bg {
            transform: scale(1.04);
            filter: brightness(1.05);
        }

        /* Dark gradient overlay for text readability */
        .text-ad-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.75) 0%,
                rgba(0, 0, 0, 0.30) 50%,
                rgba(0, 0, 0, 0.05) 100%
            );
            z-index: 1;
            pointer-events: none;
        }

        /* Text content sits above the overlay */
        .text-ad-content {
            position: relative;
            z-index: 2;
        }

        .text-ad-headline {
            font-size: 17px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 4px;
            line-height: 1.35;
            letter-spacing: -0.2px;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }

        .text-ad-cta {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.85);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: gap 0.2s ease;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .text-ad:hover .text-ad-cta {
            gap: 8px;
            color: #fff;
        }

        .text-ad-cta::after {
            content: '→';
            font-size: 14px;
            transition: transform 0.2s ease;
        }

        .text-ad:hover .text-ad-cta::after {
            transform: translateX(2px);
        }

        /* ============================================================
           Empty / Inactive State
           ============================================================ */
        .empty-state {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f8f9fb 0%, #eef0f4 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #b0b7c3;
            font-size: 11px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            border: 1px dashed #d5dae3;
            box-sizing: border-box;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    @if(isset($campaign) && $campaign && $campaign->status === 'active')
        @php
            // Ensure target_url is a valid http/https link to prevent XSS (e.g. javascript:)
            $safeTargetUrl = $campaign->target_url ?? '#';
            $scheme = is_string($safeTargetUrl) ? parse_url($safeTargetUrl, PHP_URL_SCHEME) : null;
            if (!$scheme || !in_array(strtolower($scheme), ['http', 'https'], true)) {
                $safeTargetUrl = '#';
            }
        @endphp
        <a href="{{ $safeTargetUrl }}" target="_blank" rel="noopener noreferrer" class="ad-container">
            <div class="ad-badge">Ad</div>

            @if($adUnit->type === 'image')
                @php
                    $banners = $campaign->banner_image_urls ?? [];
                @endphp

                @if(count($banners) > 1)
                    <!-- Carousel -->
                    <div class="carousel" id="adCarousel">
                        <div class="carousel-track" id="carouselTrack">
                            @foreach($banners as $index => $banner)
                                <div class="carousel-slide">
                                    <img src="{{ $banner }}" alt="{{ $campaign->name }} - {{ $index + 1 }}">
                                </div>
                            @endforeach
                        </div>
                        
                        <button class="carousel-nav carousel-prev" id="prevBtn" onclick="event.preventDefault();">&#10094;</button>
                        <button class="carousel-nav carousel-next" id="nextBtn" onclick="event.preventDefault();">&#10095;</button>

                        <div class="carousel-dots" id="carouselDots">
                            @foreach($banners as $index => $banner)
                                <button class="carousel-dot {{ $index === 0 ? 'active' : '' }}" data-index="{{ $index }}" onclick="event.preventDefault();"></button>
                            @endforeach
                        </div>
                    </div>
                @elseif(count($banners) === 1)
                     <!-- Single Image -->
                    <div class="image-ad">
                        <img src="{{ $banners[0] }}" alt="{{ $campaign->name }}">
                    </div>
                @else
                    <!-- Fallback if no images found but type is image -->
                    <div class="empty-state">No Image Available</div>
                @endif

            @elseif($adUnit->type === 'text')
                <!-- Text Ad — image as full background -->
                <div class="text-ad">
                    @if($campaign->image_url)
                        <img class="text-ad-bg" src="{{ $campaign->image_url }}" alt="{{ $campaign->headline ?? $campaign->name }}">
                    @endif
                    <div class="text-ad-overlay"></div>
                    <div class="text-ad-content">
                        <div class="text-ad-headline">{{ $campaign->headline ?? $campaign->name }}</div>
                    </div>
                </div>
            @endif
        </a>
    @else
        <!-- Empty or Inactive State -->
        <div class="empty-state">
            Sponsored
        </div>
    @endif

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // --- Carousel Logic ---
            const track = document.getElementById('carouselTrack');
            
            // Only initialize carousel if track exists
            if (track) {
                const slides = document.querySelectorAll('.carousel-slide');
                const dots = document.querySelectorAll('.carousel-dot');
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                let currentIndex = 0;
                const totalSlides = slides.length;
                let autoPlayInterval;

                function updateCarousel() {
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }

                function nextSlide() {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                }

                function prevSlide() {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateCarousel();
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent link click
                        nextSlide();
                        resetAutoPlay();
                    });
                }

                if (prevBtn) {
                    prevBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent link click
                        prevSlide();
                        resetAutoPlay();
                    });
                }

                dots.forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent link click
                        currentIndex = parseInt(dot.getAttribute('data-index'));
                        updateCarousel();
                        resetAutoPlay();
                    });
                });

                function startAutoPlay() {
                    autoPlayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
                }

                function resetAutoPlay() {
                    clearInterval(autoPlayInterval);
                    startAutoPlay();
                }

                if (totalSlides > 1) {
                    startAutoPlay();
                }
            }

            // --- Metrics Tracking ---
            const adUnitId = "{{ $adUnit->id }}";
            // Use fallback to empty string if campaign is not set
            const campaignId = "{{ $campaign->id ?? '' }}";
            const metricsEndpoint = "/api/v1/ads/metrics";

            console.log('Ad Metrics Init:', { adUnitId, campaignId });

            // Helper to send metric
            function sendMetric(type) {
                if (!adUnitId) return;

                const payload = {
                    ad_unit_id: adUnitId,
                    type: type
                };

                if (campaignId) {
                    payload.campaign_id = campaignId;
                }

                fetch(metricsEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    console.log('Ad Metric recorded:', type);
                })
                .catch(error => console.error('Error recording metric:', error));
            }

            // Record Impression
            sendMetric('impression');

            // Record Click
            const adContainer = document.querySelector('.ad-container');
            if (adContainer) {
                adContainer.addEventListener('click', function() {
                    sendMetric('click');
                });
            }
        });
    </script>
</body>
</html>
