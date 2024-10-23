import { Link, Outlet, useNavigate } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd";
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { formatMoney } from "~/components/utils";
import { Order, useGetAllCombos, useGetAllKits, useGetAllLabs, useGetOrdersByUserId, useGetProfile } from "~/data"

export default function AccountOrder() {
  const profile = useGetProfile();
  const order = useGetOrdersByUserId(profile.data?.user?.token || "");
  const labs = useGetAllLabs();
  const combo = useGetAllCombos();
  const navigate = useNavigate();

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
      title: 'Status Lab Active',
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
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={format(text, "HH:mm:ss dd/MM/yyyy")}>
          {format(text, "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (money: number) => formatMoney(money),
    },
    {
      title: 'Detail',
      key: 'actions',
      render: (record: Order) => (
        <IoEye
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/account/order/${record.orderId}`)}
        />
      ),
    },
  ];

  return (
    <div className="col-span-9 space-y-4 overflow-auto">
      <Table dataSource={datasource} columns={columns}></Table>
      <Outlet />
    </div>
  )
}