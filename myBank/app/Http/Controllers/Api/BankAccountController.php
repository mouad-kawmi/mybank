<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return BankAccount::with('user')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'account_number' => 'required|string|max:30|unique:bank_accounts',
            'account_type' => 'nullable|in:courant,epargne',
            'balance' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|in:active,suspended,closed',
        ]);

        return BankAccount::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(BankAccount $bankAccount)
    {
        return $bankAccount->load('user', 'sentTransactions', 'receivedTransactions');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BankAccount $bankAccount)
    {
        $validated = $request->validate([
            'account_type' => 'sometimes|in:courant,epargne',
            'balance' => 'sometimes|numeric',
            'currency' => 'sometimes|string|max:10',
            'status' => 'sometimes|in:active,suspended,closed',
        ]);

        $bankAccount->update($validated);

        return $bankAccount;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BankAccount $bankAccount)
    {
        $bankAccount->delete();

        return response()->noContent();
    }
}
