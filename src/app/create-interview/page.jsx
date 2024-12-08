"use client";
import { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from '../../lib/axioshttp';
import EditableTable from '../../components/Custom/EditableTable';
import Navbar from '../../components/Custom/Navbar';

const { Title } = Typography;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import withAuth from '@/components/Custom/withauth';

const CreateInterview = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addHeader, setAddHeader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [showExhibit, setShowExhibit] = useState(false);
  const router = useRouter();

  const defaultScenario = `
<h2>Case Interview Overview</h2>
<p><strong>Case Prompts:</strong> [Add Text Here]</p>
<p><strong>Industry:</strong> [Add Text Here]</p>
<p><strong>Case Type:</strong> [Add Text Here]</p>
<p><strong>Concepts tested:</strong></p>
<ul>
  <li>[Add List Here]</li>
</ul>
<p><strong>Difficulty Level:</strong> [Add Text Here]</p>
<p><strong>Overview Information for Interviewer:</strong> [Add Text Here]</p>
<p><strong>Clarifying Information:</strong> [Add Text Here]</p>
<p><strong>Interviewer Guide:</strong></p>
<ul>
  <li>[Add List Here]</li>
</ul>
<p><strong>Notes to Interviewer:</strong> [Add Text Here]</p>
<p><strong>Recommendation:</strong> [Add Text Here]</p>
<p><strong>Risks:</strong></p>
<ul>
  <li>[Add List Here]</li>
</ul>
<p><strong>Next Steps:</strong> [Add Text Here]</p>
<p><strong>Bonus:</strong> [Add Text Here]</p>
`;

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align'
  ];

  const handleAddExhibit = () => {
    setShowExhibit(true);
    setAddHeader(true);
    form.validateFields(['exhibit_title']).catch(() => {
      message.error('Please enter exhibit title before adding data');
    });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        message.error('Please login first');
        router.push('/login');
        return;
      }

      if (showExhibit && !values.exhibit_title) {
        message.error('Please enter exhibit title');
        return;
      }

      const updatedTableData = tableData.map(({ colKey, key, ...rest }) => rest);
      console.log(updatedTableData);
      console.log(values.exhibit_title);

      const response = await axios.post('/MockInterviewcreation',
        {
          title: values.title,
          scenario: values.scenario,
          type: 'Mock',
          result: [],
          exhibit: updatedTableData,
          exhibit_title: values.exhibit_title || ''
        },
      );
      console.log(response);
      if (response.status === 201) {
        message.success({
          content: 'Interview created successfully!',
          className: 'custom-message-success',
        });
        form.resetFields();
        setShowExhibit(false);
        setAddHeader(false);
        router.push('/Interviews/ViewCustom/' + response?.data?.mockCase_id + '/admin');
      }
    } catch (error) {
      console.log(error);
      message.error({
        content: error.response?.data?.error || 'Failed to create interview',
        className: 'custom-message-error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar background={'!bg-[#0F172A] !text-white'} />
      <div className="min-h-screen !bg-[#0F172A] !p-8">
        <div className="max-w-4xl mx-auto">
          <Title level={2} className="text-center mb-8 !text-white">
            Create New Interview
          </Title>

          <Card
            className="!bg-slate-800 !border-slate-700 relative group overflow-hidden"
            bodyStyle={{ padding: '2rem' }}
          >
            <div className="absolute inset-0 !bg-gradient-to-r !from-blue-500 !to-purple-500 !opacity-0 group-hover:!opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-[2px] !bg-slate-800 rounded-lg z-10"></div>
            <div className="relative z-20">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
                initialValues={{
                  scenario: defaultScenario
                }}
              >
                <Form.Item
                  label={<span className="text-lg font-semibold !text-white">Title</span>}
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the interview title!',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter interview title"
                    className="rounded-md h-10 text-base !bg-slate-700 !border-slate-600 !text-white placeholder:!text-slate-400"
                    style={{
                      transition: 'all 0.3s',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-lg font-semibold !text-white">Scenario</span>}
                  name="scenario"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the interview scenario!',
                    },
                  ]}
                >
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    className="!bg-slate-700 rounded-md !text-white"
                    style={{ height: '400px' }}
                  />
                </Form.Item>

                <Button
                  onClick={handleAddExhibit}
                  type="default"
                  className="!mt-16 !bg-blue-600 hover:!bg-blue-700 !text-white !border-0"
                  icon={<span className="mr-2">+</span>}
                >
                  Add Exhibit
                </Button>

                {showExhibit && (
                  <>
                    <Form.Item
                      label={<span className="text-lg font-semibold !text-white !mt-8">Title of Exhibit</span>}
                      name="exhibit_title"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter exhibit title!',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter exhibit title"
                        className="rounded-md h-10 text-base !bg-slate-700 !border-slate-600 !text-white placeholder:!text-slate-400 hover:!border-blue-500 focus:!border-blue-500"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-lg font-semibold !text-white">Exhibit Data</span>}
                      name="exhibit"
                    >
                      <EditableTable
                        setTableData={setTableData}
                        tableData={tableData}
                        addHeader={addHeader}
                        setAddHeader={setAddHeader}
                      />
                    </Form.Item>
                  </>
                )}

                <Form.Item className="!mt-8">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full !mt-5 h-12 text-lg font-semibold rounded-md !bg-gradient-to-r !from-blue-500 !to-blue-600 hover:!from-blue-600 hover:!to-blue-700 !border-0 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Interview
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>

        <style jsx global>{`
        .custom-message-success {
          background-color: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.2) !important;
          border-radius: 4px !important;
          color: #10B981 !important;
        }
        
        .custom-message-error {
          background-color: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          border-radius: 4px !important;
          color: #EF4444 !important;
        }
        
        .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #94A3B8 !important;
        }
        
        .ant-input {
          background: #1e293b !important;
          border-color: #475569 !important;
          color: white !important;
        }
        
        .ant-input:hover, .ant-input:focus {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-1px) !important;
        }

        .ql-toolbar {
          background-color: #1e293b !important;
          border-color: #475569 !important;
        }

        .ql-container {
          background-color: #1e293b !important;
          border-color: #475569 !important;
          color: white !important;
          font-size: 16px !important;
        }

        .ql-editor {
          min-height: 300px !important;
        }

        .ql-snow .ql-stroke {
          stroke: #94A3B8 !important;
        }

        .ql-snow .ql-fill {
          fill: #94A3B8 !important;
        }

        .ql-picker {
          color: #94A3B8 !important;
        }

        .ql-picker-options {
          background-color: #1e293b !important;
          border-color: #475569 !important;
        }

        /* Exhibit Table Styling */
        .ant-table {
          background: #1e293b !important;
          color: white !important;
        }

        .ant-table-thead > tr > th {
          background: #334155 !important;
          color: white !important;
          border-bottom: 1px solid #475569 !important;
        }

        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #475569 !important;
          color: white !important;
        }

        .ant-table-tbody > tr:hover > td {
          background: #334155 !important;
        }

        .ant-table-cell-row-hover {
          background: #334155 !important;
        }

        /* Exhibit Add Button Styling */
        .ant-btn-default {
          background: #334155 !important;
          border-color: #475569 !important;
          color: white !important;
        }

        .ant-btn-default:hover {
          background: #475569 !important;
          border-color: #3B82F6 !important;
          color: white !important;
        }

        .ant-modal-content,
        .ant-modal-header {
          background: #1e293b !important;
          color: white !important;
        }

        .ant-modal-title {
          color: white !important;
        }

        .ant-modal-close {
          color: #94A3B8 !important;
        }

        .ant-modal-footer .ant-btn {
          background: #334155 !important;
          border-color: #475569 !important;
          color: white !important;
        }

        .ant-modal-footer .ant-btn-primary {
          background: linear-gradient(to right, #3B82F6, #2563EB) !important;
          border: none !important;
        }
      `}</style>
      </div>
    </>
  );
};

export default withAuth(CreateInterview);
