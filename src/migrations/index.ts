import * as migration_20250926_171002 from './20250926_171002';
import * as migration_20250927_113756 from './20250927_113756';
import * as migration_20250928_020209 from './20250928_020209';

export const migrations = [
  {
    up: migration_20250926_171002.up,
    down: migration_20250926_171002.down,
    name: '20250926_171002',
  },
  {
    up: migration_20250927_113756.up,
    down: migration_20250927_113756.down,
    name: '20250927_113756',
  },
  {
    up: migration_20250928_020209.up,
    down: migration_20250928_020209.down,
    name: '20250928_020209'
  },
];
