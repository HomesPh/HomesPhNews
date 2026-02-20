<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DailyNewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriber;
    public $articles;
    public $clientUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($subscriber, $articles)
    {
        $this->subscriber = $subscriber;
        $this->articles = $articles;
        // Hardcode production URL to avoid env/config caching issues during newsletter broadcast
        $this->clientUrl = 'https://news.homes.ph';
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Use the main homestv.ph domain which hosts the images
        $logo = 'https://news.homes.ph/images/HomesTV.png';
        
        return $this->subject('Your Daily HomesTV News Digest')
                    ->view('emails.newsletter.daily')
                    ->with([
                        'logo' => $logo,
                        'subscriber' => $this->subscriber,
                        'articles' => $this->articles,
                        'clientUrl' => $this->clientUrl,
                    ]);
    }
}
