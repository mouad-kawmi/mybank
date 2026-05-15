<?php

use App\Models\BankAccount;
use App\Models\Transaction;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$accounts = BankAccount::with('user')->get();
foreach ($accounts as $acc) {
    echo "ID: {$acc->id} | User: {$acc->user->first_name} {$acc->user->last_name} | Balance: {$acc->balance}\n";
}

$lastTx = Transaction::orderBy('id', 'desc')->first();
if ($lastTx) {
    echo "\nLast Transaction:\n";
    echo "Type: {$lastTx->transaction_type} | Amount: {$lastTx->amount} | Receiver ID: {$lastTx->receiver_account_id} | Reference: {$lastTx->transaction_reference}\n";
}
