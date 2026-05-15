<?php

$baseUrl = 'http://127.0.0.1:8000/api';

function call($method, $endpoint, $data = null)
{
    global $baseUrl;
    $url = $baseUrl . $endpoint;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($response, true)];
}

echo "--- Testing USERS ---\n";

// 1. POST
echo "1. POST (Create User): ";
$res = call('POST', '/users', [
    'first_name' => 'Agent',
    'last_name' => 'Antigravity',
    'email' => 'agent' . rand(1, 999) . '@bank.com',
    'password' => 'password123'
]);
echo $res['status'] . "\n";
print_r($res['body']);

if ($res['status'] == 201) {
    $userId = $res['body']['id'];

    // 2. GET
    echo "\n2. GET (Single User): ";
    $res = call('GET', "/users/$userId");
    echo $res['status'] . "\n";

    // 3. PUT
    echo "\n3. PUT (Update User): ";
    $res = call('PUT', "/users/$userId", ['first_name' => 'Updated Agent']);
    echo $res['status'] . "\n";
    echo "New name: " . ($res['body']['first_name'] ?? 'failed') . "\n";

    // 4. DELETE
    echo "\n4. DELETE (Delete User): ";
    $res = call('DELETE', "/users/$userId");
    echo $res['status'] . "\n";
}

echo "\n--- Testing TRANSACTIONS ---\n";

// 1. Create a second account if needed
echo "1. Creating second account: ";
$res = call('POST', '/bank-accounts', [
    'user_id' => 1,
    'account_number' => 'TEST-ACC-' . rand(1000, 9999),
    'balance' => 1000,
    'currency' => 'MAD'
]);
$acc2Id = $res['body']['id'];
echo "Created Acc ID: $acc2Id (Status: " . $res['status'] . ")\n";

// 2. Test DEPOSIT
echo "2. Testing DEPOT (Adding 500 to ID 1): ";
$res = call('POST', '/transactions', [
    'receiver_account_id' => 1,
    'transaction_type' => 'depot',
    'amount' => 500,
    'transaction_reference' => 'TEST-DEP-' . rand(1000, 9999)
]);
echo $res['status'] . "\n";

// 3. Test VIREMENT (Transfer 300 from ID 1 to New Account)
echo "3. Testing VIREMENT (300 from ID 1 to ID $acc2Id): ";
$res = call('POST', '/transactions', [
    'sender_account_id' => 1,
    'receiver_account_id' => $acc2Id,
    'transaction_type' => 'virement',
    'amount' => 300,
    'transaction_reference' => 'TEST-VIR-' . rand(1000, 9999)
]);
echo $res['status'] . "\n";

// 4. Test RETRAIT
echo "4. Testing RETRAIT (100 from ID $acc2Id): ";
$res = call('POST', '/transactions', [
    'sender_account_id' => $acc2Id,
    'transaction_type' => 'retrait',
    'amount' => 100,
    'transaction_reference' => 'TEST-WDR-' . rand(1000, 9999)
]);
echo $res['status'] . "\n";

// 5. Final Balance Check
echo "\n--- Testing BANK ACCOUNTS (CRUD) ---\n";

// 1. POST
echo "1. POST (Create Account): ";
$res = call('POST', '/bank-accounts', [
    'user_id' => 1,
    'account_number' => 'CRUD-ACC-' . rand(1000, 9999),
    'balance' => 0
]);
$testAccId = $res['body']['id'];
echo $res['status'] . "\n";

// 2. GET
echo "2. GET (Single Account): ";
$res = call('GET', "/bank-accounts/$testAccId");
echo $res['status'] . "\n";

// 3. PUT
echo "3. PUT (Update Account Status): ";
$res = call('PUT', "/bank-accounts/$testAccId", ['status' => 'suspended']);
echo $res['status'] . "\n";
echo "New status: " . ($res['body']['status'] ?? 'failed') . "\n";

// 4. DELETE
echo "4. DELETE (Delete Account): ";
$res = call('DELETE', "/bank-accounts/$testAccId");
echo $res['status'] . "\n";

echo "\n--- Testing Done ---\n";
