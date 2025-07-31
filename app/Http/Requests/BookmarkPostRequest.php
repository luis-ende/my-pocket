<?php

namespace App\Http\Requests;

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
            'tags' => 'max:300',
            'read' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'url.unique' => 'This URL was saved already.',
        ];
    }
}
