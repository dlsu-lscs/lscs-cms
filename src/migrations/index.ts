import * as migration_20250923_032716 from './20250923_032716';
import * as migration_20251015_134112 from './20251015_134112';
import * as migration_20251029_075900 from './20251029_075900';
import * as migration_20251029_081041 from './20251029_081041';

export const migrations = [
  {
    up: migration_20250923_032716.up,
    down: migration_20250923_032716.down,
    name: '20250923_032716',
  },
  {
    up: migration_20251015_134112.up,
    down: migration_20251015_134112.down,
    name: '20251015_134112',
  },
  {
    up: migration_20251029_075900.up,
    down: migration_20251029_075900.down,
    name: '20251029_075900',
  },
  {
    up: migration_20251029_081041.up,
    down: migration_20251029_081041.down,
    name: '20251029_081041'
  },
];
