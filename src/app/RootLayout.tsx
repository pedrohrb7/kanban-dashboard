import type { Key, PropsWithChildren } from 'react';
import { Layout, Menu, type MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router';

import { Dash, Kanban } from 'iconsax-reactjs';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <Dash size={16} />,
    label: 'Dashboard',
  },
  {
    key: '/kanban',
    icon: <Kanban size={16} />,
    label: 'Kanban',
  },
];

export const RootLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleMenuClick = ({ key }: { key: Key }) => {
    if (typeof key === 'string') {
      navigate(key);
    }
  };

  const currentBasePath = items.find(item => {
    return (
      item && typeof item.key === 'string' && pathname.startsWith(item.key)
    );
  })?.key;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          theme="light"
          width={320}
          style={{ color: '#ffffff', padding: '2rem' }}>
          <Menu
            mode="vertical"
            selectedKeys={currentBasePath ? [String(currentBasePath)] : []}
            onClick={handleMenuClick}
            className="w-full"
            items={items}
          />
        </Sider>
        <Content
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#ededed',
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
