<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class EventController extends Controller
{
    #[OA\Get(
        path: "/api/admin/events",
        operationId: "getAdminEvents",
        summary: "List all events for the calendar",
        description: "Returns a list of all events, which can be used to highlight dates in the frontend calendar.",
        security: [['sanctum' => []]],
        tags: ["Admin: Events"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successful operation",
                content: new OA\JsonContent(type: "array", items: new OA\Items(type: "object"))
            ),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function index()
    {
        return response()->json(Event::orderBy('date', 'asc')->get());
    }

    #[OA\Post(
        path: "/api/admin/events",
        operationId: "storeAdminEvent",
        summary: "Create a new calendar event",
        description: "Adds a new event to the database.",
        security: [['sanctum' => []]],
        tags: ["Admin: Events"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["event_title", "date"],
                properties: [
                    new OA\Property(property: "event_title", type: "string", example: "Hackathon 2025"),
                    new OA\Property(property: "date", type: "string", format: "date", example: "2025-01-25"),
                    new OA\Property(property: "time", type: "string", format: "time", example: "09:00:00"),
                    new OA\Property(property: "location", type: "string", example: "Tech Hub, Manila"),
                    new OA\Property(property: "description", type: "string", example: "A 48-hour coding marathon.")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Event created successfully", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 422, description: "Validation Error")
        ]
    )]
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

    #[OA\Get(
        path: "/api/admin/events/{id}",
        operationId: "getAdminEventById",
        summary: "Get specific event details",
        security: [['sanctum' => []]],
        tags: ["Admin: Events"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Successful operation", content: new OA\JsonContent(type: "object")),
            new OA\Response(response: 404, description: "Event not found")
        ]
    )]
    public function show(Event $event)
    {
        return response()->json($event);
    }

    #[OA\Patch(
        path: "/api/admin/events/{id}",
        operationId: "updateAdminEvent",
        summary: "Update an existing event",
        security: [['sanctum' => []]],
        tags: ["Admin: Events"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "event_title", type: "string"),
                    new OA\Property(property: "date", type: "string", format: "date"),
                    new OA\Property(property: "time", type: "string"),
                    new OA\Property(property: "location", type: "string"),
                    new OA\Property(property: "description", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Event updated successfully"),
            new OA\Response(response: 422, description: "Validation Error")
        ]
    )]
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

    #[OA\Delete(
        path: "/api/admin/events/{id}",
        operationId: "deleteAdminEvent",
        summary: "Delete an event",
        security: [['sanctum' => []]],
        tags: ["Admin: Events"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 204, description: "Event deleted"),
            new OA\Response(response: 404, description: "Event not found")
        ]
    )]
    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
