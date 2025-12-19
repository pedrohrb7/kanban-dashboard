import type { TStatusType } from './TStatus';

export type TTaskResponse = {
  id: number;
  title: string;
  description: string;
  status: TStatusType;
  createdAt: string;
  expectedComplitionAt: string;
  completedAt?: string;
  columnId: number;
  responsibleUserId: number;
};
