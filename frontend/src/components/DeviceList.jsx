import React, { useState, useEffect } from 'react';
import { Table, Button, Card, message, Popconfirm, Tag, Space } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { deviceAPI } from '../services/api';

function DeviceList({ refreshTrigger }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await deviceAPI.getAllDevices();
      setDevices(data);
    } catch (error) {
      message.error('Failed to fetch devices');
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [refreshTrigger]);

  const handleDelete = async (deviceId) => {
    try {
      await deviceAPI.deleteDevice(deviceId);
      message.success('Device deleted successfully');
      fetchDevices();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('Device not found');
      } else {
        message.error('Failed to delete device');
      }
      console.error('Error deleting device:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      maintenance: 'orange',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Device ID',
      dataIndex: 'device_id',
      key: 'device_id',
      sorter: (a, b) => a.device_id.localeCompare(b.device_id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type || '-',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip) => ip || '-',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => location || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Delete Device"
          description="Are you sure you want to delete this device?"
          onConfirm={() => handleDelete(record.device_id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card
      title="Device List"
      extra={
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchDevices}
          loading={loading}
        >
          Refresh
        </Button>
      }
      headStyle={{ backgroundColor: '#f0f2f5' }}
    >
      <Table
        columns={columns}
        dataSource={devices}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} devices`,
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
}

export default DeviceList;
