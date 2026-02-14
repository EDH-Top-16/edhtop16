import type {Request} from 'express';
import DataLoader from 'dataloader';
import {auth} from './auth.js';
import {getDiscordGuildRoles} from './discord.js';
import {fromNodeHeaders} from 'better-auth/node';
import type {User} from 'better-auth';

/**
 * Base class for GraphQL contexts.
 * @gqlContext
 */
export class Context {
  /** The Express request object */
  public readonly req: Request;

  /** The authenticated user, or null if not logged in */
  public readonly user: User | null;

  private readonly DERIVED_CACHE = new Map<string, unknown>();

  constructor(req: Request, user: User | null) {
    this.req = req;
    this.user = user;
  }

  /**
   * Factory method for creating context instances from Express requests.
   * Override this method in your subclass to add async initialization logic.
   *
   * @param req - The Express request object
   * @returns A promise that resolves to the context instance
   */
  static async createFromRequest(req: Request): Promise<Context> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return new this(req, session?.user ?? null);
  }

  /**
   * Returns the authenticated user's role IDs in the EDHTop16 Discord server.
   * The result is cached for the lifetime of this request.
   */
  getDiscordRoles = (): Promise<string[]> => {
    return this.derived('discordRoles', () =>
      this.user ? getDiscordGuildRoles(this.user.id) : Promise.resolve([]),
    );
  };

  /**
   * Memoizes a derived value for the lifetime of this context.
   * Useful for caching computed values that are expensive to create.
   *
   * @param key - Unique identifier for the cached value
   * @param make - Factory function to create the value if not cached
   * @returns The cached or newly created value
   *
   * @example
   * ```typescript
   * // In a GraphQL resolver
   * const expensiveData = context.derived('myData', () => {
   *   return computeExpensiveValue();
   * });
   * ```
   */
  derived = <T>(key: string, make: () => T): T => {
    if (!this.DERIVED_CACHE.has(key)) {
      this.DERIVED_CACHE.set(key, make());
    }

    return this.DERIVED_CACHE.get(key) as T;
  };

  /**
   * Creates a DataLoader for batch loading entities.
   * The DataLoader is cached for the lifetime of this context.
   *
   * @param key - Unique identifier for the DataLoader
   * @param batchLoadFn - Function to batch load entities
   * @returns A DataLoader instance
   *
   * @example
   * ```typescript
   * // In a GraphQL resolver
   * const userLoader = context.loader('users', async (ids) => {
   *   const users = await db.users.findMany({ where: { id: { in: ids } } });
   *   return ids.map(id => users.find(u => u.id === id));
   * });
   * const user = await userLoader.load(userId);
   * ```
   */
  loader = <K, V>(
    key: string,
    batchLoadFn: DataLoader.BatchLoadFn<K, V>,
  ): DataLoader<K, V> => {
    return this.derived(key, () => new DataLoader(batchLoadFn));
  };
}
