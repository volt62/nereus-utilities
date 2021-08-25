import BigNumber from 'bignumber.js';
import * as calculateReserveInstance from './calculate-reserve-debt';
import { formatReserve, FormatReserveRequest } from './index';
import {
  formatReserveRequestDAI,
  formatReserveRequestWMATIC,
} from './reserve.mocks';

describe('formatReserve', () => {
  describe('WMATIC', () => {
    const request: FormatReserveRequest = formatReserveRequestWMATIC;

    it('should return the correct response', () => {
      const result = formatReserve(request);
      expect(result).toEqual({
        availableLiquidity: '150629528.254290021063240208',
        baseLTVasCollateral: '0.5',
        depositIncentivesAPY: '0.03459120784662872218',
        stableDebtIncentivesAPY: '0',
        variableDebtIncentivesAPY: '0.02302231808500517936',
        liquidityIndex: '1.00920114827430421106',
        liquidityRate: '0.00574176577170011131',
        price: { priceInEth: '0.00049803565744206' },
        reserveFactor: '0.2',
        reserveLiquidationBonus: '0.1',
        reserveLiquidationThreshold: '0.65',
        stableBorrowRate: '0.09773341053008235974',
        totalDebt: '30186360.792775159242526245',
        totalLiquidity: '180815889.047065180305766453',
        totalPrincipalStableDebt: '0',
        totalScaledVariableDebt: '40102377.650818088556713088',
        totalStableDebt: '0',
        totalVariableDebt: '30186360.792775159242526245',
        utilizationRate: '0.16694528866828649738',
        variableBorrowIndex: '1.02739968325035004938',
        variableBorrowRate: '0.03341338737105765182',
      });
    });

    it('should increase over time', () => {
      const first = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      const second = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  describe('DAI', () => {
    const request: FormatReserveRequest = formatReserveRequestDAI;

    it('should return the correct response', () => {
      const result = formatReserve(request);
      expect(result).toEqual({
        availableLiquidity: '43133.641118657852003256',
        baseLTVasCollateral: '0.75',
        depositIncentivesAPY: '0',
        variableDebtIncentivesAPY: '0',
        stableDebtIncentivesAPY: '0',
        liquidityIndex: '1.00016444737961059057',
        liquidityRate: '0.02677620073531209306',
        price: { priceInEth: '0.00163405' },
        reserveFactor: '0.1',
        reserveLiquidationBonus: '0.05',
        reserveLiquidationThreshold: '0.8',
        stableBorrowRate: '0.10928437169401419784',
        totalDebt: '104546.724902523987620455',
        totalLiquidity: '147680.366021181839623711',
        totalPrincipalStableDebt: '1',
        totalScaledVariableDebt: '145496.831599325217573288',
        totalStableDebt: '0.500764298282678588',
        totalVariableDebt: '104546.224138225704941867',
        utilizationRate: '0.7079256892383976026',
        variableBorrowIndex: '1.00023285443371120965',
        variableBorrowRate: '0.03856874338802839568',
      });
    });

    it('should increase over time', () => {
      const first = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      const second = formatReserve({
        ...request,
        currentTimestamp: request.reserve.lastUpdateTimestamp + 1,
      });

      expect(new BigNumber(second.totalDebt).gte(first.totalDebt)).toBe(true);
    });
  });

  it('should return utilizationRate 0 when totalLiquidity == 0', () => {
    const request: FormatReserveRequest = formatReserveRequestWMATIC;
    request.reserve = {
      ...request.reserve,
      availableLiquidity: '0',
    };

    jest
      .spyOn(calculateReserveInstance, 'calculateReserveDebt')
      .mockImplementation(() => {
        return {
          totalDebt: new BigNumber('0'),
          totalVariableDebt: new BigNumber('0'),
          totalStableDebt: new BigNumber('0'),
        };
      });

    const result = formatReserve(request);
    expect(result.utilizationRate).toEqual('0');
  });
});