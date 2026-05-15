<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu #{{ $transaction->transaction_reference }}</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1e293b;
            background: #fff;
            width: 210mm;
            height: 297mm;
            overflow: hidden;
        }

        /* ── LAYOUT ── */
        .page {
            width: 100%;
            height: 297mm;
            display: flex;
            flex-direction: column;
            background: #fff;
        }

        /* ── HEADER BAND ── */
        .header {
            background: #0f172a;
            padding: 22px 36px 18px;
            flex-shrink: 0;
        }

        .header-inner {
            display: table;
            width: 100%;
        }

        .brand-col {
            display: table-cell;
            vertical-align: middle;
            width: 50%;
        }

        .brand-logo {
            font-size: 20px;
            font-weight: bold;
            color: #f8fafc;
            letter-spacing: 1.5px;
        }

        .brand-logo span {
            color: #3b82f6;
        }

        .brand-sub {
            font-size: 9px;
            color: #64748b;
            margin-top: 2px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .doc-col {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 50%;
        }

        .doc-title {
            font-size: 16px;
            font-weight: bold;
            color: #f8fafc;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .doc-ref {
            font-size: 9px;
            color: #94a3b8;
            margin-top: 3px;
            font-family: 'Courier New', monospace;
        }

        /* ── ACCENT LINE ── */
        .accent-line {
            height: 3px;
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
            flex-shrink: 0;
        }

        /* ── BODY ── */
        .body {
            flex: 1;
            padding: 24px 36px 0;
            overflow: hidden;
        }

        /* ── STATUS + AMOUNT HERO ── */
        .hero {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px 24px;
            margin-bottom: 18px;
            display: table;
            width: 100%;
        }

        .hero-left {
            display: table-cell;
            vertical-align: middle;
            width: 60%;
        }

        .hero-amount-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #94a3b8;
            margin-bottom: 4px;
        }

        .hero-amount {
            font-size: 32px;
            font-weight: bold;
            color: #0f172a;
            line-height: 1;
        }

        .hero-currency {
            font-size: 14px;
            color: #64748b;
            margin-left: 4px;
        }

        .hero-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 40%;
        }

        .type-pill {
            display: inline-block;
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .type-depot    { background: #dcfce7; color: #15803d; }
        .type-retrait  { background: #fee2e2; color: #dc2626; }
        .type-virement { background: #dbeafe; color: #1d4ed8; }

        .status-pill {
            display: block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .status-completed { background: #dcfce7; color: #15803d; }
        .status-pending   { background: #fef9c3; color: #a16207; }
        .status-failed    { background: #fee2e2; color: #dc2626; }

        /* ── TWO COLUMN SECTION ── */
        .two-col {
            display: table;
            width: 100%;
            margin-bottom: 16px;
            border-collapse: separate;
            border-spacing: 10px 0;
        }

        .col-card {
            display: table-cell;
            vertical-align: top;
            width: 50%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 16px;
        }

        .col-card-label {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #94a3b8;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
        }

        .col-card-val {
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
            font-family: 'Courier New', monospace;
        }

        .col-card-sub {
            font-size: 9px;
            color: #64748b;
            margin-top: 3px;
            text-transform: capitalize;
        }

        .col-card-na {
            font-size: 10px;
            color: #cbd5e1;
            font-style: italic;
        }

        /* ── DETAILS TABLE ── */
        .section-label {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #94a3b8;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #f1f5f9;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .detail-table tr {
            border-bottom: 1px solid #f8fafc;
        }

        .detail-table td {
            padding: 7px 4px;
            vertical-align: middle;
        }

        .dt-label {
            color: #94a3b8;
            font-size: 10px;
            width: 40%;
        }

        .dt-val {
            color: #1e293b;
            font-size: 10px;
            font-weight: bold;
            text-align: right;
        }

        .dt-mono {
            font-family: 'Courier New', monospace;
        }

        /* ── DESCRIPTION ── */
        .desc-box {
            background: #f0f9ff;
            border-left: 3px solid #3b82f6;
            padding: 10px 14px;
            border-radius: 0 6px 6px 0;
            margin-bottom: 16px;
            font-size: 10px;
            color: #475569;
            font-style: italic;
        }

        /* ── SEPARATOR ── */
        .sep {
            border: none;
            border-top: 1px dashed #e2e8f0;
            margin: 14px 0;
        }

        /* ── FOOTER ── */
        .footer {
            background: #0f172a;
            padding: 14px 36px;
            flex-shrink: 0;
        }

        .footer-inner {
            display: table;
            width: 100%;
        }

        .footer-left {
            display: table-cell;
            vertical-align: middle;
            width: 60%;
        }

        .footer-left p {
            font-size: 8px;
            color: #475569;
            line-height: 1.6;
        }

        .footer-right {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            width: 40%;
        }

        .footer-right p {
            font-size: 8px;
            color: #475569;
        }

        .footer-brand {
            font-size: 11px;
            font-weight: bold;
            color: #94a3b8;
            margin-bottom: 4px;
        }

        .footer-brand span { color: #3b82f6; }

        /* ── QR-like decorative block ── */
        .deco-stamp {
            display: inline-block;
            border: 2px solid #1e3a5f;
            border-radius: 6px;
            padding: 6px 10px;
            text-align: center;
        }

        .deco-stamp-top {
            font-size: 7px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .deco-stamp-num {
            font-size: 10px;
            font-weight: bold;
            color: #3b82f6;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
<div class="page">

    {{-- ═══════════ HEADER ═══════════ --}}
    <div class="header">
        <div class="header-inner">
            <div class="brand-col">
                <div class="brand-logo">MY<span>BANK</span></div>
                <div class="brand-sub">Votre banque de confiance</div>
            </div>
            <div class="doc-col">
                <div class="doc-title">Reçu Officiel</div>
                <div class="doc-ref">{{ $transaction->transaction_reference }}</div>
            </div>
        </div>
    </div>

    {{-- ═══════════ ACCENT ═══════════ --}}
    <div class="accent-line"></div>

    {{-- ═══════════ BODY ═══════════ --}}
    <div class="body">

        {{-- Hero: Montant + Type + Statut --}}
        @php
            $typeClass = match($transaction->transaction_type) {
                'depot'    => 'type-depot',
                'retrait'  => 'type-retrait',
                default    => 'type-virement',
            };
            $typeLabel = match($transaction->transaction_type) {
                'depot'    => '↓ Dépôt',
                'retrait'  => '↑ Retrait',
                default    => '⇄ Virement',
            };
            $statusClass = match(strtolower($transaction->status ?? 'completed')) {
                'completed' => 'status-completed',
                'pending'   => 'status-pending',
                'failed'    => 'status-failed',
                default     => 'status-completed',
            };
            $statusLabel = match(strtolower($transaction->status ?? 'completed')) {
                'completed' => '✓ Confirmée',
                'pending'   => '⏳ En attente',
                'failed'    => '✗ Échouée',
                default     => '✓ Confirmée',
            };
            $currency = $transaction->senderAccount->currency
                        ?? $transaction->receiverAccount->currency
                        ?? 'MAD';
        @endphp

        <div class="hero">
            <div class="hero-left">
                <div class="hero-amount-label">Montant de la transaction</div>
                <div class="hero-amount">
                    {{ number_format($transaction->amount, 2, ',', ' ') }}
                    <span class="hero-currency">{{ $currency }}</span>
                </div>
            </div>
            <div class="hero-right">
                <span class="type-pill {{ $typeClass }}">{{ $typeLabel }}</span>
                <span class="status-pill {{ $statusClass }}">{{ $statusLabel }}</span>
            </div>
        </div>

        {{-- Comptes --}}
        <div class="two-col">
            <div class="col-card">
                <div class="col-card-label">📤 Compte Émetteur</div>
                @if($transaction->senderAccount)
                    <div class="col-card-val">{{ $transaction->senderAccount->account_number }}</div>
                    <div class="col-card-sub">{{ $transaction->senderAccount->account_type }}</div>
                @else
                    <div class="col-card-na">— Non applicable —</div>
                @endif
            </div>
            <div class="col-card">
                <div class="col-card-label">📥 Compte Bénéficiaire</div>
                @if($transaction->receiverAccount)
                    <div class="col-card-val">{{ $transaction->receiverAccount->account_number }}</div>
                    <div class="col-card-sub">{{ $transaction->receiverAccount->account_type }}</div>
                @else
                    <div class="col-card-na">— Non applicable —</div>
                @endif
            </div>
        </div>

        {{-- Détails --}}
        <div class="section-label">Détails de la transaction</div>
        <table class="detail-table">
            <tr>
                <td class="dt-label">Identifiant</td>
                <td class="dt-val dt-mono">#{{ str_pad($transaction->id, 6, '0', STR_PAD_LEFT) }}</td>
            </tr>
            <tr>
                <td class="dt-label">Référence</td>
                <td class="dt-val dt-mono">{{ $transaction->transaction_reference }}</td>
            </tr>
            <tr>
                <td class="dt-label">Type d'opération</td>
                <td class="dt-val">{{ $typeLabel }}</td>
            </tr>
            <tr>
                <td class="dt-label">Montant</td>
                <td class="dt-val">{{ number_format($transaction->amount, 2, ',', ' ') }} {{ $currency }}</td>
            </tr>
            <tr>
                <td class="dt-label">Statut</td>
                <td class="dt-val">{{ $statusLabel }}</td>
            </tr>
            <tr>
                <td class="dt-label">Date d'opération</td>
                <td class="dt-val">{{ $transaction->created_at->format('d/m/Y à H:i:s') }}</td>
            </tr>
        </table>

        {{-- Description --}}
        @if($transaction->description)
            <div class="section-label">Motif</div>
            <div class="desc-box">"{{ $transaction->description }}"</div>
        @endif

        <hr class="sep">

        {{-- Bas de body --}}
        <div style="display:table; width:100%;">
            <div style="display:table-cell; vertical-align:middle; width:70%;">
                <p style="font-size:8px; color:#94a3b8; line-height:1.8;">
                    Ce document constitue un reçu officiel émis par MyBank.<br>
                    Pour toute contestation, veuillez contacter votre conseiller dans les 30 jours.
                </p>
            </div>
            <div style="display:table-cell; vertical-align:middle; text-align:right; width:30%;">
                <div class="deco-stamp">
                    <div class="deco-stamp-top">Document N°</div>
                    <div class="deco-stamp-num">{{ str_pad($transaction->id, 8, '0', STR_PAD_LEFT) }}</div>
                </div>
            </div>
        </div>

    </div>

    {{-- ═══════════ FOOTER ═══════════ --}}
    <div class="footer">
        <div class="footer-inner">
            <div class="footer-left">
                <div class="footer-brand">MY<span>BANK</span></div>
                <p>
                    Banque sécurisée — Agréée par les autorités financières<br>
                    Généré automatiquement le {{ now()->format('d/m/Y à H:i') }}
                </p>
            </div>
            <div class="footer-right">
                <p style="color:#3b82f6; font-weight:bold; font-size:9px;">www.mybank.ma</p>
                <p style="margin-top:3px;">support@mybank.ma</p>
                <p style="margin-top:2px;">+212 5XX-XXXXXX</p>
            </div>
        </div>
    </div>

</div>
</body>
</html>
