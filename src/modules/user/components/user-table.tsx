import { Button, Table, Modal } from 'antd';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AddCircle } from 'iconsax-reactjs';

import { findAllUsersAPI } from '../actions/get-all-users';
import { UserForm } from './user-form';

export const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: findAllUsersAPI,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <Button
          type="primary"
          icon={<AddCircle size={20} />}
          onClick={() => setIsModalOpen(true)}>
          Adicionar Usuário
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title="Criar Novo Usuário"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}>
        <UserForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
