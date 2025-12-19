import { Spin } from 'antd';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

import { Task } from './task';

import {
  type TColumnResponse,
  type TTaskResponse,
  STATUS_TYPE_ENUM,
} from '../types';
import useSettingsDrawer from '../../settings/store';

interface IColumn {
  column: TColumnResponse;
  tasks?: TTaskResponse[];
  isLoading: boolean;
  onTaskClick?: (task: TTaskResponse) => void;
}

export const Column = ({ column, tasks, isLoading, onTaskClick }: IColumn) => {
  const borderColor = STATUS_TYPE_ENUM[column.type];
  const { canMoveColumns } = useSettingsDrawer();

  const taskIds = useMemo(() => tasks?.map(task => task.id) || [], [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: !canMoveColumns,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          width: '350px',
          minWidth: '350px',
          maxWidth: '350px',
          minHeight: 'calc(100vh - 300px)',
          maxHeight: 'calc(100vh - 300px)',
          borderRadius: '0.375rem',
          border: `2px solid ${borderColor}`,
          opacity: 0.4,
        }}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: '350px',
        minWidth: '350px',
        maxWidth: '350px',
        minHeight: 'calc(100vh - 300px)',
        maxHeight: 'calc(100vh - 300px)',
        borderRadius: '0.375rem',
        border: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <div
        {...(canMoveColumns ? attributes : {})}
        {...(canMoveColumns ? listeners : {})}
        style={{
          fontSize: '1rem',
          lineHeight: '1.5rem',
          borderRadius: '0.375rem 0.375rem 0 0',
          padding: '0.75rem',
          fontWeight: 'bold',
          borderBottom: '1px solid #00000060',
          backgroundColor: borderColor,
          color: 'white',
          cursor: canMoveColumns ? 'grab' : 'default',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div>{column.title}</div>
          <div>
            {tasks?.length} / {column.limit === 0 ? '∞' : column.limit}
          </div>
        </div>
      </div>

      <div
        ref={setDroppableRef}
        style={{ overflowY: 'auto', flex: 1, padding: '0.75rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <SortableContext items={taskIds}>
            {tasks?.map(task => (
              <Task
                key={task.id}
                task={task}
                isLoading={isLoading}
                onTaskClick={onTaskClick}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};
