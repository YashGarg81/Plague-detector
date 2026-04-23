import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { assignmentAPI, peerReviewAPI, documentAPI, authAPI } from '../services/api';

interface Assignment {
  _id: string;
  title: string;
}

interface Doc {
  id: string;
  originalName: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const PeerReviewPanel: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [reviewerSearchText, setReviewerSearchText] = useState('');
  const [showReviewerDropdown, setShowReviewerDropdown] = useState(false);
  const [revieweeDocumentId, setRevieweeDocumentId] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewId, setReviewId] = useState('');
  const [submissionComment, setSubmissionComment] = useState('');

  const loadBasics = async () => {
    try {
      const [assignmentRes, docsRes, usersRes] = await Promise.all([
        assignmentAPI.list(),
        documentAPI.listDocuments(),
        authAPI.listUsers(),
      ]);
      setAssignments(assignmentRes.data.assignments || []);
      setDocuments(docsRes.data.documents || []);
      setUsers(usersRes.data.users || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load peer review data');
    }
  };

  const searchReviewers = async (search: string) => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }
    try {
      const response = await authAPI.listUsers(search);
      setUsers(response.data.users || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to search users');
    }
  };

  useEffect(() => {
    loadBasics();
  }, []);

  const handleReviewerSearch = (text: string) => {
    setReviewerSearchText(text);
    setShowReviewerDropdown(true);
    searchReviewers(text);
  };

  const selectReviewer = (user: User) => {
    setReviewerId(user._id);
    setReviewerSearchText(user.username);
    setShowReviewerDropdown(false);
  };

  const loadReviews = async (assignmentId: string) => {
    if (!assignmentId) return;
    try {
      const response = await peerReviewAPI.listForAssignment(assignmentId);
      setReviews(response.data.reviews || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load assignment reviews');
    }
  };

  const assignReview = async () => {
    if (!selectedAssignmentId || !reviewerId || !revieweeDocumentId) {
      toast.error('Assignment, reviewer, and reviewee document are required');
      return;
    }

    try {
      await peerReviewAPI.assign(selectedAssignmentId, {
        reviewerId,
        revieweeDocumentId,
      });
      toast.success('Peer review assigned');
      setReviewerId('');
      setReviewerSearchText('');
      setRevieweeDocumentId('');
      loadReviews(selectedAssignmentId);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to assign peer review');
    }
  };

  const submitReview = async () => {
    if (!reviewId) {
      toast.error('Review ID is required');
      return;
    }

    try {
      await peerReviewAPI.submit(reviewId, {
        comments: submissionComment.trim()
          ? [{ text: submissionComment.trim(), startIndex: 0, endIndex: 80 }]
          : [],
        rubricScores: [
          { criterionTitle: 'Argument quality', score: 30, maxPoints: 40 },
        ],
      });
      toast.success('Review submitted');
      if (selectedAssignmentId) {
        loadReviews(selectedAssignmentId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    }
  };

  const filteredUsers =
    reviewerSearchText.length > 0 ? users : [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Assign Peer Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border rounded px-3 py-2"
            value={selectedAssignmentId}
            onChange={(e) => {
              setSelectedAssignmentId(e.target.value);
              loadReviews(e.target.value);
            }}
          >
            <option value="">Select assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Search reviewer by name or email"
              value={reviewerSearchText}
              onChange={(e) => handleReviewerSearch(e.target.value)}
              onFocus={() => setShowReviewerDropdown(true)}
            />
            {showReviewerDropdown && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => selectReviewer(user)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                ))}
              </div>
            )}
            {reviewerId && reviewerSearchText && (
              <p className="text-sm text-green-600 mt-1">✓ Reviewer selected</p>
            )}
          </div>

          <select
            className="border rounded px-3 py-2"
            value={revieweeDocumentId}
            onChange={(e) => setRevieweeDocumentId(e.target.value)}
          >
            <option value="">Select reviewee document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.originalName}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={assignReview}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign Review
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Submit Assigned Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Review ID"
            value={reviewId}
            onChange={(e) => setReviewId(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Comment"
            value={submissionComment}
            onChange={(e) => setSubmissionComment(e.target.value)}
          />
        </div>
        <button
          onClick={submitReview}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Review
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Assignment Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews loaded.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded p-4">
                <p className="font-semibold text-gray-800">Review ID: {review._id}</p>
                <p className="text-sm text-gray-600">Status: {review.status}</p>
                <p className="text-sm text-gray-600">
                  Reviewer: {review.reviewerId?.username || review.reviewerId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReviewPanel;
