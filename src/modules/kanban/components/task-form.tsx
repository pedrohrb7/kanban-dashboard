import { Button, Form, Input, Select, message, DatePicker } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import { KANBAN_ACTION_KEY, TASK_ACTION_KEY } from '../actions/KanbanActions';
import { findAllUsersAPI } from '../../user/actions/get-all-users';
import { createTaskAPI } from '../actions/create/create-task';
import { TaskStorage } from '../utils/task-utils';
import type { TTaskResponse } from '../types/TTask';
import { KanbanActions } from '../actions/KanbanActions';

const { TextArea } = Input;

interface TaskFormProps {
  task?: TTaskResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, onSuccess, onCancel }: TaskFormProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isEditMode = !!task;

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: findAllUsersAPI,
  });

  const { data: columns = [] } = useQuery({
    queryKey: [KANBAN_ACTION_KEY.FIND_ALL],
    queryFn: async () => {
      const { KanbanActions } = await import('../actions/KanbanActions');
      return KanbanActions.findAll();
    },
  });

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        columnId: task.columnId,
        responsibleUserId: task.responsibleUserId,
        expectedComplitionAt: dayjs(task.expectedComplitionAt),
      });
    }
  }, [task, form]);

  const createTaskMutation = useMutation({
    mutationFn: createTaskAPI,
    onSuccess: (newTask: TTaskResponse) => {
      queryClient.setQueryData(
        [TASK_ACTION_KEY.FIND_ALL],
        (oldTasks: TTaskResponse[] = []) => {
          return [...oldTasks, newTask];
        },
      );

      const currentTasks = TaskStorage.getTasks() || [];
      TaskStorage.saveTasks([...currentTasks, newTask]);

      message.success('Tarefa criada com sucesso!');
      form.resetFields();
      onSuccess();
    },
    onError: error => {
      console.error('Error creating task:', error);
      message.error('Erro ao criar tarefa. Tente novamente.');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<TTaskResponse> }) =>
      KanbanActions.updateTask(data.id, data.updates),
    onSuccess: (updatedTask: TTaskResponse) => {
      queryClient.setQueryData(
        [TASK_ACTION_KEY.FIND_ALL],
        (oldTasks: TTaskResponse[] = []) => {
          return oldTasks.map(t =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
          );
        },
      );

      const currentTasks = TaskStorage.getTasks() || [];
      const updatedTasks = currentTasks.map(t =>
        t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
      );
      TaskStorage.saveTasks(updatedTasks);

      message.success('Tarefa atualizada com sucesso!');
      form.resetFields();
      onSuccess();
    },
    onError: error => {
      console.error('Error updating task:', error);
      message.error('Erro ao atualizar tarefa. Tente novamente.');
    },
  });

  const handleSubmit = (values: any) => {
    const taskData = {
      title: values.title,
      description: values.description,
      columnId: values.columnId,
      responsibleUserId: values.responsibleUserId,
      expectedComplitionAt: values.expectedComplitionAt.toISOString(),
    };

    if (isEditMode && task) {
      updateTaskMutation.mutate({ id: task.id, updates: taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        expectedComplitionAt: dayjs().add(7, 'days'),
      }}>
      <Form.Item
        name="title"
        label="Título"
        rules={[
          { required: true, message: 'Por favor, insira o título da tarefa' },
        ]}>
        <Input placeholder="Digite o título da tarefa" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Descrição"
        rules={[
          {
            required: true,
            message: 'Por favor, insira a descrição da tarefa',
          },
        ]}>
        <TextArea rows={4} placeholder="Digite a descrição da tarefa" />
      </Form.Item>

      <Form.Item
        name="columnId"
        label="Status"
        rules={[{ required: true, message: 'Por favor, selecione o status' }]}>
        <Select placeholder="Selecione o status">
          {columns.map(column => (
            <Select.Option key={column.id} value={column.id}>
              {column.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="responsibleUserId"
        label="Responsável"
        rules={[
          { required: true, message: 'Por favor, selecione o responsável' },
        ]}>
        <Select placeholder="Selecione o responsável">
          {users.map(user => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="expectedComplitionAt"
        label="Data de Conclusão Esperada"
        rules={[
          {
            required: true,
            message: 'Por favor, selecione a data de conclusão',
          },
        ]}>
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
          }}>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={
              createTaskMutation.isPending || updateTaskMutation.isPending
            }>
            {isEditMode ? 'Atualizar Tarefa' : 'Criar Tarefa'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
