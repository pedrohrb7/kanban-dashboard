import type { TTaskResponse } from '../../kanban/types/TTask';

export const DashboardUtils = {
  getTaskCountByStatus(tasks: TTaskResponse[]) {
    return {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      done: tasks.filter(t => t.status === 'done').length,
      total: tasks.length,
    };
  },

  getCompletedTodayPercentage(tasks: TTaskResponse[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = tasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    return tasks.length > 0 ? (completedToday / tasks.length) * 100 : 0;
  },

  getCompletedThisWeekPercentage(tasks: TTaskResponse[]): number {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const completedThisWeek = tasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= startOfWeek;
    }).length;

    return tasks.length > 0 ? (completedThisWeek / tasks.length) * 100 : 0;
  },

  getAverageCompletionTime(tasks: TTaskResponse[]): number {
    const completedTasks = tasks.filter(
      task => task.status === 'done' && task.completedAt,
    );

    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((acc, task) => {
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.completedAt!).getTime();
      return acc + (completed - created);
    }, 0);

    const avgMilliseconds = totalTime / completedTasks.length;
    const avgDays = avgMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(avgDays * 10) / 10; // Round to 1 decimal place
  },

  getProductivityMetrics(tasks: TTaskResponse[]) {
    const onTime = tasks.filter(task => {
      if (task.status !== 'done' || !task.completedAt) return false;
      const completed = new Date(task.completedAt);
      const deadline = new Date(task.expectedComplitionAt);
      return completed <= deadline;
    }).length;

    const late = tasks.filter(task => {
      if (task.status !== 'done' || !task.completedAt) return false;
      const completed = new Date(task.completedAt);
      const deadline = new Date(task.expectedComplitionAt);
      return completed > deadline;
    }).length;

    return {
      onTime,
      late,
      total: onTime + late,
      onTimePercentage:
        onTime + late > 0 ? (onTime / (onTime + late)) * 100 : 0,
    };
  },
};
