'use client';

import Image from 'next/image';
import aiLogo from '../assets/ai.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
}

export default function Logo({ className = '', width = 120, height = 28, responsive = true }: LogoProps) {
  if (responsive) {
    return (
      <>
        <div className="hidden sm:block">
          <Image
            src={aiLogo}
            alt="SOFTCLUB-AI"
            width={120}
            height={40}
            className={className}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="sm:hidden">
          <Image
            src={aiLogo}
            alt="SOFTCLUB-AI"
            width={90}
            height={30}
            className={className}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
      </>
    );
  }

  return (
    <Image
      src={aiLogo}
      alt="SOFTCLUB-AI"
      width={width}
      height={height}
      className={className}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
}

