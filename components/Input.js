import { Input as ShadcnInput } from './ui/input';
import { cn } from '../lib/utils';

export function Input({ className, error, label, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none text-gray-700">
          {label}
        </label>
      )}
      <ShadcnInput
        className={cn(
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
