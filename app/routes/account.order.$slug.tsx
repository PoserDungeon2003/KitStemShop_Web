import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Table, TableProps, Tooltip } from "antd";
import { addYears, format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";
import { formatMoney } from "~/components/utils";
import { getOrderDetails, OrderData, OrderDetail, useGetAllCombos, useGetAllItems } from "~/data";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  details: OrderData;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  let slug = params.slug;
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  try {
    let details = await getOrderDetails(user?.token || "", Number(slug));
    if (details.status !== -4) {
      return json({ details: details.data }, { status: 200 });
    }
    return redirect("/account/order");
  } catch (error) {
    return json({}, {});
  }
}

export default function OrderDetails() {
  const { details } = useLoaderData<LoaderData>();
  const combo = useGetAllCombos();
  const items = useGetAllItems();

  const mapItems = useMemo(() => {
    return _.mapKeys(items.data?.data, it => it.istemId);
  }, [items.data?.data]);

  const mapCombo = useMemo(() => {
    return _.mapKeys(combo.data?.data, it => it.compoId);
  }, [combo.data?.data]);

  const dataSource = useMemo(() => {
    return _(details.details)
      .orderBy(it => it.orderDetailsId, "desc")
      .value();
  }, [details]);

  const columns: TableProps<OrderDetail>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'orderDetailsId',
      key: 'orderDetailsId',
    },
    {
      title: 'Combo name',
      dataIndex: 'compoId',
      key: 'compoId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip title={mapCombo[id]?.labKitName}>
          {mapCombo[id]?.labKitName}
        </Tooltip>
      )
    },
    {
      title: 'Item name',
      dataIndex: 'iStemId',
      key: 'iStemId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip title={mapItems[id]?.istemName || 'None'}>
          {mapItems[id]?.istemName || 'None'}
        </Tooltip>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (money: number) => formatMoney(money),
    },
    {
      title: 'Warranty Start Date',
      dataIndex: 'warrantyStartDate',
      key: 'warrantyStartDate',
      ellipsis: {
        showTitle: false,
      },
      render: (text?: string) => (
        <Tooltip placement="topLeft" title={format(text || new Date("2024-10-24"), "HH:mm:ss dd/MM/yyyy")}>
          {format(text || new Date("2024-10-24"), "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
    {
      title: 'Warranty End Date',
      dataIndex: 'warrantyEndDate',
      key: 'warrantyEndDate',
      ellipsis: {
        showTitle: false,
      },
      render: (text?: string) => (
        <Tooltip placement="topLeft" title={format(text || addYears(new Date('2024-10-24'), 1), "HH:mm:ss dd/MM/yyyy")}>
          {format(text || addYears(new Date('2024-10-24'), 1), "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div className="col-span-9">
      <Link to={`/account/order`} className="flex items-center gap-1">
        <IoArrowBack />
        <span>Back</span>
      </Link>
      <Table dataSource={dataSource} columns={columns}>
      </Table>
      <h4 className="flex justify-end font-bold">
        Total: {formatMoney(details.totalPrice)}
      </h4>
    </div>
  )
}