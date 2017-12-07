import { alias, configurable, tag, Events, Selectors, Store, StoreSections, Tag } from '@storefront/core';

@configurable
@alias('sort')
@tag('gb-sort', require('./index.html'))
class Sort {

  props: Sort.Props = {
    storeSection: StoreSections.DEFAULT,
    labels: [],
  };
  state: Sort.State = {
    sorts: [],
    // TODO make this better by fixin the sort action
    onSelect: (index) => {
      switch (this.props.storeSection) {
        case StoreSections.PAST_PURCHASES:
          this.actions.selectPastPurchasesSort(index);
          break;
        default:
          this.actions.selectSort(index);
      }
    }
  };

  init() {
    this.updateSorts();
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        this.flux.on(Events.PAST_PURCHASE_SORT_UPDATED, this.updateSorts);
        break;
      default:
        this.flux.on(Events.SORTS_UPDATED, this.updateSorts);
    }
  }

  updateSorts = () =>
    this.set({ sorts: this.extractSorts() })

  extractSorts() {
    let sorts;
    // todo refactor...
    switch (this.props.storeSection) {
      case StoreSections.PAST_PURCHASES:
        sorts = this.select(Selectors.pastPurchaseSort);
        return sorts.items.map((sort, index) => ({
          label: this.getPastPurchasesLabel(sort),
          selected: sorts.selected === index
        }));
      default:
        sorts = this.select(Selectors.sorts);
        return sorts.items.map((sort, index) => ({
          label: this.getLabel(sort, index),
          selected: sorts.selected === index
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

  getPastPurchasesLabel(sort: Store.Sort) {
    return sort.field;
  }
}

interface Sort extends Tag<Sort.Props, Sort.State> { }
namespace Sort {
  export interface Props extends Tag.Props {
    labels: string[];
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
