import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { documentAPI } from '../services/api';

interface FeedbackEditorProps {
  documentId: string | null;
}

const FeedbackEditor: React.FC<FeedbackEditorProps> = ({ documentId }) => {
  const [quickMarksCsv, setQuickMarksCsv] = useState('');
  const [commentText, setCommentText] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [rubricScore, setRubricScore] = useState<number | ''>('');
  const [audioFeedbackUrl, setAudioFeedbackUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const saveFeedback = async () => {
    if (!documentId) {
      toast.error('No document selected');
      return;
    }

    setSaving(true);
    try {
      await documentAPI.upsertFeedback(documentId, {
        quickMarks: quickMarksCsv
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        inlineComments: commentText.trim()
          ? [{ text: commentText.trim(), startIndex, endIndex }]
          : [],
        rubricScore: rubricScore === '' ? undefined : Number(rubricScore),
        audioFeedbackUrl: audioFeedbackUrl.trim() || undefined,
      });
      toast.success('Feedback saved');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save feedback');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Feedback & Grading</h3>
      <p className="text-sm text-gray-600">
        Selected document: {documentId || 'None'}
      </p>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="QuickMarks (comma separated)"
        value={quickMarksCsv}
        onChange={(e) => setQuickMarksCsv(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border rounded px-3 py-2 md:col-span-1"
          placeholder="Inline comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Start index"
          value={startIndex}
          onChange={(e) => setStartIndex(Number(e.target.value) || 0)}
        />
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="End index"
          value={endIndex}
          onChange={(e) => setEndIndex(Number(e.target.value) || 0)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          className="border rounded px-3 py-2"
          placeholder="Rubric score"
          value={rubricScore}
          onChange={(e) =>
            setRubricScore(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Audio feedback URL"
          value={audioFeedbackUrl}
          onChange={(e) => setAudioFeedbackUrl(e.target.value)}
        />
      </div>
      <button
        onClick={saveFeedback}
        disabled={saving}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Feedback'}
      </button>
    </div>
  );
};

export default FeedbackEditor;
