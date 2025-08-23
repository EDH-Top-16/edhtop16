import DataLoader from 'dataloader';

// Define your data types (adjust to match your actual types)
interface Commander {
  id: string;
  name: string;
  // ... other fields
}

interface Entry {
  id: string;
  commanderId: string;
  // ... other fields
}

export interface SimpleDataLoaders {
  commanderById: DataLoader<string, Commander | null>;
  entriesByCommanderId: DataLoader<string, Entry[]>;
}

export function createSimpleDataLoaders(): SimpleDataLoaders {
  return {
    commanderById: new DataLoader<string, Commander | null>(async (ids) => {
      console.log(`DataLoader: Batching ${ids.length} commander queries`);
      
      // TODO: Replace this with your actual database call
      // const commanders = await yourDatabase.commanders.findMany({
      //   where: { id: { in: [...ids] } }
      // });
      const commanders: Commander[] = []; // Your DB call here
      
      return ids.map(id => commanders.find(c => c.id === id) || null);
    }),
    
    entriesByCommanderId: new DataLoader<string, Entry[]>(async (commanderIds) => {
      console.log(`DataLoader: Batching ${commanderIds.length} entries queries`);
      
      // TODO: Replace this with your actual database call
      // const entries = await yourDatabase.entries.findMany({
      //   where: { commanderId: { in: [...commanderIds] } }
      // });
      const allEntries: Entry[] = []; // Your DB call here
      
      // Group entries by commander ID
      const entriesMap = new Map<string, Entry[]>();
      commanderIds.forEach(id => entriesMap.set(id, []));
      allEntries.forEach(entry => {
        const existing = entriesMap.get(entry.commanderId) || [];
        existing.push(entry);
        entriesMap.set(entry.commanderId, existing);
      });
      
      return commanderIds.map(id => entriesMap.get(id) || []);
    }),
  };
}
