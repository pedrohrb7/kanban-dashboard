import type { TTaskResponse } from '../../types/TTask';
import { tasksResponseMock } from '../kanban-mock';

export const findAllTasksAPI = async (): Promise<TTaskResponse[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tasksResponseMock);
    }, 3000);
  });
};
