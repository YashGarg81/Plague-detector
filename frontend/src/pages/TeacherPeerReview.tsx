import React from 'react';
import PeerReviewPanel from '../components/PeerReviewPanel';

const TeacherPeerReview: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Teacher: Peer Review</h1>
        <PeerReviewPanel />
      </div>
    </div>
  );
};

export default TeacherPeerReview;
