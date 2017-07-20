import { Events, Selectors } from '@storefront/core';
import Sort from '../../src/sort';
import suite from './_suite';

suite('Sort', ({ expect, spy, stub, itShouldBeConfigurable, itShouldHaveAlias }) => {
  let sort: Sort;

  beforeEach(() => sort = new Sort());

  itShouldBeConfigurable(Sort);
  itShouldHaveAlias(Sort, 'sort');

  describe('constructor()', () => {
    describe('props', () => {
      it('should set initial value', () => {
        expect(sort.props).to.eql({ labels: [] });
      });
    });

    describe('state', () => {
      it('should set initial value', () => {
        expect(sort.state.sorts).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectSort()', () => {
          const selectSort = spy();
          sort.actions = <any>{ selectSort };

          sort.state.onSelect(9);

          expect(selectSort).to.be.calledWith(9);
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

    it('should listen for SORTS_UPDATED', () => {
      const on = spy();
      sort.updateSorts = () => null;
      sort.flux = <any>{ on };

      sort.init();

      expect(on).to.be.calledWith(Events.SORTS_UPDATED, sort.updateSorts);
    });
  });

  describe('updateSorts()', () => {
    it('should set sorts', () => {
      const state: any = { a: 'b' };
      const selected = ['c', 'd'];
      const set = sort.set = spy();
      sort.extractSorts = spy(() => selected);
      sort.flux = <any>{ store: { getState: () => state } };

      sort.updateSorts();

      expect(set).to.be.calledWith({ sorts: selected });
    });
  });

  describe('extractSorts()', () => {
    it('should remap sorts', () => {
      const state = { a: 'b' };
      const getLabel = sort.getLabel = spy(() => 'x');
      const sort1 = { field: 'variant.colour', descending: true };
      const sort2 = { field: 'price' };
      const sort3 = { field: 'size', descending: true };
      const selectSorts = stub(Selectors, 'sorts').returns({ items: [sort1, sort2, sort3], selected: 1 });
      sort.flux = <any>{ store: { getState: () => state } };

      const options = sort.extractSorts();

      expect(selectSorts).to.be.calledWithExactly(state);
      expect(getLabel).to.be.calledWith(sort1, 0);
      expect(getLabel).to.be.calledWith(sort2, 1);
      expect(getLabel).to.be.calledWith(sort3, 2);
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
});
