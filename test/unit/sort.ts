import { Events } from '@storefront/core';
import Sort from '../../src/sort';
import suite from './_suite';

suite('Sort', ({ expect, spy }) => {
  let sort: Sort;

  beforeEach(() => sort = new Sort());

  describe('constructor()', () => {
    describe('state', () => {
      describe('onSelect()', () => {
        it('should set initial sorts');

        it('should call flux.sort()');
      });
    });
  });

  describe('init()', () => {
    it('should listen for SORTS_UPDATED', () => {
      const on = spy();
      sort.flux = <any>{ on };

      sort.init();

      expect(on.calledWith(Events.SORTS_UPDATED, sort.updateSorts)).to.be.true;
    });
  });

  describe('onBeforeMount()', () => {
    it('should update state', () => {
      const selected = ['a', 'b'];
      const sorts = { c: 'd' };
      const state = { data: { sorts } };
      const getState = spy(() => state);
      const selectSorts = sort.selectSorts = spy(() => selected);
      sort.flux = <any>{ store: { getState } };
      sort.state = <any>{ e: 'f' };
      sort.expose = () => null;

      sort.onBeforeMount();

      expect(sort.state).to.eql({ e: 'f', sorts: selected });
      expect(selectSorts.calledWith(sorts)).to.be.true;
    });

    it('should call expose()', () => {
      const expose = sort.expose = spy();
      sort.selectSorts = () => null;
      sort.flux = <any>{ store: { getState: () => ({ data: {} }) } };
      sort.state = <any>{ e: 'f' };

      sort.onBeforeMount();

      expect(expose.calledWith('sort')).to.be.true;
    });
  });

  describe('updateSorts()', () => {
    it('should set sorts', () => {
      const sorts: any = { a: 'b' };
      const selected = ['c', 'd'];
      const selectSorts = sort.selectSorts = spy(() => selected);
      const set = sort.set = spy();

      sort.updateSorts(sorts);

      expect(selectSorts.calledWith(sorts)).to.be.true;
      expect(set.calledWith({ sorts: selected })).to.be.true;
    });
  });

  describe('selectSorts()', () => {
    it('should remap sorts', () => {
      sort.props = <any>{ labels: ['a', 'b', 'c'] };

      const options = sort.selectSorts({
        items: [
          { field: 'variant.colour', descending: true },
          { field: 'price' },
          { field: 'size', descending: true },
        ],
        selected: 1
      });

      expect(options).to.eql([
        { label: 'a', selected: false },
        { label: 'b', selected: true },
        { label: 'c', selected: false },
      ]);
    });

    it('should default to value expression if no label', () => {
      sort.props = <any>{ labels: [null, null, null] };

      const options = sort.selectSorts({
        items: [
          { field: 'variant.colour', descending: true },
          { field: 'price' },
          { field: 'size', descending: true },
        ],
        selected: 1
      });

      expect(options).to.eql([
        { label: 'variant.colour Descending', selected: false },
        { label: 'price Ascending', selected: true },
        { label: 'size Descending', selected: false },
      ]);
    });
  });
});
