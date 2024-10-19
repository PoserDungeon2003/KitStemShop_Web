import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Layout, Modal, notification, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { deleteLabById, getLabById, Lab, NotificationType, updateLabById, UpdateLabRQ, useGetAllCategoriesLab, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  lab: Lab;
  slug: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let lab = await getLabById(Number(slug));
    if (lab.data) {
      return json({ lab: lab.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminLabSlug() {
  const { lab, slug } = useLoaderData<LoaderData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this lab?');
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoryLab = useGetAllCategoriesLab();

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

  const showModal = () => {
    setOpen(true);
  };

  const onFinish = async (values: UpdateLabRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateLabById(profile.data?.user?.token || '', Number(slug), values);
      if (response.data) {
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['labs']
        })
        navigate('/admin/lab');
      }
    } catch (error: any) {
      setIsLoading(false);
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let response = await deleteLabById(profile.data?.user?.token || '', [Number(slug)]);
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['labs']
        })
        setConfirmLoading(false);
        setOpen(false);
        navigate('/admin/lab');
      }
    } catch (error: any) {
      setConfirmLoading(false);
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <Layout>
      {contextHolder}
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Row justify="center">
            <Col span={12}>
              <Row justify={"space-between"}>
                <Title level={2} className="text-center">Lab Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={showModal}
                />
              </Row>
              <Form
                name="update_lab"
                initialValues={{ remember: true, ...lab }}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item label="Lab Name" name="labName" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="labDescription"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Input.TextArea allowClear />
                </Form.Item>
                <Form.Item label="Video URL" name="videoUrl" rules={[{ required: true, message: 'Please input!', type: 'url' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Category Lab"
                  name="categoryLabId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select options={_.map(categoryLab.data?.data, (item) => {
                    return {
                      label: item.categoryLabName,
                      value: item.categoryLabId,
                    }
                  })} />
                </Form.Item>
                <Form.Item>
                  <Button loading={isLoading} block type="primary" htmlType="submit" className="bg-blue-500">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Content>
      <Modal
        title="Delete Lab"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="text"
        okText="Yes"
      >
        <p>{modalText}</p>
      </Modal>
    </Layout>
  )
}