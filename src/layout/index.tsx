import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import './index.less';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import CertRecord from '../pages/CertRecord';

const { Header, Sider, Content } = Layout;

const LayoutViews: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout >
      <Sider className='layout-views' trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          style={{ height: '100vh' }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/cert_man']}
          items={[
            {
              key: '/cert_man',
              icon: <UserOutlined />,
              label: '证书管理',
            },
            {
              key: '/cert_record',
              icon: <VideoCameraOutlined />,
              label: '证书记录',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path='/cert_man' element={<Home />} />
            <Route path='/cert_record' element={<CertRecord />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutViews;