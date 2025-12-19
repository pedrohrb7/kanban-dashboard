import { useMemo, useState, useEffect } from 'react';
import { Flex, Spin, message } from 'antd';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Column } from './column';
import { Task } from './task';
import type { TColumnResponse, TTaskResponse } from '../types';
import {
  KANBAN_ACTION_KEY,
  KanbanActions,
  TASK_ACTION_KEY,
} from '../actions/KanbanActions';
import { TaskStorage, TaskUtils } from '../utils/task-utils';
import { useKanbanFilters } from '../store/useKanbanFilters';

const LOCAL_STATE_RESET_DELAY = 100;
const QUERY_CACHE_UPDATE_DELAY = 150;

interface KanbanBoardProps {
  onTaskClick?: (task: TTaskResponse) => void;
}

export const KanbanBoard = ({ onTaskClick }: KanbanBoardProps = {}) => {
  const queryClient = useQueryClient();
  const { statusFilter, responsibleFilter, searchQuery, sortDirection } =
    useKanbanFilters();

  const { data: queryColumns = [], isLoading: isLoadingColumns } = useQuery<
    TColumnResponse[]
  >({
    queryKey: [KANBAN_ACTION_KEY.FIND_ALL],
    queryFn: async () => {
      const columns = await KanbanActions.findAll();
      const savedOrder = TaskStorage.getColumnsOrder();

      if (savedOrder && savedOrder.length === columns.length) {
        const orderedColumns = savedOrder
          .map(id => columns.find(col => col.id === id))
          .filter((col): col is TColumnResponse => col !== undefined);

        if (orderedColumns.length === columns.length) {
          return orderedColumns;
        }
      }

      return columns;
    },
  });

  const { data: queryTasks = [], isLoading: isLoadingTasks } = useQuery<
    TTaskResponse[]
  >({
    queryKey: [TASK_ACTION_KEY.FIND_ALL],
    queryFn: async () => {
      try {
        let tasks = TaskStorage.getTasks();
        if (!tasks || tasks.length === 0) {
          tasks = await KanbanActions.findAllTasks();
          TaskStorage.saveTasks(tasks);
        }
        return tasks;
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return [];
      }
    },
    enabled: queryColumns.length > 0,
  });

  const [localTasks, setLocalTasks] = useState<TTaskResponse[] | null>(null);
  const [localColumns, setLocalColumns] = useState<TColumnResponse[] | null>(
    null,
  );

  const tasks = localTasks ?? queryTasks;
  const columns = localColumns ?? queryColumns;

  const [activeColumn, setActiveColumn] = useState<TColumnResponse | null>(
    null,
  );
  const [activeTask, setActiveTask] = useState<TTaskResponse | null>(null);

  useEffect(() => {
    if (!activeTask && !activeColumn) {
      const timer = setTimeout(() => {
        setLocalTasks(null);
        setLocalColumns(null);
      }, LOCAL_STATE_RESET_DELAY);
      return () => clearTimeout(timer);
    }
  }, [activeTask, activeColumn]);

  const columnIds = useMemo(
    () => columns?.map(column => Number(column.id)),
    [columns],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const filteredAndSortedTasks = useMemo(() => {
    let result = TaskUtils.filterTasks(tasks, {
      statusFilter,
      responsibleFilter,
      searchQuery,
    });

    result = TaskUtils.sortTasks(result, sortDirection);

    return result;
  }, [tasks, statusFilter, responsibleFilter, searchQuery, sortDirection]);

  const onDragStart = (event: DragStartEvent) => {
    console.log('Drag started for column id:', event);
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveColumn(null);
      setActiveTask(null);
      return;
    }

    const activeId = active.id as number;
    const overId = over.id as number;

    if (active.data.current?.type === 'Column') {
      setActiveColumn(null);

      if (activeId === overId) return;

      setLocalColumns((prevColumns: TColumnResponse[] | null) => {
        const cols = prevColumns ?? queryColumns;
        const activeIndex = cols.findIndex(col => col.id === activeId);
        const overIndex = cols.findIndex(col => col.id === overId);

        const reorderedColumns = arrayMove(cols, activeIndex, overIndex);

        const columnIds = reorderedColumns.map(col => col.id);
        TaskStorage.saveColumnsOrder(columnIds);

        queryClient.setQueryData(
          [KANBAN_ACTION_KEY.FIND_ALL],
          reorderedColumns,
        );

        return reorderedColumns;
      });
      return;
    }

    if (active.data.current?.type === 'Task') {
      setActiveTask(null);

      const draggedTask = localTasks?.find(t => t.id === activeId);
      if (!draggedTask || !localTasks) return;

      KanbanActions.updateTask(draggedTask.id, {
        columnId: draggedTask.columnId,
        status: draggedTask.status,
        completedAt: draggedTask.completedAt,
      }).catch(error => {
        console.error('Failed to update task:', error);
        message.error('Erro ao mover tarefa. As alterações serão revertidas.');
        queryClient.invalidateQueries({ queryKey: [TASK_ACTION_KEY.FIND_ALL] });
        setLocalTasks(null);
      });

      TaskStorage.saveTasks(localTasks);

      setTimeout(() => {
        queryClient.setQueryData([TASK_ACTION_KEY.FIND_ALL], localTasks);
      }, QUERY_CACHE_UPDATE_DELAY);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    if (!isActiveTask) return;

    const isOverTask = over.data.current?.type === 'Task';
    if (isActiveTask && isOverTask) {
      setLocalTasks((prevTasks: TTaskResponse[] | null) => {
        const currentTasks = prevTasks ?? queryTasks;
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);
        const overIndex = currentTasks.findIndex(t => t.id === overId);

        if (currentTasks[activeIndex] && currentTasks[overIndex]) {
          const targetColumnId = currentTasks[overIndex].columnId;
          const updatedTask = TaskUtils.updateTaskStatus(
            currentTasks[activeIndex],
            targetColumnId,
            columns,
          );
          const updatedTasks = [...currentTasks];
          updatedTasks[activeIndex] = updatedTask;

          const reorderedTasks = arrayMove(
            updatedTasks,
            activeIndex,
            overIndex,
          );

          return reorderedTasks;
        }

        return arrayMove(currentTasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'Column';
    if (isActiveTask && isOverColumn) {
      setLocalTasks((prevTasks: TTaskResponse[] | null) => {
        const currentTasks = prevTasks ?? queryTasks;
        const activeIndex = currentTasks.findIndex(t => t.id === activeId);

        if (currentTasks[activeIndex]) {
          const updatedTask = TaskUtils.updateTaskStatus(
            currentTasks[activeIndex],
            overId,
            columns,
          );
          const updatedTasks = [...currentTasks];
          updatedTasks[activeIndex] = updatedTask;

          return updatedTasks;
        }

        return currentTasks;
      });
    }
  };

  if (isLoadingColumns) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100% - 200px)',
        }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Flex vertical gap={'2rem'} style={{ marginTop: '1rem', flexGrow: 1 }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: 8,
        }}>
        <div
          style={{
            flexGrow: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
          }}>
          <div
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              gap: '1rem',
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                gap: '1rem',
              }}>
              <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}>
                <SortableContext items={columnIds || []}>
                  {columns?.map(column => (
                    <Column
                      key={column.id}
                      column={column}
                      isLoading={isLoadingColumns}
                      tasks={filteredAndSortedTasks?.filter(
                        task => task?.columnId === column?.id,
                      )}
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </SortableContext>

                {createPortal(
                  <DragOverlay>
                    {activeColumn && (
                      <Column
                        key={activeColumn.id}
                        column={activeColumn}
                        isLoading={isLoadingColumns}
                        tasks={filteredAndSortedTasks?.filter(
                          task => task?.columnId === activeColumn?.id,
                        )}
                      />
                    )}
                    {activeTask && (
                      <Task task={activeTask} isLoading={isLoadingTasks} />
                    )}
                  </DragOverlay>,
                  document.body,
                )}
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </Flex>
  );
};
