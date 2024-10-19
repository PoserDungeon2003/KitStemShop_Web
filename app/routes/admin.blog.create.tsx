import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Layout, message, notification, Row, Select, Typography, Upload, UploadFile, UploadProps } from "antd"
import _ from "lodash";
import { useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { CreateBlogRQ, createNewBlog, useGetAllCategoriesBlog, useGetProfile } from "~/data";

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
  const profile = useGetProfile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoryBLog = useGetAllCategoriesBlog();

  const [api, contextHolder] = notification.useNotification();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const openNotificationWithIcon = (type: NotificationType, showProgress: boolean, pauseOnHover: boolean, message?: string, description?: string) => {
    api[type]({
      message: message || 'Notification Title',
      description: description ||
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover: pauseOnHover,
    });
  };

  const uploadProps: UploadProps = {
    accept: '.jpg',
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      const isJpg = file.type === 'image/jpeg';
      if (!isJpg) {
        message.error('You can only upload JPG file!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        message.error('Image must smaller than 20MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList((prev) => [...prev, file]);
      return false; // Prevent automatic upload
    },
    fileList,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const onFinish = async (values: CreateBlogRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    let formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('categoryId', values.categoryId.toString());
    if (fileList.length > 0) {
      formData.append('image', values.image.file);      
    }
    try {
      let response = await createNewBlog(profile.data?.user?.token || '', formData);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Create new combo successfully!');
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['blogs']
        })
        navigate('/admin/blog');
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
              <Title level={2} className="text-center">Create New Blog</Title>
              {contextHolder}
              <Form
                name="create_blog"
                initialValues={{ remember: true }}
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
                <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input!' }]}>
                  <Upload
                    {...uploadProps}
                  >
                    {fileList.length > 0 ? null : <Button icon={<IoCloudUpload />}>Click to Upload</Button>}
                  </Upload>
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