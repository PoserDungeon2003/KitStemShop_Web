import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, InputNumber, Layout, message, Modal, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { ComboLabKitDetail, deleteComboById, getComboById, updateComboById, UpdateComboRQ, useGetAllCategoriesCombo, useGetAllLabs, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  combo: ComboLabKitDetail;
  slug: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let combo = await getComboById(slug || '');
    if (combo.data) {
      return json({ combo: combo.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminComboSlug() {
  const { combo, slug } = useLoaderData<LoaderData>();
  const labs = useGetAllLabs();
  const categoryCombo = useGetAllCategoriesCombo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this combo?');
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const onFinish = async (values: UpdateComboRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateComboById(profile.data?.user?.token || '', Number(slug), values);
      if (response.data) {
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['combos']
        })
        navigate('/admin/combo');
      }
    } catch (error: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let response = await deleteComboById(profile.data?.user?.token || '', [Number(slug)]);
      if (response) {
        message.success("Update combo successfully")
        queryClient.invalidateQueries({
          queryKey: ['combos']
        })
        setConfirmLoading(false);
        setOpen(false);
        navigate('/admin/combo');
      }
    } catch (error: any) {
      setConfirmLoading(false);
      message.error(error?.message);
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
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Row justify="center">
            <Col span={12}>
              <Row justify={"space-between"}>
                <Title level={2} className="text-center">Combo Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={showModal}
                />
              </Row>
              <Form
                name="create_combo"
                initialValues={{ remember: true, ...combo }}
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
                  <Select defaultValue={combo.labName} options={_.map(labs.data?.data, (item) => {
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
                  <Select defaultValue={combo.categoryName} options={_.map(categoryCombo.data?.data, (item) => {
                    return {
                      label: item.categoryName,
                      value: item.categoryCompoId,
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