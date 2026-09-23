// src/components/VerificationBadge.tsx
import React from 'react';

interface Props {
  tier: 'normal' | 'identity_verified' | 'gi_craft_verified';
}

/** Simple badge displaying verification tier */
export const VerificationBadge: React.FC<Props> = ({ tier }) => {
  const colorMap: Record<Props['tier'], string> = {
    normal: 'gray',
    identity_verified: 'green',
    gi_craft_verified: 'purple',
  };
  const labelMap: Record<Props['tier'], string> = {
    normal: 'Normal Artisan',
    identity_verified: 'Identity Verified 🟢',
    gi_craft_verified: 'GI Craft Verified 🟣',
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded bg-${colorMap[tier]}-100 text-${colorMap[tier]}-800`}
    >
      {labelMap[tier]}
    </span>
  );
};

export default VerificationBadge;
