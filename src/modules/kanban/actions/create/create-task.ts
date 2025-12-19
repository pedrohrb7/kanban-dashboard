import type { TTaskResponse } from '../../types/TTask';
import { tasksResponseMock } from '../kanban-mock';

interface CreateTaskPayload {
  title: string;
  description: string;
  columnId: number;
  responsibleUserId: number;
  expectedComplitionAt: string;
}

export const createTaskAPI = async (
  payload: CreateTaskPayload,
): Promise<TTaskResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const { KanbanActions } = await import('../KanbanActions');
  const columns = await KanbanActions.findAll();
  const column = columns.find(col => col.id === payload.columnId);

  if (!column) {
    throw new Error('Column not found');
  }

  const { TaskStorage } = await import('../../utils/task-utils');
  const existingTasks = TaskStorage.getTasks() || [];
  const allTasks = [...tasksResponseMock, ...existingTasks];

  const maxId = Math.max(0, ...allTasks.map(task => task.id));
  const newId = maxId + 1;

  const newTask: TTaskResponse = {
    id: newId,
    title: payload.title,
    description: payload.description,
    status: column.type as TTaskResponse['status'],
    createdAt: new Date().toISOString(),
    expectedComplitionAt: payload.expectedComplitionAt,
    completedAt: column.type === 'done' ? new Date().toISOString() : undefined,
    columnId: payload.columnId,
    responsibleUserId: payload.responsibleUserId,
  };

  return newTask;
};
