<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BankAccountController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes publiques — Authentification
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login',    [AuthController::class, 'login'])->name('auth.login');
});

/*
|--------------------------------------------------------------------------
| Routes protégées — Nécessite un token Sanctum valide
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::get('/auth/me',     [AuthController::class, 'me'])->name('auth.me');

    // Users (admin)
    Route::apiResource('users', UserController::class);

    // Comptes bancaires
    Route::apiResource('bank-accounts', BankAccountController::class);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);

    // Téléchargement du reçu PDF
    Route::get('transactions/{transaction}/receipt', [TransactionController::class, 'downloadReceipt'])
        ->name('transactions.receipt');
});
