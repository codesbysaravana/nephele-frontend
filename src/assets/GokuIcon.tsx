import React from 'react';

type GokuIconProps = {
  className?: string;
};

const GokuIcon: React.FC<GokuIconProps> = ({ className }) => {
  return (
    <img
      src="/goku.svg"
      alt="Goku"
      className={className}
      style={{
        width: '18px',
        height: '18px',
        flexShrink: 0,
      }}
    />
  );
};

export default GokuIcon;
