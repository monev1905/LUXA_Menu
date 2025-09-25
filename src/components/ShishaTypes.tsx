import MenuCard from '@/components/MenuCard';

interface ShishaTypesProps {
  onTypeSelect: (type: string) => void;
}

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond Leaf' },
  { key: 'dark', label: 'Dark Leaf' },
  { key: 'cigar', label: 'Cigar Leaf' },
];

export default function ShishaTypes({ onTypeSelect }: ShishaTypesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 px-4 justify-start bg-transparent">
      {SHISHA_TYPES.map(type => (
        <MenuCard
          key={type.key}
          name={type.label}
          description=""
          isActive={true}
          onClick={() => onTypeSelect(type.key)}
          fontSize="text-xl"
        />
      ))}
    </div>
  );
}
