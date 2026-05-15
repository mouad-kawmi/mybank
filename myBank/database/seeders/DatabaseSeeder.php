<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin principal
        User::firstOrCreate(
            ['email' => 'admin@mybank.ma'],
            [
                'first_name' => 'Admin',
                'last_name'  => 'MyBank',
                'phone'      => '+212600000000',
                'password'   => Hash::make('Admin@1234'),
                'role'       => 'admin',
                'status'     => 'active',
            ]
        );

        // Compte client de test
        User::firstOrCreate(
            ['email' => 'client@mybank.ma'],
            [
                'first_name' => 'Client',
                'last_name'  => 'Test',
                'phone'      => '+212611111111',
                'password'   => Hash::make('Client@1234'),
                'role'       => 'client',
                'status'     => 'active',
            ]
        );
    }
}
