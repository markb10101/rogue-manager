import React from 'react';
import ProgressBar from './ProgressBar';
import { useStore } from '../game/store';
import { MAX_HP } from '../game/balance';

const TopBar: React.FC = () => {
  const hp = useStore((s) => s.hp);
  return (
    <div className="p-2 bg-gray-800 text-white">
      <ProgressBar value={hp} max={MAX_HP} />
    </div>
  );
};

export default TopBar;
