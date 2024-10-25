import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal, Table, TableProps, Tag, Tooltip } from "antd";
import { addYears, format } from "date-fns";
import _ from "lodash";
import { useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";
import { formatMoney } from "~/components/utils";
import { confirmOrderReceived, getOrderDetails, OrderData, OrderDetail, useGetAllCombos, useGetAllItems, useGetOrderDetails, useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  // details: OrderData;
  slug?: string;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  let slug = params.slug;
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return json({ slug }, { status: 200 });
  // try {
  //   let details = await getOrderDetails(user?.token || "", Number(slug));
  //   if (details.status !== -4) {
  //     return json({ details: details.data }, { status: 200 });
  //   }
  //   return redirect("/account/order");
  // } catch (error) {
  //   return json({}, {});
  // }
}

export default function OrderDetails() {
  const { slug } = useLoaderData<LoaderData>();
  const combo = useGetAllCombos();
  const items = useGetAllItems();
  const [modal, contextHolder] = Modal.useModal();
  const profile = useGetProfile();
  const orderDetails = useGetOrderDetails(profile.data?.user?.token || "", Number(slug));
  const queryClient = useQueryClient();

  const mapItems = useMemo(() => {
    return _.mapKeys(items.data?.data, it => it.istemId);
  }, [items.data?.data]);

  const mapCombo = useMemo(() => {
    return _.mapKeys(combo.data?.data, it => it.compoId);
  }, [combo.data?.data]);

  const dataSource = useMemo(() => {
    return _(orderDetails.data?.data.details)
      .orderBy(it => it.orderDetailsId, "desc")
      .value();
  }, [orderDetails.data?.data.details]);

  const handleConfirmOrder = async (orderDetailId: number, comboId?: number, itemId?: number | null) => {
    const confirm = await modal.confirm({
      title: `Confirm order received`,
      content: `Confirm that you have received ${comboId ? mapCombo[comboId]?.labKitName : mapItems[itemId || 0]?.istemName}?`,
      okType: 'default'
    })
    if (confirm) {
      try {
        let response = await confirmOrderReceived(profile.data?.user?.token || '', orderDetailId, "Done");
        if (response) {
          message.success("Order received successfully");
          queryClient.invalidateQueries({
            queryKey: ['order-details']
          })
          queryClient.invalidateQueries({
            queryKey: ['my-order']
          })
        }
      } catch (error: any) {
        message.error(error?.message)
      }
    }
  }

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
      render: (status: string) => {
        return (
          <Tag color={status == 'Pending' ? "processing" : "green"}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: 'Confirm',
      key: 'actions',
      render: (record: OrderDetail) => (
        <Button onClick={() => handleConfirmOrder(record.orderDetailsId, record.compoId, record.iStemId)}>
          Order Received
        </Button>
      ),
    },
  ];

  return (
    <div className="col-span-9">
      {contextHolder}
      <Link to={`/account/order`} className="flex items-center gap-1">
        <IoArrowBack />
        <span>Back</span>
      </Link>
      <Table loading={orderDetails.isLoading} className="overflow-auto" dataSource={dataSource} columns={columns}>
      </Table>
      <h4 className="flex justify-end font-bold">
        Total: {formatMoney(orderDetails.data?.data.totalPrice || 0)}
      </h4>
    </div>
  )
}