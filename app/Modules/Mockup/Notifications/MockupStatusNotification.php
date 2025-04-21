<?php

namespace App\Modules\Mockup\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MockupStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $mockup;
    public $message;

    public function __construct($mockup, $message)
    {
        $this->mockup = $mockup;
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // Send via email & store in DB
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Mockup Status Update")
            ->line($this->message)
            ->action('View Mockup', url('/mockups/' . $this->mockup->id));
    }

    public function toArray($notifiable)
    {
        return [
            'mockup_id' => $this->mockup->id,
            'message' => $this->message,
        ];
    }
}