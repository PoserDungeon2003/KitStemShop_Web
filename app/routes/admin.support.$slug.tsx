import { json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Layout, message, Modal, Row, Select, Typography } from "antd";
import _ from "lodash";
import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { deleteKitById, deleteSupportRequestById, getKitById, getSupportRequestById, Kit, SupportRequest, updateKitById, UpdateKitRQ, updateSupportRequestById, UpdateSupportRequestRQ, useGetAllCombos, useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

type LoaderData = {
  supportRequest: SupportRequest;
  slug: string;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  let slug = params.slug;
  let user = await authenticator.isAuthenticated(request);
  if (!user) return redirect("/login");
  try {
    let supportRequest = await getSupportRequestById(user?.token || "", Number(slug));
    if (supportRequest.data) {
      return json({ supportRequest: supportRequest.data, slug }, { status: 200 });
    }
    return json({ slug }, { status: 404 });
  } catch (error) {
    return json({ slug }, { status: 500 });
  }
}

export default function AdminKitSlug() {
  const { supportRequest, slug } = useLoaderData<LoaderData>();
  const combo = useGetAllCombos();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onFinish = async (values: UpdateSupportRequestRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateSupportRequestById(profile.data?.user?.token || '', {
        labId: supportRequest.labId || 0,
        lastSupportDate: supportRequest.lastSupportDate || new Date().toISOString(),
        managerId: profile.data?.detail?.userId || 0,
        maxSupportCount: supportRequest.MaxSupportCount || 0,
        requestDescription: supportRequest.requestDescription || "",
        requestTitle: supportRequest.requestTitle || "",
        status: values.status,
        supportCount: supportRequest.supportCount || 0,
        supportRequestId: supportRequest.supportRequestId,
        userId: supportRequest.userId || 0,
      });
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

  const handleDelete = async () => {
    confirm({
      okType: 'default',
      title: 'Delete request',
      content: 'Are you sure you want to delete this support request?',
      onOk: async () => {
        try {
          let response = await deleteSupportRequestById(profile.data?.user?.token || '', Number(slug));
          if (response) {
            queryClient.invalidateQueries({
              queryKey: ['support-request']
            })
            navigate('/admin/support');
          }
        } catch (error: any) {
          message.error(error?.message);
        } finally {
        }
      }
    })
  };

  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Row justify="center">
            <Col span={12}>
              <Row justify={"space-between"}>
                <Title level={2} className="text-center">Support request Info</Title>
                <IoTrashOutline className="cursor-pointer self-center text-red-500"
                  onClick={handleDelete}
                />
              </Row>
              <Form
                name="update_combo"
                initialValues={{ remember: true, ...supportRequest }}
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
    </Layout>
  )
}