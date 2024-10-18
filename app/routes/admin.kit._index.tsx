import { useNavigate } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd"
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { KitItem, useGetAllCombos, useGetAllKits } from "~/data"

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminKit() {
  const kits = useGetAllKits();
  const combo = useGetAllCombos();
  const navigate = useNavigate();

  const mapCombo = useMemo(() => {
    return _.mapKeys(combo.data?.data, it => it.compoId);
  }, [combo.data?.data]);

  const datasource = useMemo(() => {
    return _(kits.data?.data)
      .orderBy(it => it.updatedAt, "desc")
      .value();
  }, [kits.data?.data]);

  const columns: TableProps<KitItem>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'kitId',
      key: 'kitId',
    },
    {
      title: 'Name',
      dataIndex: 'kitName',
      key: 'kitName',
    },
    {
      title: 'Combo',
      dataIndex: 'compoId',
      key: 'compoId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip title={mapCombo[id]?.labKitName}>
          {mapCombo[id]?.labKitName}
        </Tooltip>
      ),
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
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => format(text, "HH:mm:ss dd/MM/yyyy"),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => format(text, "HH:mm:ss dd/MM/yyyy"),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: KitItem) => (
        <IoEye
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/admin/kit/${record.kitId}`)}
        />
      ),
    },
  ];
  return (
    <div>
      <Table loading={kits.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}