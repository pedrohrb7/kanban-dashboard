import type { TTaskResponse } from '../types/TTask';
import type { SortDirection } from '../store/useKanbanFilters';

const TASKS_STORAGE_KEY = 'kanban_tasks';
const COLUMNS_ORDER_STORAGE_KEY = 'kanban_columns_order';

export const TaskStorage = {
  getTasks(): TTaskResponse[] | null {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveTasks(tasks: TTaskResponse[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  },

  clearTasks(): void {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  },

  getColumnsOrder(): number[] | null {
    const stored = localStorage.getItem(COLUMNS_ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveColumnsOrder(columnIds: number[]): void {
    localStorage.setItem(COLUMNS_ORDER_STORAGE_KEY, JSON.stringify(columnIds));
  },

  clearColumnsOrder(): void {
    localStorage.removeItem(COLUMNS_ORDER_STORAGE_KEY);
  },
};

export const TaskUtils = {
  isOverdue(task: TTaskResponse): boolean {
    if (task.status === 'done') return false;
    const now = new Date();
    const deadline = new Date(task.expectedComplitionAt);
    return deadline < now;
  },

  updateTaskStatus(
    task: TTaskResponse,
    columnId: number,
    columns: Array<{ id: number; type: string }>,
  ): TTaskResponse {
    const targetColumn = columns.find(col => col.id === columnId);
    if (!targetColumn) return task;

    const updatedTask = { ...task, columnId };

    if (targetColumn.type === 'done' && !task.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
      updatedTask.status = 'done';
    } else if (targetColumn.type !== 'done') {
      updatedTask.completedAt = undefined;
      updatedTask.status = targetColumn.type as TTaskResponse['status'];
    }

    return updatedTask;
  },

  checkAndUpdateOverdueTasks(
    tasks: TTaskResponse[],
    columns: Array<{ id: number; type: string }>,
  ): TTaskResponse[] {
    const overdueColumnId = columns.find(col => col.type === 'overdue')?.id;
    if (!overdueColumnId) return tasks;

    return tasks.map(task => {
      if (TaskUtils.isOverdue(task) && task.status !== 'overdue') {
        return {
          ...task,
          status: 'overdue',
          columnId: overdueColumnId,
        };
      }
      return task;
    });
  },

  filterTasks(
    tasks: TTaskResponse[],
    filters: {
      statusFilter: string;
      responsibleFilter: number | 'all';
      searchQuery: string;
    },
  ): TTaskResponse[] {
    return tasks.filter(task => {
      if (
        filters.statusFilter !== 'all' &&
        task.status !== filters.statusFilter
      ) {
        return false;
      }

      if (
        filters.responsibleFilter !== 'all' &&
        task.responsibleUserId !== filters.responsibleFilter
      ) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  },

  sortTasks(
    tasks: TTaskResponse[],
    sortDirection: SortDirection,
  ): TTaskResponse[] {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },
};
