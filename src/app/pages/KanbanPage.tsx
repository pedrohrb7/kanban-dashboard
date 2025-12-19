import { Badge, Button, Flex, Input, Modal, Select, Typography } from 'antd';
import { AddCircle, ArrowDown, ArrowUp, Setting2 } from 'iconsax-reactjs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { KanbanBoard } from '../../modules/kanban/components/kanban-board';
import useSettingsDrawer from '../../modules/settings/store';
import { SettingsDrawer } from '../../modules/settings/components/settings-drawer';
import { useKanbanFilters } from '../../modules/kanban/store/useKanbanFilters';
import { findAllUsersAPI } from '../../modules/user/actions/get-all-users';
import type { TStatusType } from '../../modules/kanban/types';
import type { TTaskResponse } from '../../modules/kanban/types/TTask';
import { TaskForm } from '../../modules/kanban/components/task-form';
import {
  KANBAN_ACTION_KEY,
  TASK_ACTION_KEY,
} from '../../modules/kanban/actions/KanbanActions';
import { STATUS_TYPE_ENUM } from '../../modules/kanban/types/TStatus';

const { Title } = Typography;
const { Search } = Input;

const KanbanPage = () => {
  const { open } = useSettingsDrawer();
  const {
    statusFilter,
    responsibleFilter,
    searchQuery,
    sortDirection,
    setStatusFilter,
    setResponsibleFilter,
    setSearchQuery,
    setSortDirection,
    resetFilters,
  } = useKanbanFilters();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TTaskResponse | undefined>(
    undefined,
  );

  const handleTaskClick = (task: TTaskResponse) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  };

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: findAllUsersAPI,
  });

  const { data: columns = [] } = useQuery({
    queryKey: [KANBAN_ACTION_KEY.FIND_ALL],
    queryFn: async () => {
      const { KanbanActions } =
        await import('../../modules/kanban/actions/KanbanActions');
      return KanbanActions.findAll();
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: [TASK_ACTION_KEY.FIND_ALL],
    queryFn: async () => {
      const { KanbanActions } =
        await import('../../modules/kanban/actions/KanbanActions');
      const { TaskStorage } =
        await import('../../modules/kanban/utils/task-utils');
      const storedTasks = TaskStorage.getTasks();
      if (storedTasks && storedTasks.length > 0) {
        return storedTasks;
      }
      return KanbanActions.findAllTasks();
    },
  });

  const getColumnTaskCounts = () => {
    const counts: Record<number, number> = {};
    columns.forEach(column => {
      counts[column.id] = tasks.filter(
        task => task.columnId === column.id,
      ).length;
    });
    return counts;
  };

  const columnTaskCounts = getColumnTaskCounts();

  return (
    <>
      <Title level={2}>Kanban Board</Title>
      <Flex
        align="center"
        justify="space-between"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: '1rem',
        }}>
        <Flex gap="1rem" wrap="wrap" align="center">
          <Button
            style={{ height: 32, padding: '1.0rem' }}
            type="primary"
            onClick={() => {
              setSelectedTask(undefined);
              setIsTaskModalOpen(true);
            }}>
            <AddCircle size={22} /> Adicionar Nova Tarefa
          </Button>

          <Select
            style={{ width: 200 }}
            placeholder="Filtrar por status"
            onChange={value =>
              setStatusFilter(value === 'all' ? 'all' : (value as TStatusType))
            }
            value={statusFilter}
            options={[
              { value: 'all', label: 'Todos os status' },
              { value: 'todo', label: 'A Fazer' },
              { value: 'in_progress', label: 'Em Progresso' },
              { value: 'overdue', label: 'Atrasado' },
              { value: 'done', label: 'Concluído' },
            ]}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Filtrar por responsável"
            onChange={value =>
              setResponsibleFilter(value === 'all' ? 'all' : value)
            }
            value={responsibleFilter}
            options={[
              { value: 'all', label: 'Todos os responsáveis' },
              ...users.map(user => ({
                value: user.id,
                label: user.name,
              })),
            ]}
          />

          <Search
            placeholder="Buscar por título ou descrição"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />

          <Button
            icon={
              sortDirection === 'asc' ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            }
            onClick={() =>
              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
            }>
            Data Criação {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>

          {(statusFilter !== 'all' ||
            responsibleFilter !== 'all' ||
            searchQuery) && (
            <Button onClick={resetFilters} danger>
              Limpar Filtros
            </Button>
          )}
        </Flex>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {columns.map(column => (
              <Badge
                key={column.id}
                count={columnTaskCounts[column.id] || 0}
                style={{
                  backgroundColor: STATUS_TYPE_ENUM[column.type as TStatusType],
                }}
              />
            ))}
          </div>
          <Button type="primary" onClick={open}>
            <Setting2
              size={20}
              style={{ cursor: 'pointer', marginLeft: 'auto' }}
            />
          </Button>
        </div>
      </Flex>
      <KanbanBoard onTaskClick={handleTaskClick} />

      <SettingsDrawer />

      <Modal
        title={selectedTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
        open={isTaskModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}>
        <TaskForm
          task={selectedTask}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default KanbanPage;
