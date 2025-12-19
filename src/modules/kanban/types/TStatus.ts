export type TStatusType = 'todo' | 'in_progress' | 'overdue' | 'done';

export const STATUS_TYPE_ENUM: Record<TStatusType, string> = {
  todo: '#94C6FF',
  in_progress: '#FFBE4F',
  overdue: '#E86F6F',
  done: '#54DEB0',
};
