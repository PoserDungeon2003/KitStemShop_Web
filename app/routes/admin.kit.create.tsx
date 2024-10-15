import { useNavigate } from "@remix-run/react";
import { Button, Col, Form, Input, Layout, notification, Row, Select, Typography } from "antd"
import _ from "lodash";
import { useState } from "react";
import { CreateKitRQ, createNewKit, useGetAllCombos, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function AdminKitCreate() {
  const combo = useGetAllCombos();
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

  const onFinish = async (values: CreateKitRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await createNewKit(profile.data?.user?.token || '', values);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Create new combo successfully!');
        setIsLoading(false);
        navigate('/admin/kit');
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
              <Title level={2} className="text-center">Create New Kit</Title>
              {contextHolder}
              <Form
                name="create_kit"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item label="Kit Name" name="kitName" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Combo"
                  name="compoId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select options={_.map(combo.data?.data, (item) => {
                    return {
                      label: item.labKitName,
                      value: item.compoId,
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