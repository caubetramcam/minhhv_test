import React, { startTransition, useEffect, useReducer, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Space,
  message,
  Upload,
  notification,
} from "antd";
import baseAPI from "../helper/base.api";
import { getErrorMessage } from "../helper/helper";
import { useDebounce } from "react-use";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const ItemList = () => {
  const [data, setData] = useState({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      size: 1,
      pageCount: 1,
    },
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [query, setQuery] = useState({
    keyword: "",
    page: 1,
    size: 25,
    sort: "",
  });
  const [fileList, setFileList] = useState([]);
  const [textSearch, setTextSearch] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchCategories = async () => {
    try {
      const categories = await baseAPI.get("/categories");
      setCategories(categories);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again later.",
        showProgress: true,
      });
    }
  };

  const fetchTypes = async () => {
    try {
      const types = await baseAPI.get("/types");
      setTypes(types);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again later.",
        showProgress: true,
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await baseAPI.get("/items", {
        params: query,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again later.",
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log({ pagination, filters, sorter });
    const { current = 1, pageSize = 1 } = pagination || {};
    const { field = null, order = null } = sorter || {};
    const _query = { ...query };
    _query.page = current;
    _query.size = pageSize;
    if (field && order) {
      const _order = order === "ascend" ? "ASC" : "DESC";
      _query.sort = `${field}:${_order}`;
    } else {
      _query.sort = "";
    }
    setQuery(_query);
  };

  useDebounce(
    () => {
      startTransition(() => {
        setQuery((query) => ({
          ...query,
          page: 1,
          keyword: textSearch.trim(),
        }));
      });
    },
    1000,
    [textSearch]
  );

  const handleSearch = (value) => {
    setTextSearch(value);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const data = {
        ...values,
        images: values?.images?.map((item) => {
          const { response = {} } = item || {};
          return {
            fileName: response?.fileName,
            originalName: response?.originalName,
            path: response?.path,
            mimeType: response?.mimeType,
            ext: response?.ext,
            size: Number(response?.size),
            id: response?.id
          };
        }),
      };
      if (data?.id) {
        await baseAPI.put(`/items/${data.id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await baseAPI.post(`/items`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again later.",
        showProgress: true,
      });
      // console.log(getErrorMessage(error));
    }
  };

  const handleDelete = async (id) => {
    await baseAPI.delete(`/items/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await fetchData();
  };

  const handleEdit = async (record) => {
    try {
      const { id } = record || {};
      let item = await baseAPI.get(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsEdit(true);
      setIsModalOpen(true);
      setFileList(item?.images);
      form.setFieldsValue(item);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again later.",
        showProgress: true,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setIsEdit(false);
    setFileList([]);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, record, index) => {
        return (query?.page - 1) * query?.size + index + 1;
      },
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (_, record, index) => {
        if (_?.length) {
          return _?.map((p) => {
            return (
              <img
                src={p?.path}
                style={{ width: 40, height: 40, margin: "0 5px" }}
              />
            );
          });
        }
      },
    },
    { title: "Name", dataIndex: "name", key: "name", sorter: true },
    { title: "Price", dataIndex: "price", key: "price", sorter: true },
    {
      title: "Type",
      dataIndex: "types",
      key: "types",
      render: (types) => {
        return types ? types.map((itemType) => itemType?.name).join(", ") : "";
      },
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => {
        return categories
          ? categories.map((itemCategory) => itemCategory?.name).join(", ")
          : "";
      },
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    multiple: true,
    maxCount: 5,
    listType: "picture-card",
    action: `${process.env.REACT_APP_API_URL_ROOT}/upload/file`,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: async ({ fileList }) => {
      setFileList(fileList);
      const successfulUploads = fileList.filter(
        (file) => file.status === "done"
      );
      form.setFieldValue('images', fileList)
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <Input
          placeholder="Search by name"
          value={textSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Item
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: query?.page,
          pageSize: query?.size,
          total: data?.pagination?.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          showSizeChanger: true,
        }}
      />

      <Modal
        title={isEdit ? "Update Item" : "Add Item"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="images" label="Images">
            <Upload {...uploadProps} fileList={fileList}>
              {fileList?.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Price must be 0 or greater!")
                  );
                },
              }),
            ]}
            getValueFromEvent={(e) => Number(e.target.value)}
          >
            <Input type="number" min={0} placeholder="Price" />
          </Form.Item>
          <Form.Item label="Type" name="types">
            <Select mode="multiple" placeholder="Type">
              {types?.map((p) => {
                return <Option value={p.id}>{p.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="categories">
            <Select mode="multiple" placeholder="Category">
              {categories?.map((p) => {
                return <Option value={p.id}>{p.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update" : "Add"}
            </Button>
            <Button
              type="default"
              htmlType="button"
              onClick={handleCloseModal}
              style={{ marginLeft: 10 }}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemList;
