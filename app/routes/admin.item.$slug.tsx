import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, InputNumber, Layout, Modal, notification, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { deleteItemById, getItemById, Item, NotificationType, updateItemById, UpdateItemRQ, useGetAllKits, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  items: Item;
  slug: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let item = await getItemById(slug || '');
    if (item.data) {
      return json({ items: item.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminComboSlug() {
  const { items, slug } = useLoaderData<LoaderData>();
  const kits = useGetAllKits();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this item?');
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const onFinish = async (values: UpdateItemRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateItemById(profile.data?.user?.token || '', Number(slug), values);
      if (response.data) {
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['items']
        })
        navigate('/admin/item');
      }
    } catch (error: any) {
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let response = await deleteItemById(profile.data?.user?.token || '', [Number(slug)]);
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['items']
        })
        setConfirmLoading(false);
        setOpen(false);
        navigate('/admin/item');
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
                <Title level={2} className="text-center">Item Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={showModal}
                />
              </Row>
              <Form
                name="create_item"
                initialValues={{ remember: true, ...items }}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item label="Item Name" name="istemName" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item label="Image URL" name="img" rules={[{ required: true, message: 'Please input!', type: 'url' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Warranty Months"
                  name="warrantyMonths"
                  rules={[{ required: true, message: 'Please input!', type: 'number', min: 1 }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: 'Please input!', type: 'number', min: 1 }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[{ required: true, message: 'Please input!', type: 'number' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Kit"
                  name="kitId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select defaultValue={items.kitId} options={_.map(kits.data?.data, (item) => {
                    return {
                      label: item.kitName,
                      value: item.kitId
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
        title="Delete Combo"
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