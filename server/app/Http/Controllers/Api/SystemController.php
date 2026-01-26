<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;

class SystemController extends Controller
{
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
