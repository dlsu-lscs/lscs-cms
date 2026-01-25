import * as migration_20250923_032716 from './20250923_032716';
import * as migration_20250926_171002 from './20250926_171002';
import * as migration_20250927_113756 from './20250927_113756';
import * as migration_20250928_020209 from './20250928_020209';
import * as migration_20250928_075411 from './20250928_075411';
import * as migration_20251015_134112 from './20251015_134112';
import * as migration_20251029_075900 from './20251029_075900';
import * as migration_20251029_081041 from './20251029_081041';
import * as migration_20251221_112400 from './20251221_112400';
import * as migration_20260125_022207 from './20260125_022207';

export const migrations = [
  {
    up: migration_20250923_032716.up,
    down: migration_20250923_032716.down,
    name: '20250923_032716',
  },
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
    name: '20250928_020209',
  },
  {
    up: migration_20250928_075411.up,
    down: migration_20250928_075411.down,
    name: '20250928_075411',
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
    name: '20251029_081041',
  },
  {
    up: migration_20251221_112400.up,
    down: migration_20251221_112400.down,
    name: '20251221_112400',
  },
  {
    up: migration_20260125_022207.up,
    down: migration_20260125_022207.down,
    name: '20260125_022207'
  },
];
