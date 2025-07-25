<?php

namespace App\Services;
class LinkUrlCleanService
{
    function cleanTrackingParameters(string $url): string
    {
        $trackingParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'gclid', 'fbclid', 'mc_cid', 'mc_eid', 'igshid', 'ref', 'yclid',
            'msclkid', 'utm_id', 'utm_name', 'trk', 'trkCampaign', 'bento_uuid'
        ];

        $parts = parse_url($url);
        parse_str($parts['query'] ?? '', $queryParams);
        foreach ($trackingParams as $param) {
            unset($queryParams[$param]);
        }
        $cleanQuery = http_build_query($queryParams);
        $cleanUrl = (isset($parts['scheme']) ? "{$parts['scheme']}://" : '') .
            ($parts['host'] ?? '') .
            (isset($parts['port']) ? ":{$parts['port']}" : '') .
            ($parts['path'] ?? '') .
            ($cleanQuery ? "?$cleanQuery" : '') .
            (isset($parts['fragment']) ? "#{$parts['fragment']}" : '');

        return $cleanUrl;
    }
}
