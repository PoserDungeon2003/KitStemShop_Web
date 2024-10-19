import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Form, Input, MenuProps, Modal, notification, Select, Space, Table, TableProps, Tooltip } from "antd"
import { format } from "date-fns";
import _, { set } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { IoArrowDown } from "react-icons/io5";
import { BlogCategory, CategoryCompos, CategoryLab, CreateCategoryRQ, createNewCategoryBlog, createNewCategoryCombo, createNewCategoryLab, deleteCategoryBlogById, deleteCategoryComboById, deleteCategoryLabById, deleteLabById, NotificationType, updateCategoryBlog, UpdateCategoryBlogRQ, updateCategoryCombo, UpdateCategoryComboRQ, updateCategoryLab, UpdateCategoryLabRQ, useGetAllCategoriesBlog, useGetAllCategoriesCombo, useGetAllCategoriesLab, useGetProfile } from "~/data"

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
  const [openLabModal, setOpenLabModal] = useState(false);
  const [openBlogModal, setOpenBlogModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [categoryComboId, setCategoryComboId] = useState<number>(0);
  const [categoryLabId, setCategoryLabId] = useState<number>(0);
  const [categoryBlogId, setCategoryBlogId] = useState<number>(0);
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

  const findLabCategoryById = useMemo(() => {
    return _(categoryLab.data?.data)
      .find(it => it.categoryLabId == categoryLabId);
  }, [categoryLabId, categoryLab.data?.data]);

  const findBlogCategoryById = useMemo(() => {
    return _(categoryBlog.data?.data)
      .find(it => it.categoryId == categoryBlogId);
  }, [categoryBlogId, categoryBlog.data?.data]);

  const showUpdateModal = () => {
    if (category == "combo") setOpenComboModal(true);
    else if (category == "lab") setOpenLabModal(true);
    else if (category == "blog") setOpenBlogModal(true);
  };

  const handleCancel = () => {
    setOpenComboModal(false);
    setOpenLabModal(false);
    setOpenBlogModal(false);
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

  const onBlogFinish = async (values: UpdateCategoryBlogRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateCategoryBlog(profile.data?.user?.token || '', categoryBlogId, values);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Update category blog successfully!');
        setIsLoading(false);
        setOpenBlogModal(false);
        queryClient.invalidateQueries({
          queryKey: ['categories-blog']
        })
      }
    } catch (error: any) {
      openNotificationWithIcon('error', true, true, 'Error', error?.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onLabFinish = async (values: UpdateCategoryLabRQ) => {
    console.log('Received values of form: ', values);
    setIsLoading(true);
    try {
      let response = await updateCategoryLab(profile.data?.user?.token || '', categoryLabId, values);
      if (response.data) {
        openNotificationWithIcon('success', true, true, 'Success', 'Update category lab successfully!');
        setIsLoading(false);
        setOpenLabModal(false);
        queryClient.invalidateQueries({
          queryKey: ['categories-lab']
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
        let response = await deleteCategoryComboById(profile.data?.user?.token || '', [categoryComboId]);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categoriesCombo']
          })
        }
      }
      else if (category == "blog") {
        let response = await deleteCategoryBlogById(profile.data?.user?.token || '', [categoryBlogId]);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categories-blog']
          })
        }
      }
      else if (category == "lab") {
        let response = await deleteCategoryLabById(profile.data?.user?.token || '', [categoryLabId]);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categories-lab']
          })
        }
      }
      openNotificationWithIcon('success', true, true, 'Success', `Delete category ${category} successfully!`);
      setConfirmLoading(false);
      setOpenDeleteModal(false);
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
        }
      } else if (category == "blog") {
        let response = await createNewCategoryBlog(profile.data?.user?.token || '', data);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categories-blog']
          })
        }
      } else if (category == "lab") {
        let response = await createNewCategoryLab(profile.data?.user?.token || '', data);
        if (response) {
          queryClient.invalidateQueries({
            queryKey: ['categories-lab']
          })
        }
      }
      openNotificationWithIcon('success', true, true, 'Success', `Create new category ${category} successfully!`);
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
    } else if (openBlogModal) {
      form.setFieldsValue(findBlogCategoryById);
    } else if (openLabModal) {
      form.setFieldsValue(findLabCategoryById);
    }
  }, [openComboModal, openLabModal, openBlogModal, form]);

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
              showUpdateModal();
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
    {
      title: 'Actions',
      key: 'actions',
      render: (record: BlogCategory) => (
        <div className="flex items-center gap-2">
          <a className="text-blue-500"
            onClick={() => {
              setCategoryBlogId(record.categoryId);
              showUpdateModal();
              setModalText(`Edit ${record.categoryName}`);
            }}
          >
            Edit
          </a>
          <a className="text-blue-500"
            onClick={() => {
              setOpenDeleteModal(true);
              setCategoryBlogId(record.categoryId);
              setModalText(`Delete ${record.categoryName}?`);
            }}
          >
            Delete
          </a>
        </div>
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
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CategoryLab) => (
        <div className="flex items-center gap-2">
          <a className="text-blue-500"
            onClick={() => {
              setCategoryLabId(record.categoryLabId);
              showUpdateModal();
              setModalText(`Edit ${record.categoryLabName}`);
            }}
          >
            Edit
          </a>
          <a className="text-blue-500"
            onClick={() => {
              setOpenDeleteModal(true);
              setCategoryLabId(record.categoryLabId);
              setModalText(`Delete ${record.categoryLabName}?`);
            }}
          >
            Delete
          </a>
        </div>
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
        title={`Edit ${category}`}
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
      {/* Edit blog category */}
      <Modal
        title={`Edit ${category}`}
        open={openBlogModal}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="default"
      >
        <p>{modalText}</p>
        <Form
          form={form}
          name="edit_category_blog"
          initialValues={{ ...findBlogCategoryById }}
          onFinish={onBlogFinish}
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
      {/* Edit lab category */}
      <Modal
        title={`Edit ${category}`}
        open={openLabModal}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okType="default"
      >
        <p>{modalText}</p>
        <Form
          form={form}
          name="edit_category_lab"
          initialValues={{ ...findLabCategoryById }}
          onFinish={onLabFinish}
          layout="vertical"
        >
          <Form.Item label="Category Name" name="categoryLabName" rules={[{ required: true, message: 'Please input!' }]}>
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