import { Button, Space } from "antd";

export const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, record, index) => {
        return (query?.page - 1) * query?.size + index + 1;
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