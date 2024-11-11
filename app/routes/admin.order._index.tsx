import { useNavigate } from "@remix-run/react";
import { Table, TableProps, Tag, Tooltip } from "antd"
import { format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { formatMoney } from "~/components/utils";
import { KitItem, Order, useGetAllCombos, useGetAllKits, useGetAllOrders, useGetProfile } from "~/data"

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminOrder() {
  const profile = useGetProfile();
  const orders = useGetAllOrders(profile.data?.user?.token || "");
  const navigate = useNavigate();

  const datasource = useMemo(() => {
    return _(orders.data?.data)
      .orderBy(it => it.orderDate, "desc")
      .value();
  }, [orders.data?.data]);

  const columns: TableProps<Order>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Totoal Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text: number) => <span>{formatMoney(text)}</span>,
    },
    {
      title: 'Status Lab Active',
      dataIndex: 'statusLabActive',
      key: 'statusLabActive',
      render: (status: string) => {
        return (
          <Tag color={status.toLowerCase() == "true" ? "green" : "red"}>
            {_.upperFirst(status)}
          </Tag>
        )
      },
    },
    {
      title: 'Status Payment',
      dataIndex: 'statusPayment',
      key: 'statusPayment',
      render: (status: string) => {
        return (
          <Tag color={status.toLowerCase() == "success" ? "green" : "red"}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'createdAt',
      render: (text: string) => format(text, "HH:mm:ss dd/MM/yyyy"),
    },
  ];
  
  return (
    <div>
      <Table loading={orders.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}