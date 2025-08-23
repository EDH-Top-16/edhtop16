import DataLoader from 'dataloader';
import {db} from './db';

interface Commander {
  id: string;
  name: string;
}

interface Entry {
  id: string;
  commanderId: string;
}

export interface SimpleDataLoaders {
  commanderById: DataLoader<string, Commander | null>;
  entriesByCommanderId: DataLoader<string, Entry[]>;
}

export function createSimpleDataLoaders(): SimpleDataLoaders {
  return {
    commanderById: new DataLoader<string, Commander | null>(async (ids) => {
      const numericIds = ids.map((id) => Number(id));

      const commanders = await db
        .selectFrom('Commander')
        .selectAll()
        .where('id', 'in', numericIds)
        .execute();

      // Create a map for O(1) lookups
      const commandersMap = new Map<number, (typeof commanders)[0]>();
      commanders.forEach((commander) =>
        commandersMap.set(commander.id, commander),
      );

      // Return results in the same order as input IDs, with null for missing commanders
      return ids.map((id) => {
        const commander = commandersMap.get(Number(id));
        return commander
          ? {
              id: commander.id.toString(),
              name: commander.name,
            }
          : null;
      });
    }),

    entriesByCommanderId: new DataLoader<string, Entry[]>(
      async (commanderIds) => {
        const numericCommanderIds = commanderIds.map((id) => Number(id));

        const allEntries = await db
          .selectFrom('Entry')
          .selectAll()
          .where('commanderId', 'in', numericCommanderIds)
          .execute();

        const entriesMap = new Map<string, Entry[]>();

        commanderIds.forEach((id) => entriesMap.set(id, []));

        allEntries.forEach((entry) => {
          const commanderIdStr = entry.commanderId.toString();
          const existing = entriesMap.get(commanderIdStr) || [];
          existing.push({
            id: entry.id.toString(),
            commanderId: entry.commanderId.toString(),
          });
          entriesMap.set(commanderIdStr, existing);
        });

        return commanderIds.map((id) => entriesMap.get(id) || []);
      },
    ),
    // OTHER STUFF?
  };
}
