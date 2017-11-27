import { Events, Selectors } from '@storefront/core';
import PastPurchasesSort from '../../src/past-purchases-sort';
import suite from './_suite';

suite('Sort', ({ expect, spy, stub }) => {
  let sort: PastPurchasesSort;

  beforeEach(() => sort = new PastPurchasesSort());

  describe('constructor()', () => {
    describe('state', () => {
      it('should set initial value', () => {
        expect(sort.state.sorts).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectSort()', () => {
          const selectPastPurchasesSort = spy();
          sort.actions = <any>{ selectPastPurchasesSort };

          sort.state.onSelect(9);

          expect(selectPastPurchasesSort).to.be.calledWith(9);
        });
      });
    });
  });

  describe('init()', () => {
    it('should call updateSorts()', () => {
      const updateSorts = sort.updateSorts = spy();
      sort.flux = <any>{ on: () => null };

      sort.init();

      expect(updateSorts).to.be.called;
    });

    it('should listen for PAST_PURCHASE_SORT_UPDATED', () => {
      const on = spy();
      sort.updateSorts = () => null;
      sort.flux = <any>{ on };

      sort.init();

      expect(on).to.be.calledWith(Events.PAST_PURCHASE_SORT_UPDATED, sort.updateSorts);
    });
  });

  describe('extractSorts()', () => {
    it('should remap sorts', () => {
      const state = { a: 'b' };
      const field1 = 'variant.colour';
      const sort1 = { field: field1, descending: true };
      const field2 = 'price';
      const sort2 = { field: field2 };
      const field3 = 'size';
      const sort3 = { field: field3, descending: true };
      const select = sort.select = spy(() => ({ items: [sort1, sort2, sort3], selected: 1 }));

      const options = sort.extractSorts();

      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseSort);
      expect(options).to.eql([
        { label: field1, selected: false },
        { label: field2, selected: true },
        { label: field3, selected: false },
      ]);
    });
  });
});