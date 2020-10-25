import { compareAuctionWithRules } from './operatorsFunctions';
import { RuleInterface } from '@core/interfaces';

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

  describe('have rules', () => {
    const fakeAuction = {
      buyout: 5,
      bonus: [6644, 5522, 2222],
      modifiers: [
        {
          type: 1,
          value: 25,
        },
        {
          type: 2,
          value: 14,
        },
      ],
    };

    it('should return true for a have rule with an objet', () => {
      const fakeRule: RuleInterface = {
        type: 'modifiers',
        operator: 'have',
        value: { type: 1, value: 25 },
      };

      const isValidHaveRules = compareAuctionWithRules(fakeAuction, fakeRule);
      expect(isValidHaveRules).toBe(true);
    });

    it('should return true for a have rule with an array', () => {
      const fakeRule: RuleInterface = {
        type: 'bonus',
        operator: 'have',
        value: 2222,
      };

      const isValidHaveRules = compareAuctionWithRules(fakeAuction, fakeRule);
      expect(isValidHaveRules).toBe(true);
    });
  });

  describe('complexe rules', () => {
    const fakeAuction = {
      buyout: 5,
      bonus: [6644, 5522, 2222],
      modifiers: [
        {
          type: 1,
          value: 25,
        },
        {
          type: 2,
          value: 14,
        },
      ],
    };

    it('should return true for a complexe rule', () => {
      const fakeComplexeRule: RuleInterface = {
        logical: 'AND',
        rules: [
          {
            logical: 'OR',
            rules: [
              { type: 'bonus', operator: 'have', value: 1111 },
              { type: 'bonus', operator: 'have', value: 2222 },
            ],
          },
          {
            type: 'buyout',
            operator: 'lt',
            value: 10,
          },
        ],
      };

      const isValid = compareAuctionWithRules(fakeAuction, fakeComplexeRule);
      expect(isValid).toBe(true);
    });
  });
});
