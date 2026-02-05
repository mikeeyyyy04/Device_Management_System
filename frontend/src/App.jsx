import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import DeviceForm from './components/DeviceForm';
import DeviceList from './components/DeviceList';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDeviceAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#001529',
        padding: '0 50px'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Device Management System
        </Title>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          <DeviceForm onDeviceAdded={handleDeviceAdded} />
          <DeviceList refreshTrigger={refreshTrigger} />
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Device Management System ©{new Date().getFullYear()} Created with FastAPI + React
      </Footer>
    </Layout>
  );
}

export default App;
