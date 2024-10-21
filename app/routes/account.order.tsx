import { Link } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd";
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { Order, useGetAllCombos, useGetAllKits, useGetAllLabs, useGetOrdersByUserId, useGetProfile } from "~/data"

export default function AccountOrder() {
  const profile = useGetProfile();
  const order = useGetOrdersByUserId(profile.data?.user?.token || "");
  const labs = useGetAllLabs();
  const combo = useGetAllCombos();

  const mapLab = useMemo(() => {
    return _.mapKeys(labs.data?.data, it => it.labId);
  }, [labs.data?.data]);

  const findComboByLabId = (id: number) => {
    return _(combo.data?.data)
      .find(it => it.labId === id)
  }

  const datasource = useMemo(() => {
    return _(order.data?.data)
      .orderBy('orderDate', 'desc')
      .value();
  }, [order.data?.data])

  const columns: TableProps<Order>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    // {
    //   title: 'Name',
    //   dataIndex: 'kitName',
    //   key: 'kitName',
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (kitName: string) => (
    //     <Tooltip placement="topLeft" title={kitName}>
    //       {kitName}
    //     </Tooltip>
    //   )
    // },
    {
      title: 'Lab',
      dataIndex: 'labId',
      key: 'labId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip placement="topLeft" title={mapLab[id]?.labName}>
          <Link to={`/combo/${findComboByLabId(id)?.compoId}`}>
            {mapLab[id]?.labName}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: 'Status Payment',
      dataIndex: 'statusPayment',
      key: 'statusPayment',
    },
    {
      title: 'Status',
      dataIndex: 'statusLabActive',
      key: 'statusLabActive',
      render: (status: string) => {
        return (
          <Tag color={status == 'True' ? "green" : "red"}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text: string) => format(text, "HH:mm:ss dd/MM/yyyy"),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (record: KitItem) => (
    //     <IoEye
    //       style={{ cursor: 'pointer' }}
    //       onClick={() => navigate(`/admin/kit/${record.kitId}`)}
    //     />
    //   ),
    // },
  ];

  return (
    <div className="col-span-9 space-y-4 overflow-auto">
      <Table dataSource={datasource} columns={columns}></Table>
    </div>
  )
}