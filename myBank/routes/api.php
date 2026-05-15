<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('users', UserController::class);
Route::apiResource('bank-accounts', BankAccountController::class);
Route::apiResource('transactions', TransactionController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
