import MenuCard from "@/components/MenuCard";
import {
  ShishaSelection,
  ShishaFlavor,
  getShishaTypesWithData,
  getSelectionInfo,
} from "@/lib/data";

interface ShishaTypesProps {
  onTypeSelect: (type: string) => void;
  shishaSelections: ShishaSelection[];
  shishaFlavors: ShishaFlavor[];
}

const SHISHA_TYPES = [
  { key: "blond", label: "Blond Leaf" },
  { key: "dark", label: "Dark Leaf" },
  { key: "cigar", label: "Cigar Leaf" },
];

export default function ShishaTypes({
  onTypeSelect,
  shishaSelections,
  shishaFlavors,
}: ShishaTypesProps) {
  const typesWithBrands = getShishaTypesWithData(
    shishaSelections,
    shishaFlavors
  );
  const availableTypes = typesWithBrands.map((t) => t.key);

  if (availableTypes.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-accent text-xl font-semibold mb-2">
          No Shisha Available
        </h3>
        <p className="text-leaf text-sm">
          No shisha types with flavors available yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 justify-start bg-transparent">
      {SHISHA_TYPES.filter((type) => availableTypes.includes(type.key)).map(
        (type) => {
          const selectionInfo = getSelectionInfo(type.key, shishaSelections);

          return (
            <MenuCard
              key={type.key}
              name={type.label}
              description=""
              isActive={true}
              onClick={() => onTypeSelect(type.key)}
              fontSize="text-[1.75rem]"
              selection={selectionInfo?.selection}
              selectionPrice={selectionInfo?.price || undefined}
            />
          );
        }
      )}
    </div>
  );
}
