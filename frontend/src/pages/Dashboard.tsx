import React, { useState, useEffect, useCallback } from 'react';
import { documentAPI } from '../services/api';
import { useDocumentStore } from '../services/store';
import FileUpload from '../components/FileUpload';
import AnalysisReport from '../components/AnalysisReport';
import ComparisonView from '../components/ComparisonView';
import toast from 'react-hot-toast';
import { FiTrash2, FiLoader } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [humanizationStyle, setHumanizationStyle] = useState<'formal' | 'simplified' | 'scholarly'>(
    'formal'
  );
  const [showComparison, setShowComparison] = useState(false);

  const { documents, addDocument, removeDocument, setDocuments } = useDocumentStore();

  const loadDocuments = useCallback(async () => {
    try {
      const response = await documentAPI.listDocuments();
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  }, [setDocuments]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    try {
      const response = await documentAPI.upload(file);
      const newDoc = response.data.document;

      addDocument({
        id: newDoc.id,
        originalName: newDoc.originalName,
        status: newDoc.status,
        createdAt: new Date().toISOString(),
        analysis: null,
      });
      setCurrentDocumentId(newDoc.id);
      setOriginalText(newDoc.extractedText || '');

      toast.success('File uploaded successfully');

      // Auto-analyze after upload
      await handleAnalyze(newDoc.id);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          'Failed to upload file. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (docId: string) => {
    setIsAnalyzing(true);

    try {
      const response = await documentAPI.analyze(docId);
      setCurrentAnalysis(response.data.analysis);
      setCurrentDocumentId(docId);
      toast.success('Analysis completed');
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          'Analysis failed. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanize = async () => {
    if (!currentDocumentId) {
      toast.error('No document selected');
      return;
    }

    setIsHumanizing(true);

    try {
      const response = await documentAPI.humanize(currentDocumentId, {
        style: humanizationStyle,
      });

      setCurrentAnalysis((prev: any) => ({
        ...prev,
        ...response.data.result,
        originalText: response.data.result.originalText || originalText,
      }));

      setShowComparison(true);
      toast.success('Humanization completed');
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          'Humanization failed. Please try again.'
      );
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await documentAPI.deleteDocument(docId);
      removeDocument(docId);
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Upload, analyze, and humanize your academic documents
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload & Analyze
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                1. Upload Document
              </h2>
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isUploading}
              />
            </div>

            {/* Analysis Section */}
            {isAnalyzing && (
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  2. Analysis in Progress
                </h2>
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="animate-spin text-primary text-2xl mr-3" />
                  <span className="text-gray-600">Analyzing document for AI content and plagiarism...</span>
                </div>
              </div>
            )}

            {currentAnalysis && !isAnalyzing && (
              <>
                <div className="bg-white p-8 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    2. Analysis Results
                  </h2>
                  <AnalysisReport
                    aiScore={currentAnalysis.aiScore}
                    plagiarismScore={currentAnalysis.plagiarismScore}
                    confidence={currentAnalysis.confidence}
                    wordCount={currentAnalysis.wordCount}
                    flaggedSections={
                      currentAnalysis.flaggedSections || []
                    }
                  />
                </div>

                {/* Humanization Section */}
                <div className="bg-white p-8 rounded-lg shadow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    3. Humanization
                  </h2>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      Select Writing Style:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setHumanizationStyle('formal')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          humanizationStyle === 'formal'
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800">
                          Formal Academic
                        </h4>
                        <p className="text-sm text-gray-600">
                          Professional and structured
                        </p>
                      </div>

                      <div
                        onClick={() => setHumanizationStyle('simplified')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          humanizationStyle === 'simplified'
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800">
                          Simplified
                        </h4>
                        <p className="text-sm text-gray-600">
                          Clear and accessible
                        </p>
                      </div>

                      <div
                        onClick={() => setHumanizationStyle('scholarly')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          humanizationStyle === 'scholarly'
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800">
                          Advanced Scholarly
                        </h4>
                        <p className="text-sm text-gray-600">
                          Expert-level insights
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleHumanize}
                    disabled={isHumanizing}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition flex items-center justify-center space-x-2"
                  >
                    {isHumanizing && (
                      <FiLoader className="animate-spin" />
                    )}
                    <span>
                      {isHumanizing ? 'Humanizing...' : 'Humanize Content'}
                    </span>
                  </button>
                </div>

                {/* Comparison Section */}
                {showComparison && currentAnalysis.humanizedText && (
                  <div className="bg-white p-8 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      4. Comparison
                    </h2>
                    <ComparisonView
                      original={currentAnalysis.originalText || originalText}
                      humanized={currentAnalysis.humanizedText}
                      style={currentAnalysis.rewriteStyle || humanizationStyle}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {documents.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No documents yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        AI Score
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Plagiarism
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {doc.originalName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              doc.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : doc.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {doc.analysis?.aiScore !== undefined
                            ? (doc.analysis.aiScore * 100).toFixed(1) + '%'
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {doc.analysis?.plagiarismScore !== undefined
                            ? (doc.analysis.plagiarismScore * 100).toFixed(1) + '%'
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              handleDeleteDocument(doc.id.toString())
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
