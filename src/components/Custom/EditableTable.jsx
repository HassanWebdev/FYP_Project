import React, { useEffect, useState} from "react";
import {Button, Table} from "antd";
import TableColumnCreation from "./TableColumnCreations";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import TableRowsCreation from "./TableRowsCreations";

export default function EditableTable({
  tableData,
  setTableData,
  addHeader,
  setAddHeader,
  id,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [openRowModal, setOpenRowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [addColumn, setAddColumn] = useState(false);
  const [subModal, setSubModal] = useState(false);
  const [row, setRow] = useState({});
  const [action, setAction] = useState({});

  useEffect(() => {
    if (id) {
      if (tableData) {
        setAddHeader(true);
        const updatedTableData = tableData.map((item, index) => ({
          ...item,
          key: index + 1,
        }));
        setDataSource(updatedTableData);
      }
      if (tableData.length > 0) {
        const keys = Object.keys(tableData[0]);
        const cols = keys.map((key, index) => ({
          title: key,
          dataIndex: key,
          colKey: index + 1,
        }));
        setColumns([...cols, action]);
      }
    }
  }, [tableData.length, id]);

  const handleCreation = (data) => {
    const headers = data.headers;
    if (typeof headers !== "undefined") {
      // to check if the header value is changed
      const updatedHeaders = headers.filter(({colValue, oldColValue}) => {
        return colValue !== oldColValue;
      });
      //in case if header value is removed so update the data source accordingly
      const emptyHeaders = headers.filter(({colValue}) => {
        return colValue === "";
      });
      if (emptyHeaders.length) {
        const updatedDataSource = dataSource.map((s) => {
          emptyHeaders.map((h) => {
            const dValue = h.oldColValue;
            delete s[dValue];
          });
          return s;
        });
        const filteredupdatedDataSource = updatedDataSource.map(
          ({key, ...rest}) => rest
        );
        setTableData([...filteredupdatedDataSource]);
      } else {
        //In case if we edit the header value it will change keys rows accordingly
        const newDataSource = [];
        dataSource.map((source, sourceIndex) => {
          let newSource = {...source};
          updatedHeaders.map((value, index) => {
            const newValue = newSource[value.oldColValue];
            delete newSource[value.oldColValue];
            newSource[value.colValue] = newValue;
          });
          newDataSource.push(newSource);
        });
        setDataSource([...newDataSource]);
        const filterednewDataSource = newDataSource.map(
          ({key, ...rest}) => rest
        );
        setTableData([...filterednewDataSource]);
      }
    }

    if (data.headers) {
      setAction(data.action);
      // when we add a new header
      const newHeaders = data.headers
        .filter((h) => h.colValue !== "")
        .map((h, index) => ({
          colKey: !h.colKey ? index + 1 : h.colKey,
          title: h[`header${!h.colKey ? index + 1 : h.colKey}`],
          dataIndex: h[`header${!h.colKey ? index + 1 : h.colKey}`],
          editable: true,
        }));
      // to check if the action column exist or not
      if (!newHeaders.length) {
        setColumns([]);
        setAddHeader(false);
      } else {
        const actionExists = columns.some((r) => r.dataIndex === "operation");
        if (!actionExists) {
          setColumns([...newHeaders, action]);
        } else {
          setColumns([...newHeaders, action]);
        }
      }
    } else {
      // if we do creation in row modal
      const checkValues = (data) => {
        return !Object.entries(data).every(([key, value]) => {
          if (key !== "colKey" && key !== "key") {
            return value === "";
          }
          return true;
        });
      };
      const result = checkValues(data);
      if (result === true) {
        const actionExists = columns.some((r) => r.dataIndex === "operation");
        if (!actionExists) {
          const updatedColumns = [...columns, action];
          setColumns(updatedColumns);
        }
        const rowsData = Array.isArray(data) ? data : [data];
        rowsData.forEach((row) => {
          const { colKey, key, ...rowWithoutKeys } = row;
          const newRow = {
            ...rowWithoutKeys,
            colKey: colKey ? colKey : dataSource.length + 1,
            key: dataSource.length + 1
          };
          setDataSource((prevState) => [...prevState, newRow]);
          setTableData((prevState) => [...prevState, rowWithoutKeys]);

        });
      }
    }
  };


  const handleUpdate = (data) => {
    // checking that coming  object has all values empty or  not & update data accordingly
    const checkValues = (data) => {
      return !Object.entries(data).every(([key, value]) => {
        if (key !== "colKey" && key !== "key") {
          return value === "";
        }
        return true;
      });
    };
    const result = checkValues(data);
    const updatedDataSource = dataSource
      .map((obj) => {
        if (obj.key === data.key) {
          if (result === true) {
            return data;
          } else {
            return null;
          }
        }
        return obj;
      })
      .filter((obj) => obj !== null);

    const filteredData = updatedDataSource.map(
      ({key, colKey, ...rest}) => rest
    );
    const actionExists = columns.some((r) => r.dataIndex === "operation");
    if (!actionExists) {
      const updatedColumns = [...columns, action];
      setColumns(updatedColumns);
    }
    setDataSource(updatedDataSource);
    const cleanOne = filteredData.map((f) => {
      const cleanedRow = {};
      for (const key in f) {
        if (key && f[key] !== null && f[key] !== undefined && f[key] !== "") {
          cleanedRow[key] = f[key];
        }
      }
      return cleanedRow;
    });
    setTableData(cleanOne);
  };

  return (
    <div>
      {!addHeader && (
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          type="primary"
          style={{
            marginLeft: 16,
            marginBottom: 16,
            background: 'linear-gradient(to right, #3B82F6, #2563EB) !important',
            border: 'none !important',
            color: 'white !important'
          }}
          icon={<PlusOutlined />}
        >
          Add a Header
        </Button>
      )}
      {addHeader && (
        <>
          <Button
            onClick={() => setOpenModal(true)}
            type="primary" 
            style={{
              marginLeft: 16,
              marginBottom: 16,
              background: 'linear-gradient(to right, #3B82F6, #2563EB) !important',
              border: 'none !important',
              color: 'white !important'
            }}
            icon={<EditOutlined />}
          >
            Edit Header
          </Button>
          <Button
            onClick={() => {
              setOpenRowModal(true);
            }}
            type="primary"
            style={{
              marginLeft: 16,
              marginBottom: 16,
              background: 'linear-gradient(to right, #3B82F6, #2563EB) !important', 
              border: 'none !important',
              color: 'white !important'
            }}
            icon={<PlusOutlined />}
          >
            Add a row
          </Button>
          <Table
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            style={{
              background: '#1e293b !important',
              color: 'white !important'
            }}
            className="dashboard-table"
          />
        </>
      )}
      <TableRowsCreation
        open={openRowModal}
        setOpen={setOpenRowModal}
        handleEvent={handleCreation}
        loading={rowLoading}
        setLoading={setRowLoading}
        rowsData={dataSource}
        columnsData={columns.filter((col) => col.dataIndex !== "operation")}
        setAddColumn={setAddColumn}
        addColumn={addColumn}
      />
      <TableColumnCreation
        open={openModal}
        setOpen={setOpenModal}
        setAddHeader={setAddHeader}
        handleEvent={handleCreation}
        setAction={setAction}
        loading={loading}
        id={id}
        setLoading={setLoading}
        rowsData={dataSource}
        setRow={setRow}
        setSubModal={setSubModal}
        columnsData={columns.filter((col) => col.dataIndex !== "operation")}
        setAddColumn={setAddColumn}
        setColumnsData={setColumns}
        addColumn={addColumn}
      />
      <TableRowsCreation
        open={subModal}
        setOpen={setSubModal}
        handleEvent={handleUpdate}
        loading={rowLoading}
        setLoading={setRowLoading}
        columnsData={columns.filter((col) => col.dataIndex !== "operation")}
        row={row}
        dataSource={dataSource}
      />
      <style jsx global>{`
        .dashboard-table .ant-table {
          background: #1e293b !important;
          color: white !important;
        }
        .dashboard-table .ant-table-thead > tr > th {
          background: #334155 !important;
          color: white !important;
          border-bottom: 1px solid #475569 !important;
        }
        .dashboard-table .ant-table-tbody > tr > td {
          background: #1e293b !important;
          color: white !important;
          border-bottom: 1px solid #475569 !important;
        }
        .dashboard-table .ant-table-tbody > tr:hover > td {
          background: #334155 !important;
        }
        .dashboard-table .ant-table-cell-row-hover {
          background: #334155 !important;
        }
      `}</style>
    </div>
  );
}
