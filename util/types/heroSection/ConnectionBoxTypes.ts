import type { PlayerDataAray } from '@/util/interfaces';

export type ConnectionItem = PlayerDataAray['player'][number];

export type ProfileType = 'coach' | 'player' | string;

export type ApiPayload = {
  error?: unknown;
  connection?: unknown;
};

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function getLabels(profileType?: ProfileType) {
  const isPlayer = profileType === 'player';
  return {
    heading: isPlayer ? 'Your Coach' : 'Your Players',
    singular: isPlayer ? 'Coach' : 'Players',
    plural: isPlayer ? 'Coaches' : 'Players',
  };
}
