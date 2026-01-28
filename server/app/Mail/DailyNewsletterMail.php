<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Daily HomesTV News Digest',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.newsletter.daily',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
