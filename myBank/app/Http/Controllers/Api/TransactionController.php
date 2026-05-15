<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Transaction::with(['senderAccount', 'receiverAccount'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_account_id' => 'nullable|exists:bank_accounts,id',
            'receiver_account_id' => 'nullable|exists:bank_accounts,id',
            'transaction_type' => 'required|in:depot,retrait,virement',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'transaction_reference' => 'required|string|max:100|unique:transactions',
        ]);

        return DB::transaction(function () use ($validated) {
            $senderId = $validated['sender_account_id'] ?? null;
            $receiverId = $validated['receiver_account_id'] ?? null;

            $sender = $senderId ? BankAccount::find($senderId) : null;
            $receiver = $receiverId ? BankAccount::find($receiverId) : null;

            if ($validated['transaction_type'] === 'virement') {
                if (!$sender || !$receiver) {
                    return response()->json(['error' => 'Sender and Receiver required for transfer'], 400);
                }
                if ($sender->balance < $validated['amount']) {
                    return response()->json(['error' => 'Insufficient balance'], 400);
                }
                $sender->decrement('balance', $validated['amount']);
                $receiver->increment('balance', $validated['amount']);
            } elseif ($validated['transaction_type'] === 'depot') {
                if (!$receiver) {
                    return response()->json(['error' => 'Receiver required for deposit'], 400);
                }
                $receiver->increment('balance', $validated['amount']);
            } elseif ($validated['transaction_type'] === 'retrait') {
                if (!$sender) {
                    return response()->json(['error' => 'Sender required for withdrawal'], 400);
                }
                if ($sender->balance < $validated['amount']) {
                    return response()->json(['error' => 'Insufficient balance'], 400);
                }
                $sender->decrement('balance', $validated['amount']);
            }

            return Transaction::create($validated);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        return $transaction->load(['senderAccount', 'receiverAccount']);
    }

    /**
     * Update is usually not allowed for transactions.
     */
    public function update(Request $request, Transaction $transaction)
    {
        return response()->json(['error' => 'Transactions cannot be updated'], 403);
    }

    /**
     * Delete is usually not allowed for transactions.
     */
    public function destroy(Transaction $transaction)
    {
        return response()->json(['error' => 'Transactions cannot be deleted'], 403);
    }
}
