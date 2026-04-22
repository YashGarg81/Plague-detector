import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface AnalysisReportProps {
  aiScore: number;
  plagiarismScore: number;
  confidence: number;
  wordCount: number;
  flaggedSections: Array<{
    text: string;
    type: 'ai-generated' | 'plagiarism';
    confidence: number;
  }>;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({
  aiScore,
  plagiarismScore,
  confidence,
  wordCount,
  flaggedSections,
}) => {
  const getScoreColor = (score: number) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score < 0.3) return 'bg-green-100';
    if (score < 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-lg ${getScoreBgColor(aiScore)}`}>
          <p className="text-sm text-gray-600 mb-2">AI-Generated Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(aiScore)}`}>
            {(aiScore * 100).toFixed(1)}%
          </p>
        </div>

        <div className={`p-6 rounded-lg ${getScoreBgColor(plagiarismScore)}`}>
          <p className="text-sm text-gray-600 mb-2">Plagiarism Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(plagiarismScore)}`}>
            {(plagiarismScore * 100).toFixed(1)}%
          </p>
        </div>

        <div className="p-6 rounded-lg bg-blue-100">
          <p className="text-sm text-gray-600 mb-2">Word Count</p>
          <p className="text-3xl font-bold text-blue-600">{wordCount}</p>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment</h3>
        <div className="space-y-3">
          {aiScore < 0.3 ? (
            <div className="flex items-center text-green-600">
              <FiCheck className="mr-3 text-xl" />
              <span>Low AI-generated content detected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <FiX className="mr-3 text-xl" />
              <span>High AI-generated content detected - humanization recommended</span>
            </div>
          )}

          {plagiarismScore < 0.3 ? (
            <div className="flex items-center text-green-600">
              <FiCheck className="mr-3 text-xl" />
              <span>Low plagiarism risk</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <FiX className="mr-3 text-xl" />
              <span>Plagiarism detected - rewriting recommended</span>
            </div>
          )}
        </div>
      </div>

      {/* Flagged Sections */}
      {flaggedSections.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Flagged Sections ({flaggedSections.length})
          </h3>
          <div className="space-y-3">
            {flaggedSections.map((section, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-50 border-l-4 border-red-500 rounded"
              >
                <p className="text-sm text-red-700 font-semibold mb-1">
                  {section.type === 'ai-generated'
                    ? 'AI-Generated Content'
                    : 'Potential Plagiarism'}{' '}
                  ({(section.confidence * 100).toFixed(0)}% confidence)
                </p>
                <p className="text-sm text-gray-700">"{section.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
