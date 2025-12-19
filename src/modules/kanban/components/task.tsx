import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Tag } from 'antd';
import { Calendar, Clock, User } from 'iconsax-reactjs';
import { useQuery } from '@tanstack/react-query';

import type { TTaskResponse } from '../types/TTask';
import { TaskUtils } from '../utils/task-utils';
import { findAllUsersAPI } from '../../user/actions/get-all-users';

export const Task = ({
  task,
  isLoading,
  onTaskClick,
}: {
  task: TTaskResponse;
  isLoading: boolean;
  onTaskClick?: (task: TTaskResponse) => void;
}) => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: findAllUsersAPI,
  });

  const responsible = users.find(user => user.id === task.responsibleUserId);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isOverdue = TaskUtils.isOverdue(task);
  const deadline = new Date(task.expectedComplitionAt);
  const createdDate = new Date(task.createdAt);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          opacity: 0.3,
          border: '2px dashed #1890ff',
          margin: '8px',
          padding: '12px',
          borderRadius: '8px',
          minHeight: '120px',
          backgroundColor: '#f0f0f0',
        }}
      />
    );
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        border: '1px solid #d9d9d9',
        margin: '8px 0',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        cursor: 'grab',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s',
      }}
      onClick={e => {
        if (onTaskClick && !isDragging) {
          e.stopPropagation();
          onTaskClick(task);
        }
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 1px 2px rgba(0,0,0,0.1)';
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}>
        <h4
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#262626',
          }}>
          {task.title}
        </h4>
        {task.status === 'done' && (
          <Tag color="green" style={{ margin: 0 }}>
            Concluído
          </Tag>
        )}
        {isOverdue && task.status !== 'done' && (
          <Tag color="red" style={{ margin: 0 }}>
            Atrasado
          </Tag>
        )}
      </div>

      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '12px',
          color: '#595959',
          lineHeight: '1.5',
        }}>
        {task.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#8c8c8c',
          }}>
          <Calendar size={14} />
          <span>Criado: {createdDate.toLocaleDateString('pt-BR')}</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: isOverdue && task.status !== 'done' ? '#ff4d4f' : '#8c8c8c',
          }}>
          <Clock size={14} />
          <span>Prazo: {deadline.toLocaleDateString('pt-BR')}</span>
        </div>

        {task.completedAt && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#52c41a',
            }}>
            <Badge status="success" />
            <span>
              Concluído em:{' '}
              {new Date(task.completedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#8c8c8c',
            marginTop: '4px',
          }}>
          <User size={14} />
          <span>
            Responsável: {responsible?.name || `#${task.responsibleUserId}`}
          </span>
        </div>
      </div>
    </div>
  );
};
