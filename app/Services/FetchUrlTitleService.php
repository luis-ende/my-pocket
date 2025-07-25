<?php

namespace App\Services;

use DOMDocument;
use Illuminate\Support\Facades\Http;

class FetchUrlTitleService
{
    public function __construct(
        public ?string $htmlBody = null,
    ) {}

    public function getTitle(string $url): ?string
    {
        try {
            if (empty($this->htmlBody)) {
                $response = Http::timeout(10)
                    ->withHeaders([
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                        'Accept-Language' => 'en-US,en;q=0.9',
                        'Accept-Encoding' => 'gzip, deflate, br',
                    ])
                    ->withOptions(['allow_redirects' => true])
                    ->get($url);

                if (! $response->successful()) {
                    return null;
                }

                $this->htmlBody = $response->body();
            }

            $regexTitle = $this->extractTitleWithRegex($this->htmlBody);
            if ($regexTitle !== null) {
                return $regexTitle;
            }

            return $this->extractTitleWithDom($this->htmlBody);

        } catch (\Exception $e) {
            return null;
        }
    }

    public function generateTitleFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH);
        $segments = explode('/', trim($path, '/'));
        $lastSegment = end($segments);
        $title = ucwords(str_replace('-', ' ', $lastSegment));

        return $title;
    }

    private function extractTitleWithRegex(string $html): ?string
    {
        if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private function extractTitleWithDom(string $html): ?string
    {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument;

        if (! $dom->loadHTML($html)) {
            return null;
        }

        libxml_clear_errors();

        $titles = $dom->getElementsByTagName('title');

        return $titles->length > 0
            ? trim($titles->item(0)->nodeValue)
            : null;
    }
}
