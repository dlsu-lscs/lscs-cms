import * as migration_20250926_171002 from './20250926_171002';

export const migrations = [
  {
    up: migration_20250926_171002.up,
    down: migration_20250926_171002.down,
    name: '20250926_171002'
  },
];
