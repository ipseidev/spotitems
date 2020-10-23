import { compareAuctionWithRules } from './operatorsFunctions';
import { RuleInterface } from '@core/types';
import exp from 'constants';

describe('operatorFuntions', () => {
  describe('Simple rules', () => {
    const fakeAuction = {
      buyout: 10,
    };

    it('should return true for a valid rule', () => {
      const fakeRule: RuleInterface = {
        operator: 'gt',
        type: 'buyout',
        value: 5,
      };
      const isValidAuction = compareAuctionWithRules(fakeAuction, fakeRule);
      expect(isValidAuction).toBe(true);
    });

    it('should return false for an invalid rule', () => {
      const fakeRule: RuleInterface = {
        operator: 'eq',
        type: 'buyout',
        value: 5,
      };

      const isInvalidAuction = compareAuctionWithRules(fakeAuction, fakeRule);
      expect(isInvalidAuction).toBe(false);
    });
  });

  it('should throw an error for an invalid operator', () => {
    const fakeRule: RuleInterface = {
      operator: 'like',
      type: 'buyout',
      value: 5,
    };

    expect(() => {
      compareAuctionWithRules(fakeRule, {});
    }).toThrow('Invalid operator');
  });

  describe('multiple rules', () => {
    const fakeAuction = {
      name: 'sword',
      buyout: 10,
      bonus: 'magic',
    };

    describe('AND Rules', () => {
      it('should return true for all valid rules', () => {
        const fakeAndRules: RuleInterface = {
          logical: 'AND',
          rules: [
            {
              type: 'buyout',
              value: 10,
              operator: 'eq',
            },
            {
              type: 'name',
              value: 'sword',
              operator: 'eq',
            },
          ],
        };

        const isValidComplexeAuction = compareAuctionWithRules(
          fakeAuction,
          fakeAndRules,
        );
        expect(isValidComplexeAuction).toBe(true);
      });

      it('should return false if one rule is invalid', () => {
        const fakeAndRules: RuleInterface = {
          logical: 'AND',
          rules: [
            {
              type: 'buyout',
              value: 10,
              operator: 'eq',
            },
            {
              type: 'name',
              value: 'shield',
              operator: 'eq',
            },
          ],
        };

        const isValidComplexeAuction = compareAuctionWithRules(
          fakeAuction,
          fakeAndRules,
        );
        expect(isValidComplexeAuction).toBe(false);
      });
    });

    describe('OR Rules', () => {
      it('should return true if one rule is valid', () => {
        const fakeAndRules: RuleInterface = {
          logical: 'OR',
          rules: [
            {
              type: 'buyout',
              value: 100,
              operator: 'eq',
            },
            {
              type: 'name',
              value: 'sword',
              operator: 'eq',
            },
          ],
        };

        const isValidComplexeAuction = compareAuctionWithRules(
          fakeAuction,
          fakeAndRules,
        );
        expect(isValidComplexeAuction).toBe(true);
      });

      it('should return false if all rules are invalid', () => {
        const fakeAndRules: RuleInterface = {
          logical: 'AND',
          rules: [
            {
              type: 'buyout',
              value: 100,
              operator: 'eq',
            },
            {
              type: 'name',
              value: 'shield',
              operator: 'eq',
            },
          ],
        };

        const isValidComplexeAuction = compareAuctionWithRules(
          fakeAuction,
          fakeAndRules,
        );
        expect(isValidComplexeAuction).toBe(false);
      });
    });
  });
});
