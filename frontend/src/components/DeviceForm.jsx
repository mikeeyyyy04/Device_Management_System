import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { deviceAPI } from '../services/api';

const { Option } = Select;

function DeviceForm({ onDeviceAdded }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await deviceAPI.addDevice(values);
      message.success(response.message || 'Device added successfully!');
      form.resetFields();
      if (onDeviceAdded) {
        onDeviceAdded();
      }
    } catch (error) {
      if (error.response?.status === 409) {
        message.error(`Duplicate device: ${error.response.data.detail}`);
      } else if (error.response?.data?.detail) {
        message.error(`Error: ${error.response.data.detail}`);
      } else {
        message.error('Failed to add device. Please try again.');
      }
      console.error('Error adding device:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Add New Device" 
      style={{ marginBottom: 24 }}
      headStyle={{ backgroundColor: '#f0f2f5' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'active' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Form.Item
            label="Device ID"
            name="device_id"
            rules={[
              { required: true, message: 'Please input device ID!' },
              { min: 1, message: 'Device ID must be at least 1 character' }
            ]}
          >
            <Input placeholder="e.g., DEV-001" />
          </Form.Item>

          <Form.Item
            label="Device Name"
            name="name"
            rules={[
              { required: true, message: 'Please input device name!' },
              { min: 1, max: 100, message: 'Name must be between 1 and 100 characters' }
            ]}
          >
            <Input placeholder="e.g., Main Server" />
          </Form.Item>

          <Form.Item
            label="Device Type"
            name="type"
            rules={[
              { max: 50, message: 'Type must be at most 50 characters' }
            ]}
          >
            <Select placeholder="Select device type">
              <Option value="server">Server</Option>
              <Option value="router">Router</Option>
              <Option value="switch">Switch</Option>
              <Option value="firewall">Firewall</Option>
              <Option value="workstation">Workstation</Option>
              <Option value="printer">Printer</Option>
              <Option value="iot">IoT Device</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="IP Address"
            name="ip_address"
          >
            <Input placeholder="e.g., 192.168.1.100" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[
              { max: 200, message: 'Location must be at most 200 characters' }
            ]}
          >
            <Input placeholder="e.g., Server Room A" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="maintenance">Maintenance</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<PlusOutlined />}
            loading={loading}
            size="large"
          >
            Add Device
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default DeviceForm;
