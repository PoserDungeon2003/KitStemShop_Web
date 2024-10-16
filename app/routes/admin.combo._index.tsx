import { useNavigate } from "@remix-run/react";
import { Image, Table, TableProps, Tooltip } from "antd"
import _ from "lodash";
import { useMemo } from "react";
import { IoEye } from "react-icons/io5";
import { ComboLabKit, useGetAllCategoriesCombo, useGetAllCombos, useGetAllLabs } from "~/data"

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminCombo() {
  const combo = useGetAllCombos();
  const labs = useGetAllLabs();
  const categoryCombo = useGetAllCategoriesCombo();
  const navigate = useNavigate();

  const mapCategoryComboId = useMemo(() => {
    return _.mapKeys(categoryCombo.data?.data,  it => it.categoryCompoId);
  }, [categoryCombo.data?.data]);
  
  const mapLabId = useMemo(() => {
    return _.mapKeys(labs.data?.data,  it => it.labId);
  }, [labs.data?.data]);

  const datasource = useMemo(() => {
    return _(combo.data?.data)
      .orderBy(it => it.compoId, "desc")
      .value();
  }, [combo.data?.data]);

  const columns: TableProps<ComboLabKit>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'compoId',
      key: 'compoId',
    },
    {
      title: 'Name',
      dataIndex: 'labKitName',
      key: 'labKitName',
    },
    {
      title: 'Description',
      dataIndex: 'labKitDescription',
      key: 'labKitDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (labKitDescription: string) => (
        <Tooltip placement="topLeft" title={labKitDescription}>
          {labKitDescription}
        </Tooltip>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryCompoId',
      key: 'categoryCompoId',
      render: (id: number) => mapCategoryComboId[id]?.categoryName,
    },
    {
      title: 'Lab Name',
      dataIndex: 'labId',
      key: 'labId',
      ellipsis: {
        showTitle: false,
      },
      render: (id: number) => (
        <Tooltip placement="topLeft" title={mapLabId[id]?.labName}>
          {mapLabId[id]?.labName}
        </Tooltip>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => <Image src={text} width={50} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ComboLabKit) => (
        <IoEye
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/admin/combo/${record.compoId}`)}
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