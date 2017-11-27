import { alias, tag, Events, Selectors } from '@storefront/core';
import Sort from '../sort';

@alias('sort')
@tag('gb-past-purchases-sort', require('./index.html'))
class PastPurchasesSort extends Sort {
  state: Sort.State = {
    sorts: [],
    onSelect: (index) => { this.actions.selectPastPurchasesSort(index); }
  };

  init() {
    this.updateSorts();
    this.flux.on(Events.PAST_PURCHASE_SORT_UPDATED, this.updateSorts);
  }

  extractSorts() {
    const sorts = this.select(Selectors.pastPurchaseSort);
    return sorts.items.map((sort, index) => ({
      label: sort.field,
      selected: sorts.selected === index
    }));
  }
}

export default PastPurchasesSort;