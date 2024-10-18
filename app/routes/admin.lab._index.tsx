import { useNavigate } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd"
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { Lab, useGetAllCategoriesLab, useGetAllLabs } from "~/data"

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminKit() {
  const labs = useGetAllLabs();
  const categoryLab = useGetAllCategoriesLab();
  
  const navigate = useNavigate();

  const mapCategoryLab = useMemo(() => {
    return _.mapKeys(categoryLab.data?.data,  it => it.categoryLabId);
  }, [labs.data?.data]);

  const datasource = useMemo(() => {
    return _(labs.data?.data)
      .orderBy(it => it.labId, "desc")
      .value();
  }, [labs.data?.data]);

  const columns: TableProps<Lab>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'labId',
      key: 'labId',
    },
    {
      title: 'Name',
      dataIndex: 'labName',
      key: 'labName',
    },
    {
      title: 'Description',
      dataIndex: 'labDescription',
      key: 'labDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (labDescription: string) => (
        <Tooltip placement="topLeft" title={labDescription}>
          {labDescription}
        </Tooltip>
      )
    },
    {
      title: 'Video',
      dataIndex: 'videoUrl',
      key: 'labDescription',
      render: (videoUrl: string) => <a target="_blank" href={videoUrl}>Link</a>
    },
    {
      title: 'Lab',
      dataIndex: 'categoryLabId',
      key: 'categoryLabId',
      render: (id: number) => mapCategoryLab[id]?.categoryLabName,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return (
          <Tag color={status.toLowerCase() == "active" ? "green" : "red"}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Lab) => (
        <IoEye
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/admin/lab/${record.labId}`)}
        />
      ),
    },
  ];
  return (
    <div>
      <Table loading={labs.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}