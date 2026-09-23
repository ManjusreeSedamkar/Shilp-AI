// src/components/ArtisanIDCard.tsx
import React from 'react';
import VerificationBadge from './VerificationBadge';

interface Props {
  name: string;
  shilpId: string;
  qrDataUrl: string;
  verificationTier: 'normal' | 'identity_verified' | 'gi_craft_verified';
}

/** Simple digital ID card UI */
export const ArtisanIDCard: React.FC<Props> = ({ name, shilpId, qrDataUrl, verificationTier }) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg bg-white">
      <h2 className="text-lg font-bold mb-2">{name}</h2>
      <p className="text-sm mb-1">ID: {shilpId}</p>
      <VerificationBadge tier={verificationTier} />
      {qrDataUrl && (
        <div className="mt-3 flex justify-center">
          <img src={qrDataUrl} alt="QR Code" className="w-32 h-32" />
        </div>
      )}
    </div>
  );
};

export default ArtisanIDCard;
