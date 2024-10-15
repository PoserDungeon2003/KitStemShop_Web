import { useNavigate } from "@remix-run/react";
import { Button, Col, Form, Input, InputNumber, Layout, notification, Row, Select, Typography } from "antd"
import _ from "lodash";
import { useState } from "react";
import { CreateCombo, createNewCombo, useGetAllCategoriesCombo, useGetAllLabs, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function AdminComboCreate() {
  const labs = useGetAllLabs();
  const categoryCombo = useGetAllCategoriesCombo();
  const profile = useGetProfile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, showProgress: boolean, pauseOnHover: boolean, message?: string, description?: string) => {
    api[type]({
      message: message || 'Notification Title',
      description: description ||
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover: pauseOnHover,
    });
  };

  const onFinish = async (values: CreateCombo) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await createNewCombo(profile.data?.user?.token || '', values);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Create new combo successfully!');
        setIsLoading(false);
        navigate('/admin/combo');
      }
    } catch (error: any) {
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Row justify="center">
            <Col span={12}>
              <Title level={2} className="text-center">Create New Combo</Title>
              {contextHolder}
              <Form
                name="create_combo"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item label="Combo Name" name="labKitName" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="labKitDescription"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Input.TextArea allowClear />
                </Form.Item>
                <Form.Item label="Image URL" name="image" rules={[{ required: true, message: 'Please input!', type: 'url' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: 'Please input!', type: 'number', min: 1 }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Lab"
                  name="labId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select options={_.map(labs.data?.data, (item) => {
                    return {
                      label: item.labName,
                      value: item.labId
                    }
                  })} />
                </Form.Item>
                <Form.Item
                  label="Category Combo"
                  name="categoryCompoId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select options={_.map(categoryCombo.data?.data, (item) => {
                    return {
                      label: item.categoryName,
                      value: item.categoryCompoId,
                    }
                  })} />
                </Form.Item>
                <Form.Item>
                  <Button loading={isLoading} block type="primary" htmlType="submit" className="bg-blue-500">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  )
}