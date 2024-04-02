<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlShortenerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

Route::group([
    'middleware' => 'auth:api',
    'prefix' => 'url'
], function ($router) {
    Route::post('/shortener', [UrlShortenerController::class, 'generate'])->name('UrlGenerate');
    Route::get('/', [UrlShortenerController::class, 'index'])->name('UrlIndex');
});

Route::get('/testing', function () {
    return json_encode([
        'status' => 200,
        'msg' => 'OK'
    ]);
});

// Mantener al final para la comprobacion de URL's acortadas
Route::group([
    'middleware' => 'auth:api'
], function ($router) {
    Route::get('/{key_url}', [UrlShortenerController::class, 'view'])->name('UrlView');
});





