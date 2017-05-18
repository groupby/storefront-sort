import { view, Component, Events, Store } from '@storefront/core';

@view('gb-sort', require('./index.html'), require('./index.css'), [
  { name: 'labels', default: [] }
])
class Sort extends Component {

  props: Sort.Props;
  state: Sort.State = {
    sorts: [],
    // TODO make this better by fixin the sort action
    onSelect: (index) => this.flux.sort(index)
  };

  constructor() {
    super();
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

namespace Sort {
  export interface Props {
    labels: string[];
  }
  export interface State {
    sorts: Array<{ label: string, selected?: boolean }>;
    onSelect(index: number): void;
  }
}

export default Sort;
