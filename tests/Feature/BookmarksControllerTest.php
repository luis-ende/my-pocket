<?php

namespace Tests\Feature;

use App\Models\Bookmark;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookmarksControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_bookmarks()
    {
        $user = User::factory()->create();
        $bookmarks = Bookmark::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('bookmarks.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('bookmarks')
                ->has('bookmarks')
            );
    }

    public function test_user_can_store_a_new_bookmark()
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'Bookmark title',
            'url' => 'https://example.com',
            'tags' => 'test|demo',
            'read' => true,
        ];

        $response = $this->actingAs($user)->post(route('bookmarks.store'), $data);

        $response->assertRedirect(); // typically redirects to index or previous page
        $this->assertDatabaseHas('bookmarks', [
            'url' => 'https://example.com',
            'tags' => 'test|demo',
            'checked' => true,
        ]);
    }

    public function test_user_can_update_a_bookmark()
    {
        $user = User::factory()->create();
        $bookmark = Bookmark::factory()->create();

        $data = [
            'tags' => 'updated|test',
            'read' => false,
        ];

        $response = $this->actingAs($user)->patch(route('bookmarks.update', $bookmark), $data);

        $response->assertOk();
        $this->assertDatabaseHas('bookmarks', [
            'id' => $bookmark->id,
            'tags' => 'updated|test',
            'checked' => false,
        ]);
    }

    public function test_user_can_delete_a_bookmark()
    {
        $user = User::factory()->create();
        $bookmark = Bookmark::factory()->create();

        $response = $this->actingAs($user)->delete(route('bookmarks.destroy', $bookmark));

        $response->assertRedirect();
        $this->assertDatabaseMissing('bookmarks', ['id' => $bookmark->id]);
    }

    /*public function test_user_cannot_access_others_bookmarks()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $bookmark = Bookmark::factory()->create();

        $this->actingAs($user1)
            ->get(route('bookmarks.index'))
            ->assertInertia(fn ($page) =>
            $page->component('bookmarks')
                ->where('bookmarks', fn ($bookmarks) =>
                collect($bookmarks)->doesntContain(fn ($b) => $b['id'] === $bookmark->id)
                )
            );

        $this->actingAs($user1)
            ->put(route('bookmarks.update', $bookmark), ['url' => 'https://unauthorized.com'])
            ->assertForbidden();

        $this->actingAs($user1)
            ->delete(route('bookmarks.destroy', $bookmark))
            ->assertForbidden();
    }*/
}
