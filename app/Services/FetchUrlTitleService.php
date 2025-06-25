<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use DOMDocument;

class FetchUrlTitleService
{
    public function __construct(
        public ?string $htmlBody = null,
    )
    {}

    public function getTitle(string $url): ?string
    {
        try {
            if (empty($this->htmlBody)) {
                $response = Http::timeout(10)->get($url);

                if (!$response->successful()) {
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
        $dom = new DOMDocument();

        if (!$dom->loadHTML($html)) {
            return null;
        }

        libxml_clear_errors();

        $titles = $dom->getElementsByTagName('title');

        return $titles->length > 0
            ? trim($titles->item(0)->nodeValue)
            : null;
    }
}
