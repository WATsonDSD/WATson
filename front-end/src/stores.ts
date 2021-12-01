import { Store } from 'react-stores';

interface IStoreState {
  user: any;
}

export default new Store<IStoreState>({
  user: null,
});
