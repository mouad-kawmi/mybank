<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_account_id')->nullable()->constrained('bank_accounts')->onDelete('set null');
            $table->foreignId('receiver_account_id')->nullable()->constrained('bank_accounts')->onDelete('set null');
            $table->enum('transaction_type', ['depot', 'retrait', 'virement']);
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->string('transaction_reference', 100)->unique();
            $table->enum('status', ['success', 'pending', 'failed'])->default('success');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
