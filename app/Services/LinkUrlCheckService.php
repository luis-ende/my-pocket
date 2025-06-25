<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class LinkUrlCheckService
{
    public function isLinkBroken(string $url): bool
    {
        if (preg_match('#^(https?://)?(www\.)?(youtube\.com/watch|youtu\.be/)#i', $url)) {
            return $this->isYouTubeLinkUnavailable($url);
        }

        $headers = @get_headers($url);
        if (!$headers) return true;
        $statusCode = substr($headers[0], 9, 3);

        return intval($statusCode) >= 300;
    }

    protected function isYouTubeLinkUnavailable(string $url): bool
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
                ])
                ->get($url);

            if ($response->failed()) {
                return true;
            }
            $body = $response->body();

            return str_contains($body, 'unavailable_video.png');
        } catch (\Exception $e) {
            return true;
        }
    }
}
