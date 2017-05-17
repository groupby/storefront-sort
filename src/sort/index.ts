import { view, Component, Events, Store } from '@storefront/core';

@view('gb-sort', require('./index.html'), require('./index.css'))
class Sort extends Component {

  state: Sort.State = {
    sorts: [],
    // TODO make this better by fixin the sort action
    onSelect: (index) => this.flux.sort(<any>index)
  };

  constructor() {
    super();
    this.expose('sort');
    this.flux.on(Events.SORTS_UPDATED, this.updateSorts);
  }

  updateSorts = (sorts: Store.Indexed.Selectable<Store.Sort>) =>
    this.set({
      sorts: sorts.allIds.map((id) => ({
        ...sorts.byId[id],
        // TODO got to have the label in here
        selected: sorts.selected === id
      }))
    })
}

namespace Sort {
  export interface State {
    sorts: any[];
    onSelect(index: number): void;
  }
}

export default Sort;
