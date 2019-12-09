import formatMoney from '../lib/formatMoney';

describe('formatMoney Function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(99)).toEqual('$0.99');
  });

  it('leaves cents off for whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(50000000)).toEqual('$500,000');
  });

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(5001)).toEqual('$50.01');
    expect(formatMoney(110)).toEqual('$1.10');
    expect(formatMoney(50000099)).toEqual('$500,000.99');
    expect(formatMoney(24357809823475)).toEqual('$243,578,098,234.75');
  });
});
