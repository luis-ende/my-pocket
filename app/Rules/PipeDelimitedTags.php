<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PipeDelimitedTags implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) &&
            ! preg_match('/^([a-zA-Z0-9_-]+)(\|[a-zA-Z0-9_-]+)*$/', $value)) {
            $fail('The :attribute format is invalid. Use pipe-delimited values.');
        }
    }
}
