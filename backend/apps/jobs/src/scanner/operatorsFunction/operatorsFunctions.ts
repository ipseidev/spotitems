import * as _ from 'lodash';
import { RuleInterface } from '@core/types';

export const operatorFunctions = {
  eq: (auction, type, value) => _.get(auction, type) === value,
  gt: (auction, type, value) => _.get(auction, type) > value,
  lt: (auction, type, value) => _.get(auction, type) < value,
  gte: (auction, type, value) => _.get(auction, type) >= value,
  lte: (auction, type, value) => _.get(auction, type) <= value,
  nt: (auction, type, value) => _.get(auction, type) !== value,
};

/**
 * Cette méthode permet de tester récursivement un ensemble de règle.
 * Si une des règles de haut niveau est passante, elle retourne vrai
 * Pour chaque sous règle présente dans une règle, on test l'operateur logique associé
 * AND ou OR, ce qui permet d'avoir une affinage de la règle
 *
 * exemple de règle:
 * {
 *   logical: "AND",
 *   rules: [
 *     {
 *       type: "buyout",
 *       operator: "gt",
 *       value: 1000000,
 *     },
 *     {
 *       type: "buyout",
 *       operator: "gt",
 *       value: 9000000,
 *     }
 *   ]
 * }
 *
 * Dans ce cas, l'auction sera gardé si la valeur de l'objet est > a 1000000 ET < 9000000.
 *
 * @param auction
 * @param rule
 */
export function compareAuctionWithRules(auction, rule: RuleInterface) {
  if (rule.logical && rule.rules) {
    if (rule.logical === 'AND') {
      return rule.rules.every(r => compareAuctionWithRules(auction, r));
    } else if (rule.logical === 'OR') {
      return rule.rules.some(r => compareAuctionWithRules(auction, r));
    }
  }

  return operatorFunctions[rule.operator](auction, rule.type, rule.value);
}
