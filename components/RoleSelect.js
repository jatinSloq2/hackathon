import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function RoleSelect({ value, onValueChange, error, label }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none text-gray-700">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vendor">Vendor</SelectItem>
          <SelectItem value="buyer">Buyer</SelectItem>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
