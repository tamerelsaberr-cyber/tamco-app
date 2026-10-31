'use client';
import { WALLET_CONFIG } from '../config/wallet';

export default function WalletView() {
  return (
    <div className="p-4 border rounded bg-gray-50">
      <p className="text-xs text-gray-500">محفظة الاستقبال (معزولة) - {WALLET_CONFIG.shortName}</p>
      <p className="font-mono text-sm break-all mt-1">{WALLET_CONFIG.address}</p>
    </div>
  );
}