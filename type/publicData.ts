export interface AbilityDataType {
  name: string;
  id: string;
  num: number;
  gen: number;
  shortDesc: string;
  desc: string;
  rating: number;
  flags: string[];
}

export interface MoveDataType {
  name: string;
  id: string;
  num: number;
  gen: number;
  shortDesc: string;
  desc: string;
  type: string;
  category: string;
  basePower: number;
  accuracy: number | boolean;
  pp: number;
  target: string;
  priority: number;
}

export interface SpeciesDataType {
  name: string;
  id: string;
  num: number;
  gen: number;
  forme: string;
  baseForme: string;
  otherFormes?: string[];
  formeOrder?: string[];
  spriteid: string;
  abilities: string[];
  types: string[];
  prevo: string | null;
  evos: string[];
  canHatch: boolean;
  baseStats: BaseStatsType;
  bst: number;
  tags: string[];
}

export type BaseStatsType = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export interface LearnsetDataType {
  [speciesId: string]: string[];
}
