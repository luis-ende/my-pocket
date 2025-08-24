<?php

namespace Feature;

use App\Models\Collection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectionsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_collections()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('collections.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('collections')
                ->has('collections')
            );
    }

    public function test_user_can_list_their_collections()
    {
        $user = User::factory()->create();
        $collection = Collection::factory()->create();

        $response = $this->actingAs($user)->get(route('collections.list'));

        $response->assertOk()
            ->assertJson([
                'collections' => [
                    ['id' => $collection->id, 'name' => $collection->name],
                ],
            ]);
    }

    public function test_user_can_store_a_new_collection()
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'collection test',
            'description' => 'collection test',
        ];

        $response = $this->actingAs($user)->post(route('collections.store'), $data);
        $response->assertRedirect(); // typically redirects to index or previous page
        $this->assertDatabaseHas('collections', [
            'name' => 'collection test',
            'description' => 'collection test',
        ]);
    }

    public function test_user_can_update_a_collection()
    {
        $user = User::factory()->create();
        $collection = Collection::factory()->create();

        $data = [
            'name' => 'collection test 1',
            'description' => 'collection test 1',
        ];

        $response = $this->actingAs($user)->patch(route('collections.update', $collection), $data);
        $response->assertRedirect();
        $this->assertDatabaseHas('collections', [
            'id' => $collection->id,
            'name' => $data['name'],
            'description' => $data['description'],
        ]);
    }

    public function test_user_can_delete_a_collection()
    {
        $user = User::factory()->create();
        $collection = Collection::factory()->create();

        $response = $this->actingAs($user)->delete(route('collections.destroy', $collection));

        $response->assertRedirect();
        $this->assertDatabaseMissing('bookmarks', ['id' => $collection->id]);
    }
}
