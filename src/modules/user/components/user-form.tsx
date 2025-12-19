import { Button, Form, Input, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUserAPI } from '../actions/create-user';
import type { TUser } from '../types/TUser';

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const UserForm = ({ onSuccess, onCancel }: UserFormProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUserAPI,
    onSuccess: (newUser: TUser) => {
      queryClient.setQueryData(['users'], (oldUsers: TUser[] = []) => {
        return [...oldUsers, newUser];
      });

      const USERS_STORAGE_KEY = 'kanban_users';
      const currentUsers = JSON.parse(
        localStorage.getItem(USERS_STORAGE_KEY) || '[]',
      );
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([...currentUsers, newUser]),
      );

      message.success('Usuário criado com sucesso!');
      form.resetFields();
      onSuccess();
    },
    onError: error => {
      console.error('Error creating user:', error);
      message.error('Erro ao criar usuário. Tente novamente.');
    },
  });

  const handleSubmit = (values: any) => {
    createUserMutation.mutate({
      name: values.name,
      email: values.email,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Nome"
        rules={[
          { required: true, message: 'Por favor, insira o nome do usuário' },
        ]}>
        <Input placeholder="Digite o nome do usuário" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Por favor, insira o email do usuário' },
          { type: 'email', message: 'Por favor, insira um email válido' },
        ]}>
        <Input placeholder="Digite o email do usuário" />
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
            loading={createUserMutation.isPending}>
            Criar Usuário
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
