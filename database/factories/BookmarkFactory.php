<?php

namespace Database\Factories;

use App\Models\Bookmark;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class BookmarkFactory extends Factory
{
    protected $model = Bookmark::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'url' => $this->faker->url(),
            'tags' => $this->faker->word(),
            'checked' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'is_fav' => $this->faker->boolean(),
            'is_broken_link' => $this->faker->boolean(),
            'is_archived' => $this->faker->boolean(),
        ];
    }
}
