import React, { useEffect, useState } from 'react';
import FeedbackEditor from '../components/FeedbackEditor';
import { documentAPI } from '../services/api';

interface Doc {
  id: string;
  originalName: string;
}

const TeacherFeedback: React.FC = () => {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      const response = await documentAPI.listDocuments();
      setDocuments(response.data.documents || []);
    };
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teacher: Feedback & Grading</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select document
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedDocumentId || ''}
            onChange={(e) => setSelectedDocumentId(e.target.value || null)}
          >
            <option value="">Choose document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.originalName}
              </option>
            ))}
          </select>
        </div>
        <FeedbackEditor documentId={selectedDocumentId} />
      </div>
    </div>
  );
};

export default TeacherFeedback;
