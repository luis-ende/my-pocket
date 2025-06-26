<?php

namespace App\Services;

use DOMDocument;
use DOMXPath;
use Illuminate\Support\Facades\Http;

class LinkPreviewImageExtractor
{
    protected string $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    public function __construct(
        public ?string $htmlBody = null,
    )
    {}

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

                if (!$response->successful()) {
                    return null;
                }

                $this->htmlBody = $response->body();
            }

            $images = $this->parseMetaTags($this->htmlBody, $url);

            if (!empty($this->selectPrimaryImage($images))) {
                return $this->selectPrimaryImage($images)['url'];
            }

            return null;

        } catch (\Exception $e) {
            return null;
        }
    }

    public function clearContent(): void
    {
        $this->htmlBody = null;
    }

    protected function parseMetaTags(string $html, string $baseUrl): array
    {
        $dom = new DOMDocument();
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        $images = [];

        // Open Graph image
        $ogImages = $xpath->query('//meta[@property="og:image"]/@content');
        foreach ($ogImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                $images[] = [
                    'type' => 'og:image',
                    'url' => $imageUrl,
                    'priority' => 1
                ];
            }
        }

        // Twitter card image
        $twitterImages = $xpath->query('//meta[@name="twitter:image"]/@content | //meta[@property="twitter:image"]/@content');
        foreach ($twitterImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                $images[] = [
                    'type' => 'twitter:image',
                    'url' => $imageUrl,
                    'priority' => 2
                ];
            }
        }

        // Schema.org image
        $schemaImages = $xpath->query('//meta[@itemprop="image"]/@content');
        foreach ($schemaImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                $images[] = [
                    'type' => 'schema:image',
                    'url' => $imageUrl,
                    'priority' => 3
                ];
            }
        }

        // Link rel image_src
        $linkImages = $xpath->query('//link[@rel="image_src"]/@href');
        foreach ($linkImages as $image) {
            $imageUrl = $this->resolveUrl($image->nodeValue, $baseUrl);
            if ($imageUrl) {
                $images[] = [
                    'type' => 'link:image_src',
                    'url' => $imageUrl,
                    'priority' => 4
                ];
            }
        }

        // If no meta images found, try to find large images in content
        if (empty($images)) {
            $contentImages = $this->findContentImages($xpath, $baseUrl);
            $images = array_merge($images, $contentImages);
        }

        return $images;
    }

    protected function findContentImages(DOMXPath $xpath, string $baseUrl): array
    {
        $images = [];
        $imgTags = $xpath->query('//img[@src]');

        foreach ($imgTags as $img) {
            $src = $img->getAttribute('src');
            $alt = $img->getAttribute('alt');
            $width = $img->getAttribute('width');
            $height = $img->getAttribute('height');

            $imageUrl = $this->resolveUrl($src, $baseUrl);
            if ($imageUrl && $this->isLikelyPreviewImage($alt, $width, $height)) {
                $images[] = [
                    'type' => 'content:image',
                    'url' => $imageUrl,
                    'alt' => $alt,
                    'width' => $width,
                    'height' => $height,
                    'priority' => 6
                ];
            }
        }

        return array_slice($images, 0, 3);
    }

    protected function isLikelyPreviewImage(string $alt, string $width, string $height): bool
    {
        // Skip small images, logos, icons
        if ($width && $height) {
            $w = intval($width);
            $h = intval($height);
            if ($w < 200 || $h < 200) {
                return false;
            }
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
            return $parsedBase['scheme'] . ':' . $url;
        }

        // Relative URL
        $parsedBase = parse_url($baseUrl);
        $baseScheme = $parsedBase['scheme'] ?? 'https';
        $baseHost = $parsedBase['host'] ?? '';
        $basePath = $parsedBase['path'] ?? '';

        if (str_starts_with($url, '/')) {
            // Absolute path
            return $baseScheme . '://' . $baseHost . $url;
        } else {
            // Relative path
            $basePath = dirname($basePath);
            if ($basePath === '.') $basePath = '';
            return $baseScheme . '://' . $baseHost . $basePath . '/' . $url;
        }
    }

    protected function selectPrimaryImage($images): ?array
    {
        if (empty($images)) {
            return null;
        }

        usort($images, function($a, $b) {
            return $a['priority'] - $b['priority'];
        });

        return $images[0];
    }
}
