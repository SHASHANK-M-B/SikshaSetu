import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/api/teacher";
import React, { useState, useEffect } from "react";
import { FiBook } from "react-icons/fi";
import LoadingScreen from "@/components/ui/LoadingScreen";
export default function CourseManager() {
  const initialData = {
    courseName: "",
    courseCode: "",
    shortDescription: "",
  };
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [editCourse, setEditCourse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAllCourses = async () => {
    setLoadingInitial(true);
    try {
      const response = await getCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCourse(courseData);
      await getAllCourses();
      setCourseData(initialData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setLoadingCourseId(id);
      await getAllCourses();
    } catch (error) {
    } finally {
    }
  };
  const handleEdit = (course) => {
    setEditCourse({
      courseName: course.courseName,
      shortDescription: course.shortDescription,
      courseCode: course.courseCode,
      courseId: course.courseId,
    });
  };
  const saveEdit = async (id) => {
    console.log(editCourse, "course");
    console.log(id, "id");
    try {
      await updateCourse(id, editCourse);
      await getAllCourses();
      setCourses((prev) =>
        prev.map((c) => (c.id === editCourse.id ? editCourse : c))
      );
      setEditCourse(null); // close popup
    } catch (err) {}
  };

  return (
    <div>
      {loadingInitial && <LoadingScreen message="Loading courses..." />}
      <div className="max-w-3xl mx-auto space-y-6">
        <h3 className="font-bold text-2xl text-indigo-700 flex items-center gap-2">
          <FiBook /> Manage Courses
        </h3>

        <form
          onSubmit={handleCreateCourse}
          className="space-y-3 bg-white/50 p-4 rounded-xl border border-indigo-200/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              required
              placeholder="Course name *"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              className="p-2 rounded border"
            />
            <input
              required
              placeholder="Course code *"
              name="courseCode"
              value={courseData.courseCode}
              onChange={handleChange}
              className="p-2 rounded border"
            />
            <input
              required
              placeholder="Short desc *"
              name="shortDescription"
              value={courseData.shortDescription}
              onChange={handleChange}
              className="p-2 rounded border"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-700 text-white rounded cursor-pointer"
            >
              {loading ? "Creating Course" : "Create Course"}
            </button>
            <button
              type="button"
              onClick={() => setForm({ name: "", code: "", desc: "" })}
              className="px-4 py-2 border rounded cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        <div>
          <h4 className="font-semibold mb-2">Your Courses</h4>
          <div className="grid gap-3">
            {courses.length === 0 && (
              <div className="text-slate-500">No courses yet.</div>
            )}

            {Array.isArray(courses) &&
              courses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 bg-white/30 rounded-lg flex justify-between items-center border border-white/10"
                >
                  <div>
                    <div className="font-medium">{course.courseName}</div>
                    <div className="text-xs text-slate-600">
                      {course.courseCode} · {course.shortDescription} students
                    </div>
                  </div>

                  <div className="flex gap-2 cursor-pointer">
                    <button
                      onClick={() => handleEdit(course)}
                      className="px-3 py-1 bg-white/10 rounded cursor-pointer border border-indigo-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                    >
                      {loadingCourseId === course.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {editCourse && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
            <h2 className="text-lg font-bold mb-3">Edit Course</h2>

            <label className="text-sm font-semibold">Course Name <span className="text-red-500">*</span></label>
            <input
              className="border rounded-lg w-full px-3 py-2 mb-3"
              value={editCourse.courseName}
              onChange={(e) =>
                setEditCourse((prev) => ({
                  ...prev,
                  courseName: e.target.value,
                }))
              }
            />

            <label className="text-sm font-semibold">Short Description <span className="text-red-500">*</span></label>
            <textarea
              className="border rounded-lg w-full px-3 py-2 mb-3"
              rows="3"
              value={editCourse.shortDescription}
              onChange={(e) =>
                setEditCourse((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditCourse(null)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(editCourse.courseId)}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
