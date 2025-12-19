import type { TColumnResponse } from '../types/TColumn';
import type { TTaskResponse } from '../types/TTask';
import { findAllColumnsAPI } from './get/find-all';
import { findAllTasksAPI } from './get/find-all.tasks';
import { updateTaskAPI } from './update/update-task';

export const KANBAN_ACTION_KEY = {
  FIND_ALL: 'KANBAN_ACTION_KEY.FIND_ALL',
};

export const TASK_ACTION_KEY = {
  FIND_ALL: 'TASK_ACTION_KEY.FIND_ALL',
};

export class KanbanActions {
  static async findAll(): Promise<TColumnResponse[]> {
    const response = await findAllColumnsAPI();
    return response;
  }

  static async findAllTasks(): Promise<TTaskResponse[]> {
    const response = await findAllTasksAPI();
    return response;
  }

  static async updateTask(
    taskId: number,
    updates: Partial<TTaskResponse>,
  ): Promise<TTaskResponse> {
    const response = await updateTaskAPI(taskId, updates);
    return response;
  }
}
