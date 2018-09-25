import { Events, Selectors, StoreSections } from '@storefront/core';
import Sort from '../../src/sort';
import suite from './_suite';

suite('Sort', ({ expect, spy, stub, itShouldBeConfigurable, itShouldProvideAlias }) => {
  let sort: Sort;

  beforeEach(() => (sort = new Sort()));

  itShouldBeConfigurable(Sort);
  itShouldProvideAlias(Sort, 'sort');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(sort.props).to.eql({ labels: [], pastPurchasesLabels: [] });
      });
    });

    describe('state', () => {
      it('should set initial value', () => {
        expect(sort.state.sorts).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectSort() when storeSection is search', () => {
          const selectSort = spy();
          sort.props.storeSection = StoreSections.SEARCH;
          sort.actions = <any>{ selectSort };

          sort.state.onSelect(9);

          expect(selectSort).to.be.calledWith(9);
        });

        it('should call actions.selectPastPurchasesSort() when storeSection is pastPurchases', () => {
          const selectPastPurchasesSort = spy();
          sort.props.storeSection = StoreSections.PAST_PURCHASES;
          sort.actions = <any>{ selectPastPurchasesSort };

          sort.state.onSelect(9);

          expect(selectPastPurchasesSort).to.be.calledWith(9);
        });
      });
    });
  });

  describe('init()', () => {
    it('should listen for SORTS_UPDATED when storeSection is search', () => {
      const subscribe = (sort.subscribe = spy());
      sort.props.storeSection = StoreSections.SEARCH;
      sort.updateSorts = () => null;

      sort.init();

      expect(subscribe).to.be.calledWith(Events.SORTS_UPDATED, sort.updateSorts);
    });

    it('should listen for PAST_PURCHASE_SORT_UPDATED when storeSection is pastPurchases', () => {
      const subscribe = (sort.subscribe = spy());
      sort.props.storeSection = StoreSections.PAST_PURCHASES;
      sort.updateSorts = () => null;

      sort.init();

      expect(subscribe).to.be.calledWith(Events.PAST_PURCHASE_SORT_UPDATED, sort.updateSorts);
    });

    it('should set up initial state', () => {
      const updateSorts = (sort.updateSorts = spy());

      sort.init();

      expect(updateSorts).to.be.called;
    });
  });

  describe('updateSorts()', () => {
    it('should set sorts', () => {
      const state: any = { a: 'b' };
      const selected = ['c', 'd'];
      const set = (sort.set = spy());
      sort.extractSorts = spy(() => selected);
      sort.flux = <any>{ store: { getState: () => state } };

      sort.updateSorts();

      expect(set).to.be.calledWith({ sorts: selected });
    });
  });

  describe('extractSorts()', () => {
    it('should remap sorts', () => {
      const state = { a: 'b' };
      const getLabel = (sort.getLabel = spy(() => 'x'));
      const sort1 = { field: 'variant.colour', descending: true };
      const sort2 = { field: 'price' };
      const sort3 = { field: 'size', descending: true };
      const select = (sort.select = spy(() => ({ items: [sort1, sort2, sort3], selected: 1 })));
      sort.props.storeSection = StoreSections.SEARCH;

      const options = sort.extractSorts();

      expect(select).to.be.calledWithExactly(Selectors.sorts);
      expect(getLabel).to.be.calledWith(sort1, 0);
      expect(getLabel).to.be.calledWith(sort2, 1);
      expect(getLabel).to.be.calledWith(sort3, 2);
      expect(options).to.eql([
        { label: 'x', selected: false },
        { label: 'x', selected: true },
        { label: 'x', selected: false },
      ]);
    });

    it('should remap sorts for pastPurchases', () => {
      const state = { a: 'b' };
      const getPastPurchasesLabel = (sort.getPastPurchasesLabel = spy(() => 'x'));
      const sort1 = { field: 'variant.colour' };
      const sort2 = { field: 'price' };
      const sort3 = { field: 'size' };
      const select = (sort.select = spy(() => ({ items: [sort1, sort2, sort3], selected: 1 })));
      sort.props.storeSection = StoreSections.PAST_PURCHASES;

      const options = sort.extractSorts();

      expect(select).to.be.calledWithExactly(Selectors.pastPurchaseSort);
      expect(getPastPurchasesLabel).to.be.calledWith(sort1);
      expect(getPastPurchasesLabel).to.be.calledWith(sort2);
      expect(getPastPurchasesLabel).to.be.calledWith(sort3);
      expect(options).to.eql([
        { label: 'x', selected: false },
        { label: 'x', selected: true },
        { label: 'x', selected: false },
      ]);
    });
  });

  describe('getLabel()', () => {
    it('should return configured label', () => {
      sort.props.labels = ['A', 'B', 'C'];

      expect(sort.getLabel(<any>{}, 2)).to.eq('C');
    });

    it('should generate label', () => {
      sort.props.labels = [];

      expect(sort.getLabel({ field: 'age', descending: true }, 2)).to.eq('age Descending');
      expect(sort.getLabel({ field: 'age' }, 2)).to.eq('age Ascending');
    });
  });

  describe('getPastPurchasesLabel()', () => {
    it('should return past purchases label', () => {
      sort.props.pastPurchasesLabels = ['A', 'B', 'C'];

      expect(sort.getPastPurchasesLabel(<any>{}, 2)).to.eq('C');
    });

    it('should generate label', () => {
      sort.props.pastPurchasesLabels = [];

      expect(sort.getPastPurchasesLabel({ field: 'age', descending: true }, 2)).to.eq('age Descending');
      expect(sort.getPastPurchasesLabel({ field: 'age' }, 2)).to.eq('age Ascending');
    });
  });
});
