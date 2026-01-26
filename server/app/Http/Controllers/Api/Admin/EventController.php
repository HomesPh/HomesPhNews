<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
        public function index()
    {
        return response()->json(Event::orderBy('date', 'asc')->get());
    }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'event_title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

        public function show(Event $event)
    {
        return response()->json($event);
    }

        public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'event_title' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

        public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
