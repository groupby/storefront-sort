import { configurable, provide, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@provide('sort')
@tag('gb-sort', require('./index.html'))
class Sort {
  props: Sort.Props = {
    labels: [],
    pastPurchasesLabels: []
  };
  state: Sort.State = {
    sorts: [],
    onSelect: (index) => {
      switch (this.props.storeSection) {
        case StoreSections.PAST_PURCHASES:
          this.actions.selectPastPurchasesSort(index);
          break;
        case StoreSections.SEARCH:
          this.actions.selectSort(index);
      }
    },
  };

  init() {
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.subscribe(Events.PAST_PURCHASE_SORT_UPDATED, this.updateSorts);
        break;
      case StoreSections.SEARCH:
        this.subscribe(Events.SORTS_UPDATED, this.updateSorts);
        break;
    }

    this.updateSorts();
  }

  updateSorts = () => this.set({ sorts: this.extractSorts() });

  extractSorts() {
    let sorts;
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        sorts = this.select(Selectors.pastPurchaseSort);
        return sorts.items.map((sort, index) => ({
          label: this.getPastPurchasesLabel(sort, index),
          selected: sorts.selected === index,
        }));
      case StoreSections.SEARCH:
        sorts = this.select(Selectors.sorts);
        return sorts.items.map((sort, index) => ({
          label: this.getLabel(sort, index),
          selected: sorts.selected === index,
        }));
    }
  }

  getLabel(sort: Store.Sort, index: number) {
    if (index < this.props.labels.length) {
      return this.props.labels[index];
    } else {
      return `${sort.field} ${sort.descending ? 'Descending' : 'Ascending'}`;
    }
  }

  getPastPurchasesLabel(sort: Store.Sort, index: number) {
    if (index < this.props.pastPurchasesLabels.length) {
      return this.props.pastPurchasesLabels[index];
    } else {
      return `${sort.field} ${sort.descending ? 'Descending' : 'Ascending'}`;
    }
  }
}

interface Sort extends Tag<Sort.Props, Sort.State> {}
namespace Sort {
  export interface Props extends Tag.Props {
    labels: string[];
    pastPurchasesLabels: string[];
  }

  export interface State {
    sorts: Option[];
    onSelect(index: number): void;
  }

  export interface Option {
    label: string;
    selected?: boolean;
  }
}

export default Sort;
