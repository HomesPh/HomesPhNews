<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailingListGroup;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MailingListGroupController extends Controller
{
    public function index(): JsonResponse
    {
        $groups = MailingListGroup::withCount('subscribers')->get();
        return response()->json(['data' => $groups]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'subscriber_ids' => 'required|array',
            'subscriber_ids.*' => 'uuid'
        ]);

        $group = MailingListGroup::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        $group->subscribers()->attach($request->subscriber_ids);

        return response()->json([
            'message' => 'Group created successfully',
            'data' => $group->loadCount('subscribers')
        ]);
    }

    public function show($id): JsonResponse
    {
        $group = MailingListGroup::findOrFail($id);
        $subscribers = $group->subscribers()->get();
        
        return response()->json([
            'data' => array_merge($group->toArray(), [
                'subscribers' => $subscribers,
                'debug_count' => $subscribers->count(),
                'debug_pivot_count' => \DB::table('mailing_list_group_subscriber')->where('group_id', $id)->count()
            ])
        ]);
    }

    public function destroy(MailingListGroup $group): JsonResponse
    {
        $group->delete();
        return response()->json(['message' => 'Group deleted successfully']);
    }
}
