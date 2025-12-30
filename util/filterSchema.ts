import {
  AbilityDataType,
  MoveDataType,
  SpeciesDataType,
} from "@/type/publicData";

type DataTypeMap = {
  ability: AbilityDataType;
  move: MoveDataType;
  species: SpeciesDataType;
};

type SchemaMap = {
  ability: typeof abilityFilterSchema;
  move: typeof moveFilterSchema;
  species: typeof speciesFilterSchema;
};

export enum FilterType {
  Single = "single",
  Multi_Multi = "multi_multi", // multiple selection, all must match
  Multi_Any = "multi_any", // multiple selection, any must match
  If_Eliminate = "if_eliminate", // 是否排除，filter必须有默认值
  Pass = "pass",
}

export const abilityFilterSchema = {
  gen: FilterType.Single,
  flags: FilterType.Multi_Multi,
};

export const moveFilterSchema = {
  gen: FilterType.Single,
  category: FilterType.Single,
  type: FilterType.Single,
  target: FilterType.Single,
  priority: FilterType.Single,
};

export const speciesFilterSchema = {
  gen: FilterType.Single,
  types: FilterType.Multi_Multi,
  canHatch: FilterType.Single,
  tags: FilterType.Multi_Any,
  abilities: FilterType.Multi_Any,
  forme: FilterType.If_Eliminate,
  evos: FilterType.If_Eliminate,
  moves: FilterType.Pass,
  movesMode: FilterType.Pass,
};

const schemaMap = {
  ability: abilityFilterSchema,
  move: moveFilterSchema,
  species: speciesFilterSchema,
};

export function operateData<K extends keyof DataTypeMap>(
  dataCategory: K,
  data: DataTypeMap[K][],
  filter: Partial<Record<keyof SchemaMap[K], any>>
) {
  console.log(filter);
  const schema = schemaMap[dataCategory];

  const filteredData = data.filter((item) => {
    return (Object.keys(filter) as (keyof SchemaMap[K])[]).every((key) => {
      if (!(key in schema)) {
        console.error(
          `Filter key "${String(
            key
          )}" not found in schema for category "${dataCategory}".`
        );
        return true;
      }
      const filterType = schema[key];
      const value = item[key as keyof typeof item];
      switch (filterType) {
        case FilterType.Single:
          if (!filter[key]) {
            return true;
          }
          return String(value) === String(filter[key]);
        case FilterType.Multi_Multi:
          if (!filter[key]) {
            return true;
          }
          return filter[key].every((v: string) =>
            (value as string[]).includes(v)
          );
        case FilterType.Multi_Any:
          if (!filter[key] || filter[key].length === 0) {
            return true;
          }
          return filter[key].some((v: string) =>
            (value as string[]).includes(v)
          );
        case FilterType.If_Eliminate:
          if (filter[key] === "1") {
            if (Array.isArray(value)) {
              return value.length > 0;
            } else {
              return !value;
            }
          } else {
            return true;
          }
        default:
          return true;
      }
    });
  });

  return filteredData;
}
