import { tag, Events, Store, Tag } from '@storefront/core';

@tag('gb-sort', require('./index.html'), [
  { name: 'labels', default: [] }
])
class Sort {

  state: Sort.State = {
    sorts: [],
    // TODO make this better by fixin the sort action
    onSelect: (index) => this.flux.sort(index)
  };

  init() {
    this.flux.on(Events.SORTS_UPDATED, this.updateSorts);
  }

  onBeforeMount() {
    this.state = {
      ...this.state,
      sorts: this.selectSorts(this.flux.store.getState().data.sorts)
    };
    this.expose('sort');
  }

  updateSorts = (sorts: Store.SelectableList<Store.Sort>) =>
    this.set({ sorts: this.selectSorts(sorts) })

  selectSorts(sorts: Store.SelectableList<Store.Sort>) {
    return sorts.items.map((sort, index) => ({
      label: this.props.labels[index] || `${sort.field} ${sort.descending ? 'Descending' : 'Ascending'}`,
      selected: sorts.selected === index
    }));
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
