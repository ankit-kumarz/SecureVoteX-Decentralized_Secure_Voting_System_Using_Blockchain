import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiptCard = ({ receipt, electionTitle, onVerify }) => {
  const receiptData = {
    version: '1.0',
    receiptHash: receipt.receiptHash,
    electionId: receipt.electionId,
    timestamp: receipt.timestamp,
    txHash: receipt.txHash || null
  };

  const qrData = JSON.stringify(receiptData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receipt.receiptHash);
    alert('Receipt hash copied to clipboard!');
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-neon-blue">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-neon-aqua">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Vote Cast Successfully!</h3>
        <p className="text-gray-400">Your vote has been encrypted and recorded</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6 bg-white p-4 rounded-xl">
        <QRCodeSVG 
          value={qrData} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Receipt Details */}
      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <label className="text-gray-400 text-sm block mb-1">Election</label>
          <p className="text-white font-medium">{electionTitle || `Election #${receipt.electionId}`}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <label className="text-gray-400 text-sm block mb-1">Receipt Hash</label>
          <div className="flex items-center justify-between">
            <p className="text-white font-mono text-sm break-all mr-2">
              {receipt.receiptHash.slice(0, 20)}...{receipt.receiptHash.slice(-20)}
            </p>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-neon-blue/20 border border-neon-blue/50 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <label className="text-gray-400 text-sm block mb-1">Timestamp</label>
          <p className="text-white">{new Date(receipt.timestamp).toLocaleString()}</p>
        </div>

        {receipt.txHash && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="text-gray-400 text-sm block mb-1">Blockchain Transaction</label>
            <a
              href={`https://sepolia.etherscan.io/tx/${receipt.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-aqua hover:text-neon-blue transition-colors font-mono text-sm flex items-center"
            >
              {receipt.txHash.slice(0, 10)}...{receipt.txHash.slice(-10)}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        {onVerify && (
          <button
            onClick={() => onVerify(receipt.receiptHash)}
            className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-xl shadow-neon-purple hover:shadow-neon-blue hover:scale-105 transition-all duration-300"
          >
            Verify Receipt
          </button>
        )}
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
          <p className="text-yellow-400 text-sm">
            ⚠️ Save this receipt! You can use it to verify your vote was counted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
