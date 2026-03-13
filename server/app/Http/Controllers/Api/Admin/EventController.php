<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'details' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'bg_color' => 'nullable|string|max:50',
            'border_color' => 'nullable|string|max:50',
            'is_public_holiday' => 'boolean',
        ]);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully',
            'data' => $event
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'event_title' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'details' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:50',
            'bg_color' => 'nullable|string|max:50',
            'border_color' => 'nullable|string|max:50',
            'is_public_holiday' => 'boolean',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => $event
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
