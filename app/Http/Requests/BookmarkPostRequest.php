<?php

namespace App\Http\Requests;

use App\Rules\BookmarkRules;
use Illuminate\Foundation\Http\FormRequest;

class BookmarkPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:400',
            'url' => 'required|url|max:900|unique:bookmarks,url',
            ...BookmarkRules::base(),
        ];
    }

    public function messages(): array
    {
        return [
            'url.unique' => 'This URL was saved already.',
        ];
    }
}
