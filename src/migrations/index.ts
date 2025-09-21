import * as migration_20250919_051125 from './20250919_051125';
import * as migration_20250919_052037 from './20250919_052037';
import * as migration_20250921_105020 from './20250921_105020';

export const migrations = [
  {
    up: migration_20250919_051125.up,
    down: migration_20250919_051125.down,
    name: '20250919_051125',
  },
  {
    up: migration_20250919_052037.up,
    down: migration_20250919_052037.down,
    name: '20250919_052037',
  },
  {
    up: migration_20250921_105020.up,
    down: migration_20250921_105020.down,
    name: '20250921_105020'
  },
];
