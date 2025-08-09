import React from 'react';

interface Props {
  value: number;
  max: number;
}

const ProgressBar: React.FC<Props> = ({ value, max }) => {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full bg-gray-200 h-4">
      <div className="bg-blue-500 h-4" style={{ width: `${width}%` }} />
    </div>
  );
};

export default ProgressBar;
