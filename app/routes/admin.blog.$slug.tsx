import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Layout, Modal, notification, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Blog, deleteBlogById, deleteLabById, getBlogById, getLabById, Lab, NotificationType, updateBlogById, UpdateBlogRQ, updateLabById, UpdateLabRQ, useGetAllCategoriesBlog, useGetAllCategoriesLab, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  blog: Blog;
  slug: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let blog = await getBlogById(Number(slug));
    if (blog.data) {
      return json({ blog: blog.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminKitSlug() {
  const { blog, slug } = useLoaderData<LoaderData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this blog?');
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoryBLog = useGetAllCategoriesBlog();

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

  const onFinish = async (values: UpdateBlogRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateBlogById(profile.data?.user?.token || '', Number(slug), values);
      if (response.data) {
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['blogs']
        })
        navigate('/admin/blog');
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
      let response = await deleteBlogById(profile.data?.user?.token || '', [Number(slug)]);
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['blogs']
        })
        setConfirmLoading(false);
        setOpen(false);
        navigate('/admin/blog');
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
                <Title level={2} className="text-center">Blog Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={showModal}
                />
              </Row>
              <Form
                name="update_blog"
                initialValues={{ remember: true, ...blog }}
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input!' }]}>
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Content"
                  name="content"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Input.TextArea allowClear />
                </Form.Item>
                <Form.Item
                  label="Blog Category"
                  name="categoryId"
                  rules={[{ required: true, message: 'Please input!' }]}
                >
                  <Select loading={categoryBLog.isLoading} options={_.map(categoryBLog.data?.data, (item) => {
                    return {
                      label: item.categoryName,
                      value: item.categoryId,
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
        title="Delete Blog"
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