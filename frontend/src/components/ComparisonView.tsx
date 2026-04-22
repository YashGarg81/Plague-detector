import React from 'react';

interface ComparisonViewProps {
  original: string;
  humanized: string;
  style: string;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  original,
  humanized,
  style,
}) => {
  const highlightDifferences = (text: string, isHumanized: boolean) => {
    // Simple highlighting - in production, use a library like 'diff-match-patch'
    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {text}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Comparison View
        </h3>
        <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
          Style: {style}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-700 mb-3">Original Text</h4>
          <div className="max-h-96 overflow-y-auto text-gray-700">
            {highlightDifferences(original, false)}
          </div>
        </div>

        {/* Humanized */}
        <div className="border rounded-lg p-4 bg-green-50">
          <h4 className="font-semibold text-gray-700 mb-3">Humanized Text</h4>
          <div className="max-h-96 overflow-y-auto text-gray-700">
            {highlightDifferences(humanized, true)}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Original Words</p>
          <p className="text-2xl font-bold text-blue-600">
            {original.split(/\s+/).length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Humanized Words</p>
          <p className="text-2xl font-bold text-green-600">
            {humanized.split(/\s+/).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
