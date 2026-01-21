<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class SystemController extends Controller
{
    #[OA\Get(
        path: "/api/redis-test",
        summary: "Test Redis connection",
        description: "Pings Redis and performs a SET/GET operation to verify connectivity",
        tags: ["System"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Redis connection successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "connected"),
                        new OA\Property(property: "ping", type: "string", example: "PONG"),
                        new OA\Property(property: "test_value", type: "string", example: "Hello from Laravel! 2026-01-21 10:00:00"),
                        new OA\Property(property: "message", type: "string", example: "✅ Redis connection successful!")
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: "Redis connection failed",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "error"),
                        new OA\Property(property: "message", type: "string", example: "❌ Redis connection failed"),
                        new OA\Property(property: "error", type: "string", example: "Connection refused")
                    ]
                )
            )
        ]
    )]
    public function redisTest()
    {
        try {
            // Test connection with PING
            $ping = Redis::ping();
            
            // Try setting and getting a test value
            Redis::set('test_key', 'Hello from Laravel! ' . now());
            $testValue = Redis::get('test_key');
            
            return response()->json([
                'status' => 'connected',
                'ping' => $ping,
                'test_value' => $testValue,
                'message' => '✅ Redis connection successful!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => '❌ Redis connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[OA\Get(
        path: "/api/db-test",
        summary: "Test Database connection",
        description: "Checks if the database is reachable by running a simple query",
        tags: ["System"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Database connection successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "connected"),
                        new OA\Property(property: "database", type: "string", example: "news_db"),
                        new OA\Property(property: "message", type: "string", example: "✅ Database connection successful!")
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: "Database connection failed",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "error"),
                        new OA\Property(property: "message", type: "string", example: "❌ Database connection failed"),
                        new OA\Property(property: "error", type: "string", example: "Connection refused")
                    ]
                )
            )
        ]
    )]
    public function dbTest()
    {
        try {
            // Try to get database name
            $dbName = DB::connection()->getDatabaseName();
            
            // Run a simple query
            DB::select('SELECT 1');
            
            return response()->json([
                'status' => 'connected',
                'database' => $dbName,
                'message' => '✅ Database connection successful!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => '❌ Database connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
