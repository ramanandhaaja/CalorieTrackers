import * as migration_20250312_145529 from './20250312_145529';

export const migrations = [
  {
    up: migration_20250312_145529.up,
    down: migration_20250312_145529.down,
    name: '20250312_145529'
  },
];
