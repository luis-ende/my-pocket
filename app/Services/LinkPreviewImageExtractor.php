<?php

namespace App\Services;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinkPreviewImageExtractor
{
    protected string $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    public function __construct(
        public ?string $htmlBody = null,
    ) {}

    public function extractPreviewImage(string $url): ?string
    {
        try {
            if (empty($this->htmlBody)) {
                $response = Http::withHeaders([
                    'User-Agent' => $this->userAgent,
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language' => 'en-US,en;q=0.5',
                    'Accept-Encoding' => 'gzip, deflate',
                    'Connection' => 'keep-alive',
                ])->timeout(30)->get($url);

                if (! $response->successful()) {
                    return null;
                }

                $this->htmlBody = $response->body();
            }

            return $this->parseMetaTags($this->htmlBody, $url);
        } catch (\Exception $e) {
            Log::error("LinkPreviewImageExtractor exception ({$url}): ".$e->getMessage());

            return null;
        }
    }

    public function clearContent(): void
    {
        $this->htmlBody = null;
    }

    protected function parseMetaTags(string $html, string $baseUrl): ?string
    {
        $dom = new DOMDocument;
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // Open Graph image
        $ogImages = $xpath->query('//meta[@property="og:image"]/@content');
        foreach ($ogImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                return $imageUrl;
            }
        }

        // Twitter card image
        $twitterImages = $xpath->query('//meta[@name="twitter:image"]/@content | //meta[@property="twitter:image"]/@content');
        foreach ($twitterImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                return $imageUrl;
            }
        }

        // Schema.org image
        $schemaImages = $xpath->query('//meta[@itemprop="image"]/@content');
        foreach ($schemaImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                return $imageUrl;
            }
        }

        // Link rel image_src
        $linkImages = $xpath->query('//link[@rel="image_src"]/@href');
        foreach ($linkImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                return $imageUrl;
            }
        }

        // If no meta images found, try to find large images in content
        $imageUrl = $this->findContentImages($xpath, $baseUrl);
        if (! empty($imageUrl)) {
            return $imageUrl;
        }

        return null;
    }

    protected function findContentImages(DOMXPath $xpath, string $baseUrl): ?string
    {
        $imgTags = $xpath->query("//img[not(contains(translate(@src, 'GIF', 'gif'), '.gif'))]");

        foreach ($imgTags as $img) {
            $src = $img->getAttribute('src');
            $alt = $img->getAttribute('alt');
            $width = $img->getAttribute('width');
            $height = $img->getAttribute('height');

            if (! $src) {
                continue;
            }

            $imageUrl = $this->resolveUrl($src, $baseUrl);

            if (! $width || ! $height) {
                $size = @getimagesize($imageUrl);
                if ($size !== false) {
                    $width = $size[0];
                    $height = $size[1];
                } else {
                    continue;
                }
            }

            if ($imageUrl && $this->isLikelyPreviewImage($alt, $width, $height)) {
                return $imageUrl;
            }
        }

        return null;
    }

    protected function isLikelyPreviewImage(string $alt, string $width, string $height): bool
    {
        $w = intval($width);
        $h = intval($height);
        // Skip small images, logos, icons
        if ($w < 100 || $h < 100) {
            return false;
        }

        // Skip common non-preview image alt texts
        $skipPatterns = ['logo', 'icon', 'avatar', 'button', 'arrow', 'bullet'];
        $altLower = strtolower($alt);

        foreach ($skipPatterns as $pattern) {
            if (str_contains($altLower, $pattern)) {
                return false;
            }
        }

        return true;
    }

    protected function resolveUrl(string $url, string $baseUrl): ?string
    {
        if (empty($url)) {
            return null;
        }

        // Already absolute URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        // Protocol relative URL
        if (str_starts_with($url, '//')) {
            $parsedBase = parse_url($baseUrl);

            return $parsedBase['scheme'].':'.$url;
        }

        // Relative URL
        $parsedBase = parse_url($baseUrl);
        $baseScheme = $parsedBase['scheme'] ?? 'https';
        $baseHost = $parsedBase['host'] ?? '';
        $basePath = $parsedBase['path'] ?? '';

        if (str_starts_with($url, '/')) {
            // Absolute path
            return $baseScheme.'://'.$baseHost.$url;
        } else {
            // Relative path
            $basePath = dirname($basePath);
            if ($basePath === '.') {
                $basePath = '';
            }

            return $baseScheme.'://'.$baseHost.$basePath.'/'.$url;
        }
    }
}
