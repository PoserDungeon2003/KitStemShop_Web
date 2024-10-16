import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Layout, Modal, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { deleteKitById, getKitById, Kit, updateKitById, UpdateKitRQ, useGetAllCombos, useGetProfile } from "~/data";

const { Content } = Layout;
const { Title } = Typography;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  kit: Kit;
  slug: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  let slug = params.slug;
  try {
    let kit = await getKitById(slug || '');
    if (kit.data) {
      return json({ kit: kit.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminKitSlug() {
  const { kit, slug } = useLoaderData<LoaderData>();
  const combo = useGetAllCombos();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Do you want to delete this kit?');
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const onFinish = async (values: UpdateKitRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateKitById(profile.data?.user?.token || '', Number(slug), values);
      if (response.data) {
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ['kits']
        })
        navigate('/admin/kit');
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
      let response = await deleteKitById(profile.data?.user?.token || '', [Number(slug)]);
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['kits']
        })
        setConfirmLoading(false);
        setOpen(false);
        navigate('/admin/kit');
      }
    } catch (error: any) {
      setConfirmLoading(false);
      alert(error?.message);
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
                <Title level={2} className="text-center">Kit Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={showModal}
                />
              </Row>
              <Form
                name="update_combo"
                initialValues={{ remember: true, ...kit }}
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