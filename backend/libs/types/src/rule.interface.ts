export interface RuleInterface {
  operator?: string;
  type?: string;
  value?: string | number;
  logical?: 'AND' | 'OR';
  rules?: RuleInterface[];
}
