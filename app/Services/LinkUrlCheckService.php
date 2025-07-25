<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinkUrlCheckService
{
    public function isLinkBroken(string $url): bool
    {
        try {
            if (preg_match('#^(https?://)?(www\.)?(youtube\.com/watch|youtu\.be/)#i', $url)) {
                return $this->isYouTubeLinkUnavailable($url);
            }

            $response = Http::timeout(30)->get($url);
            if ($response->failed()) {
                return true;
            }

            return $response->getStatusCode() >= 300;
        } catch (\Throwable $e) {
            Log::error("LinkUrlCheckService connection error ({$e->getMessage()})");

            return true;
        }
    }

    protected function isYouTubeLinkUnavailable(string $url): bool
    {
        $response = Http::timeout(30)
            ->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
            ])
            ->get($url);

        if ($response->failed()) {
            return true;
        }
        $body = $response->body();

        return str_contains($body, 'unavailable_video.png');
    }
}
