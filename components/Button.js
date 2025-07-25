import { Button as ShadcnButton } from './ui/button';
import { cn } from '../lib/utils';

export function Button({ children, className, loading, ...props }) {
  return (
    <ShadcnButton
      className={cn(
        'w-full',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </ShadcnButton>
  );
}
