import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
  FileText,
  BookOpen,
  RotateCcw,
  FolderOpen,
  ChevronDown,
  Play,
  CheckCircle,
  TestTube,
  Download,
  Settings,
  Database,
  BarChart3,
  LineChart,
  Layers
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('EDA');
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [guidesMenuOpen, setGuidesMenuOpen] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [numClasses, setNumClasses] = useState('');
  const [datasetPath, setDatasetPath] = useState('');
  const [selectedModel, setSelectedModel] = useState('Select Model');
  const [outputLogs, setOutputLogs] = useState('Ready to start training...\n');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileMenuItems = [
    { name: 'Count Object', icon: Database },
    { name: 'Data Splitter', icon: Layers },
    { name: 'Color Changer', icon: BarChart3 },
  ];

  const guidesMenuItems = [
    { name: 'Nano', description: 'Quick start guide for small datasets' },
    { name: 'Large', description: 'Comprehensive guide for large-scale training' },
    { name: 'Small', description: 'Optimized workflows for small models' },
  ];

  const modelOptions = [
    'YOLOv8n',
    'YOLOv8s',
    'YOLOv8m',
    'YOLOv8l',
    'YOLOv8x',
    'YOLOv9',
    'YOLOv10',
    'Custom Model'
  ];

  const tabs = [
    { id: 'EDA', name: 'EDA', icon: BarChart3 },
    { id: 'Visualization', name: 'Visualization', icon: LineChart },
    { id: 'SDS', name: 'SDS', icon: Database },
  ];

 const handleAction = async (action: string) => {
  const timestamp = new Date().toLocaleTimeString();
  setOutputLogs((prev) => prev + `[${timestamp}] ${action} initiated...\n`);

  const payload = {
    dataset_path: datasetPath,
    num_classes: parseInt(numClasses),
    model: selectedModel
  };

  try {
    const endpointMap: { [key: string]: string } = {
      'YAML': 'http://localhost:5000/generate_yaml/',
      'Training': 'http://localhost:5000/train/',
      'Validation': 'http://localhost:5000/val/',
      'Testing': 'http://localhost:5000/test/',
      'Export': 'http://localhost:5000/export/'
    };

    const endpoint = endpointMap[action];
    if (!endpoint) {
      throw new Error('Unknown action');
    }

    const response = await axios.post(endpoint, payload);
    setOutputLogs((prev) => prev + `[${timestamp}] ✅ ${action} completed: ${response.data.message}\n`);
  } catch (err: any) {
    setOutputLogs((prev) => prev + `[${timestamp}] ❌ ${action} failed: ${err.message}\n`);
  }
};

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const timestamp = new Date().toLocaleTimeString();
      setOutputLogs(prev => prev + `[${timestamp}] ✅ File uploaded: ${res.data.filename}\n`);
      setDatasetPath(res.data.path);
    } catch (err: any) {
      const timestamp = new Date().toLocaleTimeString();
      setOutputLogs(prev => prev + `[${timestamp}] ❌ Upload failed: ${err.message}\n`);
    }
  };

  const handleRefresh = () => {
    setOutputLogs('Ready to start training...\n');
    setDatasetPath('');
    setNumClasses('');
    setSelectedModel('Select Model');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Menu Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-6">
            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => setFileMenuOpen(!fileMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">File</span>
              </button>
              {fileMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {fileMenuItems.map(item => (
                    <button
                      key={item.name}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => setFileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guides Menu */}
            <div className="relative">
              <button
                onClick={() => setGuidesMenuOpen(!guidesMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Guides</span>
              </button>
              {guidesMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {guidesMenuItems.map(item => (
                    <div
                      key={item.name}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                      onClick={() => setGuidesMenuOpen(false)}
                    >
                      <div className="font-medium text-blue-600">{item.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh Interface"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Dataset Configuration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Configuration</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset Path:
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={datasetPath}
                    onChange={e => setDatasetPath(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter dataset path..."
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Browse</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".zip,.yaml"
                  />
                </div>
              </div>
            </div>

            {/* Model Configuration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Configuration</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Classes:
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="number"
                      value={numClasses}
                      onChange={e => setNumClasses(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter number of classes..."
                    />
                    <button
                      onClick={() => handleAction('YAML')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
                    >
                      YAML
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model Selection:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setModelMenuOpen(!modelMenuOpen)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors flex items-center justify-between"
                    >
                      <span className={selectedModel === 'Select Model' ? 'text-gray-400' : 'text-gray-900'}>
                        {selectedModel}
                      </span>
                      <ChevronDown className="w-4 h-4 text-yellow-500" />
                    </button>
                    {modelMenuOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                        {modelOptions.map(model => (
                          <button
                            key={model}
                            onClick={() => {
                              setSelectedModel(model);
                              setModelMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction('Training')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm border border-green-700"
                >
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Train</span>
                </button>
                <button
                  onClick={() => handleAction('Validation')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm border border-blue-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Val</span>
                </button>
                <button
                  onClick={() => handleAction('Testing')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
                >
                  <TestTube className="w-4 h-4" />
                  <span className="font-medium">Test</span>
                </button>
                <button
                  onClick={() => handleAction('Export')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm border border-orange-700"
                >
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Export</span>
                </button>
              </div>
            </div>

            {/* Hyperparameter Tuning */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
              <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg border border-blue-700 flex items-center justify-center space-x-2">
                <Settings className="w-5 h-5" />
                <span className="font-medium text-lg">Hyperparameter Tuning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>Output</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </h3>
          </div>
          <div className="flex-1 p-6">
            <div className="bg-gray-900 rounded-lg p-4 h-full overflow-y-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {outputLogs}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
