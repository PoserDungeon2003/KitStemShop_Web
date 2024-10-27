import { Link, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Dropdown, MenuProps, message, Modal, Space, Table, TableProps, Tag, Tooltip } from "antd"
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoChevronDownOutline, IoEye } from "react-icons/io5";
import { deleteSupportRequestById, KitItem, SupportRequest, updateSupportRequestById, UpdateSupportRequestRQ, useGetAllCombos, useGetAllKits, useGetAllLabs, useGetProfile, useGetSupportRequest } from "~/data"

const { confirm } = Modal;

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminSupport() {
  const profile = useGetProfile();
  const support = useGetSupportRequest(profile.data?.user?.token || "");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const labs = useGetAllLabs(profile.data?.user?.token || "");

  const mapLab = useMemo(() => {
    return _.mapKeys(labs.data?.data, it => it.labId);
  }, [labs.data?.data]);

  const handleDelete = async (id: number) => {
    confirm({
      okType: 'default',
      title: 'Delete request',
      content: 'Are you sure you want to delete this support request?',
      onOk: async () => {
        try {
          let response = await deleteSupportRequestById(profile.data?.user?.token || '', id);
          if (response) {
            queryClient.invalidateQueries({
              queryKey: ['support-request']
            })
            message.success("Delete support request successfully");
          }
        } catch (error: any) {
          message.error(error?.message);
        } finally {
        }
      }
    })
  };

  const updateSupportRequestStatus = async (supportRequest: SupportRequest) => {
    console.log('Received values of form: ', supportRequest);

    confirm({
      okType: 'default',
      title: 'Update status',
      content: 'Are you sure you want to update this support request status?',
      onOk: async () => {
        try {
          let response = await updateSupportRequestById(profile.data?.user?.token || '', {
            labId: supportRequest.labId || 0,
            lastSupportDate: supportRequest.lastSupportDate || new Date().toISOString(),
            managerId: profile.data?.detail?.userId || 0,
            maxSupportCount: supportRequest.MaxSupportCount || 0,
            requestDescription: supportRequest.requestDescription || "",
            requestTitle: supportRequest.requestTitle || "",
            status: "Answered",
            supportCount: supportRequest.supportCount || 0,
            supportRequestId: supportRequest.supportRequestId,
            userId: supportRequest.userId || 0,
          });
          if (response.status === -4) {
            message.error(response.message);
            return;
          }
          queryClient.invalidateQueries({
            queryKey: ['support-request']
          })
          message.success("Update support request successfully");
        } catch (error: any) {
          message.error(error?.message);
        } finally {
        }
      }
    })
  };

  const datasource = useMemo(() => {
    return _(support.data?.data)
      .orderBy(it => [it.lastSupportDate, it.status], "desc")
      .value();
  }, [support.data?.data]);

  const columns: TableProps<SupportRequest>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'supportRequestId',
      key: 'supportRequestId',
    },
    {
      title: 'Title',
      dataIndex: 'requestTitle',
      key: 'requestTitle',
      ellipsis: {
        showTitle: false,
      },
      render: (title: string) => (
        <Tooltip placement="topLeft" title={title}>
          {title}
        </Tooltip>
      )
    },
    {
      title: 'Description',
      dataIndex: 'requestDescription',
      key: 'requestDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <div className="whitespace-pre-wrap break-words">
          {description}
        </div>
      )
    },
    {
      title: 'Lab',
      dataIndex: 'labId',
      key: 'labId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip placement="topLeft" title={mapLab[id]?.labName}>
          {mapLab[id]?.labName}
        </Tooltip>
      )
    },
    {
      title: 'Support Count',
      dataIndex: 'supportCount',
      key: 'supportCount',
    },
    {
      title: 'Max Support Count',
      dataIndex: 'maxSupportCount',
      key: 'maxSupportCount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return (
          <Tag color={status.toLowerCase() == "not answer" ? "red" : "green"}>
            {_.upperFirst(status)}
          </Tag>
        )
      },
    },
    {
      title: 'Last Support Date',
      dataIndex: 'lastSupportDate',
      key: 'lastSupportDate',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => {
        return <Tooltip placement="topLeft" title={format(text, "HH:mm:ss dd/MM/yyyy")}>
          {format(text, "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: SupportRequest) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <a onClick={() => {
                updateSupportRequestStatus(record);
              }}>
                Update status to answered
              </a>
            ),
          },
          {
            key: '2',
            label: (
              <a onClick={() => {
                handleDelete(record.supportRequestId);
              }}>
                Delete
              </a>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Actions
                <IoChevronDownOutline />
              </Space>
            </a>
          </Dropdown>
        )
      }
      ,
    },
  ];

  return (
    <div>
      <Table loading={support.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}