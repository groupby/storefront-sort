import { alias, configurable, tag, Events, Store, Tag } from '@storefront/core';

@configurable
@alias('sort')
@tag('gb-sort', require('./index.html'))
class Sort {

  props: Sort.Props = {
    labels: []
  };
  state: Sort.State = {
    sorts: [],
    // TODO make this better by fixin the sort action
    onSelect: (index) => this.actions.selectSort(index)
  };

  init() {
    this.updateSorts();
    this.flux.on(Events.SORTS_UPDATED, this.updateSorts);
  }

  updateSorts = () =>
    this.set({ sorts: this.selectSorts(this.flux.store.getState()) })

  selectSorts(state: Store.State) {
    const sorts = state.data.sorts;
    return sorts.items.map((sort, index) => ({
      label: this.getLabel(sort, index),
      selected: sorts.selected === index
    }));
  }

  getLabel(sort: Store.Sort, index: number) {
    if (index < this.props.labels.length) {
      return this.props.labels[index];
    } else {
      return `${sort.field} ${sort.descending ? 'Descending' : 'Ascending'}`;
    }
  }
}

interface Sort extends Tag<Sort.Props, Sort.State> { }
namespace Sort {
  export interface Props {
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
