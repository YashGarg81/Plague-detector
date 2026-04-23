import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { assignmentAPI } from '../services/api';

interface RubricCriterion {
  title: string;
  description?: string;
  maxPoints: number;
}

interface Assignment {
  _id: string;
  title: string;
  course: string;
  dueDate?: string;
  allowResubmission: boolean;
  groupAssignment: boolean;
  quickMarksLibrary: string[];
  rubric: RubricCriterion[];
}

const AssignmentManager: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    course: '',
    dueDate: '',
    allowResubmission: true,
    groupAssignment: false,
    quickMarksCsv: '',
    rubricTitle: '',
    rubricPoints: 10,
  });

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const response = await assignmentAPI.list();
      setAssignments(response.data.assignments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const createAssignment = async () => {
    if (!form.title.trim() || !form.course.trim()) {
      toast.error('Title and course are required');
      return;
    }

    try {
      await assignmentAPI.create({
        title: form.title.trim(),
        course: form.course.trim(),
        dueDate: form.dueDate || undefined,
        allowResubmission: form.allowResubmission,
        groupAssignment: form.groupAssignment,
        quickMarksLibrary: form.quickMarksCsv
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        rubric: form.rubricTitle.trim()
          ? [
              {
                title: form.rubricTitle.trim(),
                maxPoints: Number(form.rubricPoints) || 10,
              },
            ]
          : [],
      });
      toast.success('Assignment created');
      setForm((prev) => ({
        ...prev,
        title: '',
        course: '',
        dueDate: '',
        quickMarksCsv: '',
        rubricTitle: '',
        rubricPoints: 10,
      }));
      loadAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create assignment');
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      await assignmentAPI.delete(assignmentId);
      toast.success('Assignment deleted');
      loadAssignments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete assignment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Assignment title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Course code"
            value={form.course}
            onChange={(e) => setForm((prev) => ({ ...prev, course: e.target.value }))}
          />
          <input
            type="datetime-local"
            className="border rounded px-3 py-2"
            value={form.dueDate}
            onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="QuickMarks (comma separated)"
            value={form.quickMarksCsv}
            onChange={(e) => setForm((prev) => ({ ...prev, quickMarksCsv: e.target.value }))}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Initial rubric criterion title"
            value={form.rubricTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, rubricTitle: e.target.value }))}
          />
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2"
            placeholder="Rubric max points"
            value={form.rubricPoints}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rubricPoints: Number(e.target.value) || 10 }))
            }
          />
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.allowResubmission}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, allowResubmission: e.target.checked }))
              }
            />
            Allow resubmission
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.groupAssignment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, groupAssignment: e.target.checked }))
              }
            />
            Group assignment
          </label>
        </div>
        <button
          onClick={createAssignment}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Assignment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Assignments</h3>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-600">No assignments yet.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="border rounded p-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {assignment.title} ({assignment.course})
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'Not set'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rubric items: {assignment.rubric?.length || 0} | QuickMarks: {assignment.quickMarksLibrary?.length || 0}
                  </p>
                </div>
                <button
                  onClick={() => deleteAssignment(assignment._id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManager;
