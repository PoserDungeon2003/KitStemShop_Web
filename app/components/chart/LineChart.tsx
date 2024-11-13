import { Typography } from "antd";
import { FaMinus } from "react-icons/fa6";
import { useGetAllOrders, useGetProfile } from "~/data";
import { useMemo } from "react";
import _ from "lodash";
import { format, parseISO } from "date-fns";
import { Chart } from "react-chartjs-2";
import 'chart.js/auto';
import { formatMoney } from "../utils";

const { Title, Paragraph } = Typography;

const percentageChange = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth > 0 ? 100 : 0;
  return ((thisMonth - lastMonth) / Math.abs(lastMonth)) * 100;
};

export const LineChart = () => {
  const profile = useGetProfile();
  const order = useGetAllOrders(profile.data?.user?.token || "");

  const data = useMemo(() => {
    const groupedData = _(order.data?.data)
      .filter(it => it.statusPayment.toLowerCase() == 'success')
      .groupBy(item => format(parseISO(item.orderDate), 'yyyy-MM'))
      .map((value) => ({
        month: format(parseISO(value[0].orderDate), 'MMM yyyy'),
        totalAmount: _.sumBy(value, it => it.totalAmount), 
      }))
      .value();

    return {
      labels: _.map(groupedData, group => group.month),
      datasets: [
        {
          label: 'Orders',
          data: _.flatMap(groupedData, group => group.totalAmount),
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        },
      ],
    };
  }, [order.data]);

  const { thisMonthTotal, lastMonthTotal, changePercent } = useMemo(() => {
    const groupedByMonth = _(order.data?.data)
      .filter(it => it.statusPayment.toLowerCase() == 'success')
      .groupBy(item => format(parseISO(item.orderDate), 'yyyy-MM'))
      .map((items, month) => ({
        month,
        totalAmount: _.sumBy(items, 'totalAmount'),
      }))
      .orderBy('month', 'desc')
      .value();

    const thisMonth = _.nth(groupedByMonth, 0)?.totalAmount || 0;
    const lastMonth = _.nth(groupedByMonth, 1)?.totalAmount || 0;

    const changePercent = percentageChange(thisMonth, lastMonth);

    return {
      thisMonthTotal: thisMonth,
      lastMonthTotal: lastMonth,
      changePercent,
    };
  }, [order.data]);

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Total Revenue</Title>
          <Paragraph className="lastweek">
            than last month <span className={`${ changePercent <= 0 ? 'text-red-500' : '' } bnb2`}>{changePercent.toFixed(2)}%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<FaMinus />} This month: {formatMoney(thisMonthTotal)}</li>
            <li>{<FaMinus />} Last month: {formatMoney(lastMonthTotal)}</li>
          </ul>
        </div>
      </div>

      <Chart type="line" options={{
        responsive: true,
      }}
        data={data}
      />
    </>
  )
}