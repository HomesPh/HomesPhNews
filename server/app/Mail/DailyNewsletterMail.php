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
        $this->clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Use public URL for the logo (Gmail blocks base64 and embedded images)
        $logo = $this->clientUrl . '/images/HomesTV.png';
        
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
