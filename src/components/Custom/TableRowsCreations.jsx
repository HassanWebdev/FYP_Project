import React, {useState, useEffect} from "react";
import {Button, Form, Input, Modal, Typography} from "antd";
const {Title} = Typography;

export default function TableRowsCreation({
  open,
  setOpen,
  handleEvent,
  loading,
  setLoading,
  columnsData,
  row,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [values, setValues] = useState({});

  const handleOk = () => {
    setLoading(true);
    setOpen(false);
    
    
    
    
    
    

    if (row) {
      if (row.key == undefined) {
        const rowData = {
          ...values,
        };
        handleEvent(rowData);
      } else {
        const rowData = {
          ...values,
          key: row.key,
        };
        handleEvent(rowData);
      }
    } else {
      handleEvent(values);
    }
    form.resetFields();
    setValues({});
    setLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (columnsData?.length) {
      const initialValues = columnsData.reduce((acc, col) => {
        acc[col.dataIndex] = row?.[col.dataIndex] || "";
        acc["colKey"] = col.colKey || "";
        return acc;
      }, {});
      setData(columnsData);
      setValues(initialValues);
      form.setFieldsValue(initialValues);
    }
  }, [columnsData, form, row]);

  const handleInputChange = (key, value) => {
    setValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <Modal
      open={open}
      title={`${row ? "Edit" : "Add"} Rows For Headers`}
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
          {!row ? "Submit" : "Update"}
        </Button>,
      ]}
    >
      <Form form={form} className="!px-5 !py-9" layout="horizontal">
        {data.map((col) => (
          <Form.Item
            key={col.dataIndex}
            name={col.dataIndex}
            label={col.title}
            className="!mb-6"
            rules={[
              {
                required: false,
                message: `Please enter your value for ${col.title}`,
              },
            ]}
          >
            <Input
              className="p-2 placeholder:!text-zinc-300"
              placeholder={`Write something...`}
              value={values[col.dataIndex] || ""}
              onChange={(e) => handleInputChange(col.dataIndex, e.target.value)}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
