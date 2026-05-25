import { Gem } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Gem className="text-amber-400 animate-pulse mx-auto mb-3" size={32} />
        <p className="text-gray-400 text-sm">CT Diamond Jewelry</p>
      </div>
    </div>
  );
}
