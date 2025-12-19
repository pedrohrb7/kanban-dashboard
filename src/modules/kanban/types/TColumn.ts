import type { TStatusType } from './TStatus';

export type TColumnResponse = {
  id: number;
  title: string;
  type: TStatusType;
  limit: number;
};
