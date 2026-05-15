<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'sender_account_id',
        'receiver_account_id',
        'transaction_type',
        'amount',
        'description',
        'transaction_reference',
        'status',
    ];

    public function senderAccount()
    {
        return $this->belongsTo(BankAccount::class, 'sender_account_id');
    }

    public function receiverAccount()
    {
        return $this->belongsTo(BankAccount::class, 'receiver_account_id');
    }
}
