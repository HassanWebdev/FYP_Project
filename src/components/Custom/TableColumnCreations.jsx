import React, {useState, useEffect} from "react";
import {Button, Form, Input, Modal, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";

export default function TableColumnCreation({
  open,
  setOpen,
  handleEvent,
  loading,
  setLoading,
  setAddHeader,
  rowsData,
  columnsData,
  setSubModal,
  setRow,
  setColumnsData,
  id,
  setAction
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState({
    headers: [
      {
        key: "header1",
        label: "Header 1",
        type: "text",
      },
    ],
  });
  const [count, setCount] = useState(2);
  const [values, setValues] = useState({
    headers: [
      {
        header1: "",
      },
    ],
  });

  const action = {
    title: "Action",
    dataIndex: "operation",
    render: (_, record) => (
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
      >
        Edit
      </Button>
    ),
  };

  const handleEdit = (record) => {
    setSubModal(true);
    setRow(record);
  };

  const handleOk = () => {
    setLoading(true);
    setAddHeader(true);
    setOpen(false);
    const filteredRows = values.headers.filter((row) =>
      Object.values(row).some((value) => value !== "")
    );
    const filteredDataRows = data.headers.filter((row, index) =>
      Object.values(values.headers[index]).some((value) => value !== "")
    );
    const filteredValues = {
      ...values,
      headers: filteredRows,
      action,
    };
    const { key, ...rest } = filteredValues;
    setData((prevState) => ({
      ...prevState,
      headers: filteredDataRows,
    }));
    handleEvent(rest);
    form.resetFields();
    setValues({
      headers: [
        {
          header1: "",
        },
      ],
    });
    setLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  useEffect(() => {
    setAction(action);
  },[])
  
  useEffect(() => {
    if (columnsData.length) {
      const newValuesHeaders = [];
      const newDataHeaders = [];

      columnsData.forEach((r, index) => {
        form.setFieldsValue({
          [`header${index + 1}`]: r.title,
        });

        const newValueHeader = {
          [`header${index + 1}`]: r.title,
          colKey: r.colKey,
          colValue: r.title,
          oldColValue: r.title,
        };

        const newDataHeader = {
          key: `header${index + 1}`,
          label: r.title,
          type: "text",
        };

        newValuesHeaders.push(newValueHeader);
        newDataHeaders.push(newDataHeader);
      });

      setValues((prevState) => ({
        ...prevState,
        headers: newValuesHeaders,
      }));

      setData((prevState) => ({
        ...prevState,
        headers: newDataHeaders,
      }));

      setCount(columnsData.length + 1);
    }
  }, [columnsData, form,rowsData]);

  const handleInputChange = (type, index, key, value) => {
    if (type === "headers") {
      setValues((prevState) => {
        const newHeaders = [...prevState.headers];
        if (newHeaders[index] && newHeaders[index][key] !== undefined) {
          newHeaders[index][key] = value;
          newHeaders[index]["colValue"] = value;
        } else {
          if (!newHeaders[index]) {
            newHeaders[index] = {};
          }
          newHeaders[index][key] = value;
          newHeaders[index]["colValue"] = value;
        }
        return {...prevState, headers: newHeaders};
      });
    }
  };

  const handleAdd = () => {
    const newData = {
      key: `header${count}`,
      type: "text",
      label: `Header ${count}`,
      validation: {required: false},
    };
    setData((prevState) => ({
      ...prevState,
      headers: [...prevState.headers, newData],
    }));
    setValues((prevState) => ({
      ...prevState,
      headers: [...prevState.headers, {[`header${count}`]: ""}],
    }));
    setCount(count + 1);
  };

  return (
    <>
      <Modal
        open={open}
        title={`${!columnsData.length ? "Add" : "Edit"} Headers For Table`}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} className="font-worksans">
            Cancel
          </Button>,
          <Button
            type="primary"
            key="submit"
            onClick={handleOk}
            loading={loading}
            className="font-worksans bg-[#3A00E5] hover:!bg-[#3A00E5] text-white hover:!text-white cursor-pointer"
          >
            {!columnsData.length ? "Submit" : "Update"}
          </Button>,
        ]}
      >
        <Form form={form} className="!px-5 !py-9 " layout="horizontal">
          {data.headers.map((r, index) => (
            <Form.Item
              key={r.key}
              name={r.key}
              className="!mb-6"
              rules={[
                {
                  required: false,
                  message: `Please enter your value`,
                },
              ]}
            >
              <Input
                className="p-2 placeholder:!text-zinc-300"
                placeholder={`Write something...`}
                value={values.headers[r.key] || ""}
                onChange={(e) =>
                  handleInputChange("headers", index, r.key, e.target.value)
                }
              />
            </Form.Item>
          ))}
          <div className="flex flex-col justify-center items-center">
            <Button
              onClick={handleAdd}
              type="primary"
              style={{
                marginLeft: 16,
                marginBottom: 16,
              }}
              className="w-1/4"
            >
              Add a Column
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
