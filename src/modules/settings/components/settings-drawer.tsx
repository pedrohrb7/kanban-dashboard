import { Tabs, Switch, Space, Typography } from 'antd';
import { BaseDrawer } from '../../../ui/components/BaseDrawer';
import useSettingsDrawer from '../store';
import { UserTable } from '../../user/components/user-table';

const { Text } = Typography;

export const SettingsDrawer = () => {
  const { close, isOpen, canMoveColumns, toggleColumnMovement } =
    useSettingsDrawer();

  const items = [
    {
      key: 'users',
      label: 'Usuários',
      children: <UserTable />,
    },
    {
      key: 'kanban',
      label: 'Kanban',
      children: (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space direction="vertical" size="small">
              <Text strong>Movimentação de Colunas</Text>
              <Space>
                <Switch
                  checked={canMoveColumns}
                  onChange={toggleColumnMovement}
                />
                <Text>
                  {canMoveColumns
                    ? 'As colunas podem ser reordenadas'
                    : 'As colunas estão fixas'}
                </Text>
              </Space>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Quando ativado, você pode arrastar as colunas para reordená-las
                no quadro Kanban.
              </Text>
            </Space>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <BaseDrawer
      title="Configurações"
      size={720}
      onClose={close}
      isOpen={isOpen}>
      <Tabs defaultActiveKey="users" items={items} />
    </BaseDrawer>
  );
};
