import { useNavigate } from "@remix-run/react";
import { Input, Table, TableProps, Tag, Tooltip } from "antd"
import { format, isWithinInterval, parseISO } from "date-fns";
import _ from "lodash";
import { useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoEye } from "react-icons/io5";
import { formatMoney } from "~/components/utils";
import { KitItem, Order, useGetAllCombos, useGetAllKits, useGetAllOrders, useGetProfile } from "~/data"
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

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
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<string[] | undefined>(undefined);

  const datasource = useMemo(() => {
    return _(orders.data?.data)
      .filter(it => {
        if (search.length > 0) {
          return it.orderId.toString().toLowerCase().trim().includes(search.toLowerCase().trim());
        }
        return true;
      })
      .filter(it => {
        if (dateRange && dateRange[0]?.length > 0 && dateRange[1]?.length > 0) {
          const startDate = parseISO(dateRange[0]);
          const endDate = parseISO(dateRange[1]);
          return isWithinInterval(it.orderDate, {
            start: startDate,
            end: endDate
          })
        }
        return true;
      })
      .orderBy(it => it.orderDate, "desc")
      .value();
  }, [orders.data?.data, search, dateRange]);

  const columns: TableProps<Order>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Total Amount',
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
      <div className="flex flex-col gap-4">
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="header-search w-1/4"
          placeholder="Type here..."
          prefix={<FaMagnifyingGlass />}
        />
        <Space direction="vertical" size={12}>
          <RangePicker onCalendarChange={(dates, dateStrings) => {
            setDateRange(dateStrings);
            console.log(dateStrings);
            
          }}/>
        </Space>
      </div>
      <Table loading={orders.isLoading} columns={columns} dataSource={datasource}>
      </Table>
    </div>
  )
}