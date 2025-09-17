import DataLoader from 'dataloader';

/** @gqlContext */
export class Context {
  private readonly DERIVED_CACHE = new Map<string, unknown>();

  derived<T>(key: string, make: () => T): T {
    if (!this.DERIVED_CACHE.has(key)) {
      this.DERIVED_CACHE.set(key, make);
    }

    return this.DERIVED_CACHE.get(key) as T;
  }

  loader<K, V>(
    key: string,
    batchLoadFn: DataLoader.BatchLoadFn<K, V>,
  ): DataLoader<K, V> {
    return this.derived(key, () => new DataLoader(batchLoadFn));
  }
}
