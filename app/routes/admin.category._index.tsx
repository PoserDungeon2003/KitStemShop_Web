import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, MenuProps, Modal, notification, Select, Space, Table, TableProps, Tooltip } from "antd"
import { format } from "date-fns";
import _, { set } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { IoArrowDown } from "react-icons/io5";
import { BlogCategory, CategoryCompos, CategoryLab, CreateCategoryRQ, createNewCategoryBlog, createNewCategoryCombo, deleteCategoryComboById, NotificationType, updateCategoryCombo, UpdateCategoryComboRQ, useGetAllCategoriesBlog, useGetAllCategoriesCombo, useGetAllCategoriesLab, useGetProfile } from "~/data"

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function AdminCategory() {
  const profile = useGetProfile();
  const categoryBlog = useGetAllCategoriesBlog();
  const categoryCombo = useGetAllCategoriesCombo();
  const categoryLab = useGetAllCategoriesLab();
  const [category, setCategory] = useState<string>("combo");
  const navigate = useNavigate();
  const [openComboModal, setOpenComboModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [categoryComboId, setCategoryComboId] = useState<number>(0);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  const openNotificationWithIcon = (type: NotificationType, showProgress: boolean, pauseOnHover: boolean, message?: string, description?: string) => {
    api[type]({
      message: message || 'Notification Title',
      description: description ||
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover: pauseOnHover,
    });
  };

  const findComboCategoryById = useMemo(() => {
    return _(categoryCombo.data?.data)
      .find(it => it.categoryCompoId == categoryComboId);
  }, [categoryComboId, categoryCombo.data?.data]);

  const showComboModal = () => {
    setOpenComboModal(true);
  };

  const handleCancel = () => {
    setOpenComboModal(false);
    setOpenDeleteModal(false);
    setOpenCreateModal(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setCategory(value);
  };

  const onComboFinish = async (values: UpdateCategoryComboRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateCategoryCombo(profile.data?.user?.token || '', categoryComboId, values);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Update category combo successfully!');
        setIsLoading(false);
        setOpenComboModal(false);
        queryClient.invalidateQueries({
          queryKey: ['categoriesCombo']
        })
      }
    } catch (error: any) {
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOk = async () => {
    setConfirmLoading(true);
    try {
      if (category == "combo") {
        let response = await deleteCategoryComboById(profile.data?.user?.token || '', [Number(categoryComboId)]);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categoriesCombo']
          })
          setConfirmLoading(false);
          setOpenDeleteModal(false);
        }
      }
    } catch (error: any) {
      setConfirmLoading(false);
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
    } finally {
      setConfirmLoading(false);
    }
  }

  const handleCreate = async (data: CreateCategoryRQ) => {
    setConfirmLoading(true);
    try {
      if (category == "combo") {
        let response = await createNewCategoryCombo(profile.data?.user?.token || '', data);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categoriesCombo']
          })
          openNotificationWithIcon('success', true, true, 'Success', 'Create new category combo successfully!');
        }
      }
      setConfirmLoading(false);
      setOpenCreateModal(false);
    } catch (error: any) {
      setConfirmLoading(false);
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
    } finally {
      setConfirmLoading(false);
    }
  }

  useEffect(() => {
    if (openComboModal) {
      form.setFieldsValue(findComboCategoryById);
    }
  }, [openComboModal, findComboCategoryById, form]);

  const categoryComboColumns: TableProps<CategoryCompos>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'categoryCompoId',
      key: 'categoryCompoId',
    },
    {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      ellipsis: {
        showTitle: false,
      },
      render: (labName: string) => (
        <Tooltip placement="topLeft" title={labName}>
          {labName}
        </Tooltip>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
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
      title: 'Actions',
      key: 'actions',
      render: (record: CategoryCompos) => (
        <div className="flex items-center gap-2">
          <a className="text-blue-500"
            onClick={() => {
              setCategoryComboId(record.categoryCompoId);
              showComboModal();
              setModalText(`Edit ${record.categoryName}`);
            }}
          >
            Edit
          </a>
          <a className="text-blue-500"
            onClick={() => {
              setOpenDeleteModal(true);
              setCategoryComboId(record.categoryCompoId);
              setModalText(`Delete ${record.categoryName}?`);
            }}
          >
            Delete
          </a>
        </div>
      ),
    },
  ]

  const categoryBlogColumns: TableProps<BlogCategory>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      ellipsis: {
        showTitle: false,
      },
      render: (labName: string) => (
        <Tooltip placement="topLeft" title={labName}>
          {labName}
        </Tooltip>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={format(text, "HH:mm:ss dd/MM/yyyy")}>
          {format(text, "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
  ]

  const categoryLabColumns: TableProps<CategoryLab>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'categoryLabId',
      key: 'categoryLabId',
    },
    {
      title: 'Name',
      dataIndex: 'categoryLabName',
      key: 'categoryLabName',
      ellipsis: {
        showTitle: false,
      },
      render: (labName: string) => (
        <Tooltip placement="topLeft" title={labName}>
          {labName}
        </Tooltip>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: {
        showTitle: false,
      },
      render: (text?: string) => (
        <Tooltip placement="topLeft" title={format(text || new Date(), "HH:mm:ss dd/MM/yyyy")}>
          {format(text || new Date(), "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      ellipsis: {
        showTitle: false,
      },
      render: (text?: string) => (
        <Tooltip placement="topLeft" title={format(text || new Date(), "HH:mm:ss dd/MM/yyyy")}>
          {format(text || new Date(), "HH:mm:ss dd/MM/yyyy")}
        </Tooltip>
      ),
    },
  ]

  let columns: any = [];

  const datasource = useMemo(() => {
    let datasource: any[] = [];
    switch (category) {
      case "combo":
        datasource = _(categoryCombo.data?.data)
          .orderBy(it => it.updatedAt, "desc")
          .value();
        columns = categoryComboColumns;
        break;
      case "blog":
        datasource = _(categoryBlog.data?.data)
          .orderBy(it => it.updatedAt, "desc")
          .value();
        columns = categoryBlogColumns;
        break;
      case "lab":
        datasource = _(categoryLab.data?.data)
          .orderBy(it => it.updatedAt, "desc")
          .value();
        columns = categoryLabColumns;
        break;
      default:
        break;
    }
    return datasource;
  }, [categoryBlog.data?.data, categoryLab.data?.data, categoryLab.data?.data, category, columns]);


  // const columns: TableProps<Blog>['columns'] = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'blogId',
  //     key: 'blogId',
  //   },
  //   {
  //     title: 'Name',
  //     dataIndex: 'title',
  //     key: 'title',
  //     ellipsis: {
  //       showTitle: false,
  //     },
  //     render: (labName: string) => (
  //       <Tooltip placement="topLeft" title={labName}>
  //         {labName}
  //       </Tooltip>
  //     )
  //   },
  //   {
  //     title: 'Content',
  //     dataIndex: 'content',
  //     key: 'content',
  //     ellipsis: {
  //       showTitle: false,
  //     },
  //     render: (labDescription: string) => (
  //       <Tooltip placement="topLeft" title={labDescription}>
  //         {labDescription}
  //       </Tooltip>
  //     )
  //   },
  //   {
  //     title: 'Image',
  //     dataIndex: 'image',
  //     key: 'image',
  //     render: (text: string) => {
  //       const imageUrl = text.startsWith('/images') ? `${BASE_URL}${text}` : text;
  //       return (
  //         <Image src={imageUrl} width={50}
  //           fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
  //         />
  //       )
  //     },
  //   },
  //   {
  //     title: 'Created At',
  //     dataIndex: 'createdAt',
  //     key: 'createdAt',
  //     ellipsis: {
  //       showTitle: false,
  //     },
  //     render: (text: string) => (
  //       <Tooltip placement="topLeft" title={format(text, "HH:mm:ss dd/MM/yyyy")}>
  //         {format(text, "HH:mm:ss dd/MM/yyyy")}
  //       </Tooltip>
  //     ),
  //   },
  //   {
  //     title: 'Updated At',
  //     dataIndex: 'updatedAt',
  //     key: 'updatedAt',
  //     ellipsis: {
  //       showTitle: false,
  //     },
  //     render: (text: string) => (
  //       <Tooltip placement="topLeft" title={format(text, "HH:mm:ss dd/MM/yyyy")}>
  //         {format(text, "HH:mm:ss dd/MM/yyyy")}
  //       </Tooltip>
  //     ),
  //   },
  //   {
  //     title: 'Category Name',
  //     dataIndex: 'categoryId',
  //     key: 'categoryId',
  //     render: (id: number) => mapCategoryBlog[id]?.categoryName,
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (status: string) => {
  //       return (
  //         <Tag color={status.toLowerCase() == "active" ? "green" : "red"}>
  //           {status}
  //         </Tag>
  //       )
  //     },
  //   },
  //   {
  //     title: 'Actions',
  //     key: 'actions',
  //     render: (record: Blog) => (
  //       <IoEye
  //         style={{ cursor: 'pointer' }}
  //         onClick={() => navigate(`/admin/blog/${record.blogId}`)}
  //       />
  //     ),
  //   },
  // ];

  return (
    <div>
      {contextHolder}
      <div className="flex items-center gap-2">
        <Button onClick={() => setOpenCreateModal(true)} type="default" style={{ marginBottom: 16 }}>
          Add category
        </Button>
        <Select
          defaultValue="combo"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'combo', label: 'Combo' },
            { value: 'blog', label: 'Blog' },
            { value: 'lab', label: 'Lab' },
          ]}
        />
      </div>
      <Table columns={columns} dataSource={datasource}>
      </Table>
      {/* Edit combo category */}
      <Modal
        title="Edit Combo"
        open={openComboModal}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="default"
      >
        <p>{modalText}</p>
        <Form
          form={form}
          name="edit_category_combo"
          initialValues={{ ...findComboCategoryById }}
          onFinish={onComboFinish}
          layout="vertical"
        >
          <Form.Item label="Category Name" name="categoryName" rules={[{ required: true, message: 'Please input!' }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} block type="primary" htmlType="submit" className="bg-blue-500">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Create category */}
      <Modal
        title={`Create ${category} category`}
        open={openCreateModal}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="default"
      >
        {/* <p>{modalText}</p> */}
        <Form
          name="create_category"
          onFinish={handleCreate}
          layout="vertical"
        >
          <Form.Item label="Category Name" name="categoryName" rules={[{ required: true, message: 'Please input!' }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} block type="primary" htmlType="submit" className="bg-blue-500">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete category */}
      <Modal
        title={`Delete ${category} category`}
        open={openDeleteModal}
        onOk={handleDeleteOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="text"
        okText="Yes"
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  )
}