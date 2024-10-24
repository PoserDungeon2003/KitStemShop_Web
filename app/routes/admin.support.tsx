import { useNavigate } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd"
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { KitItem, SupportRequest, useGetAllCombos, useGetAllKits, useGetProfile } from "~/data"
import { useGetSupportRequest } from "~/data/supportrequest";

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

  const datasource = useMemo(() => {
    return _(support.data?.data)
      .orderBy(it => it.lastSupportDate, "desc")
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
      render: (record: KitItem) => (
        <a>Edit</a>
      ),
    },
  ];

  return (
    <div>
      <Table loading={support.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}