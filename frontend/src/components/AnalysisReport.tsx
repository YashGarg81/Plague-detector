import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface AnalysisReportProps {
  aiScore: number;
  plagiarismScore: number;
  similarityScore?: number;
  confidence: number;
  reportGeneratedInMs?: number;
  wordCount: number;
  sourceMatches?: Array<{
    sourceType: 'website' | 'journal' | 'student-paper';
    sourceName: string;
    matchPercentage: number;
    matchedText: string;
  }>;
  matchedContentBreakdown?: {
    websites: number;
    journals: number;
    studentPapers: number;
  };
  writingAnalysis?: {
    paraphrasingLikelihood: number;
    writingPatternConsistency: number;
    grammarRisk: number;
    structureRisk: number;
  };
  flaggedSections: Array<{
    text: string;
    type: 'ai-generated' | 'plagiarism';
    color?: 'red' | 'yellow' | 'blue';
    confidence: number;
  }>;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({
  aiScore,
  plagiarismScore,
  similarityScore,
  confidence,
  reportGeneratedInMs,
  wordCount,
  sourceMatches = [],
  matchedContentBreakdown,
  writingAnalysis,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className={`p-6 rounded-lg ${getScoreBgColor(similarityScore ?? plagiarismScore)}`}>
          <p className="text-sm text-gray-600 mb-2">Similarity Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(similarityScore ?? plagiarismScore)}`}>
            {((similarityScore ?? plagiarismScore) * 100).toFixed(1)}%
          </p>
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

      {/* Source Matches */}
      {sourceMatches.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Source Matches</h3>
          <div className="space-y-3">
            {sourceMatches.map((source, idx) => (
              <div key={idx} className="p-3 bg-white border rounded">
                <p className="text-sm font-semibold text-gray-800">
                  {source.sourceName} ({source.sourceType})
                </p>
                <p className="text-sm text-gray-600">{source.matchPercentage}% matched</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Writing Analysis */}
      {writingAnalysis && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Writing Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>Paraphrasing Likelihood: {(writingAnalysis.paraphrasingLikelihood * 100).toFixed(1)}%</p>
            <p>Pattern Consistency: {(writingAnalysis.writingPatternConsistency * 100).toFixed(1)}%</p>
            <p>Grammar Risk: {(writingAnalysis.grammarRisk * 100).toFixed(1)}%</p>
            <p>Structure Risk: {(writingAnalysis.structureRisk * 100).toFixed(1)}%</p>
          </div>
          {matchedContentBreakdown && (
            <div className="mt-3 text-sm text-gray-700">
              <p>
                Match Breakdown - Websites: {matchedContentBreakdown.websites}% | Journals: {matchedContentBreakdown.journals}% | Student Papers: {matchedContentBreakdown.studentPapers}%
              </p>
            </div>
          )}
          {reportGeneratedInMs !== undefined && (
            <p className="mt-3 text-xs text-gray-500">Report generated in {reportGeneratedInMs}ms</p>
          )}
        </div>
      )}

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
                className={`p-3 rounded border-l-4 ${
                  section.color === 'yellow'
                    ? 'bg-yellow-50 border-yellow-500'
                    : section.color === 'blue'
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-red-50 border-red-500'
                }`}
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
