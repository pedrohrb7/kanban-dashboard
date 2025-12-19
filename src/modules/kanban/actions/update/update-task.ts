import type { TTaskResponse } from '../../types/TTask';

export const updateTaskAPI = async (
  taskId: number,
  updates: Partial<TTaskResponse>,
): Promise<TTaskResponse> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    id: taskId,
    ...updates,
  } as TTaskResponse;
};
