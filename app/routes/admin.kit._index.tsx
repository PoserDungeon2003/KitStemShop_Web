import { useNavigate } from "@remix-run/react";
import { Image, Table, TableProps } from "antd"
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { ComboLabKit, KitItem, useGetAllCategoriesCombo, useGetAllCombos, useGetAllKits, useGetAllLabs } from "~/data"

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
    return _.mapKeys(combo.data?.data,  it => it.compoId);
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
      render: (id: number) => mapCombo[id]?.labKitName,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
      <Table columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}