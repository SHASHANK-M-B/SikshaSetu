import { enrollToCourse, getAllCourses } from "@/api/student";
import React, { useEffect, useState } from "react";
import { FiPlayCircle, FiPlusCircle, FiCheck } from "react-icons/fi";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null); // Stores the ID of the course being joined

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      // Expecting backend to return { courses: [ {..., isEnrolled: true/false } ] }
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleJoin = async (id) => {
    setJoinLoading(id);
    try {
      await enrollToCourse(id);

      // Optimistically update the UI to reflect enrollment
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === id ? { ...course, isEnrolled: true } : course
        )
      );
    } catch (error) {
      console.error("Failed to enroll:", error);
    } finally {
      setJoinLoading(false);
    }
  };

  // Filter courses based on enrollment status
  const joinedCourses = courses.filter((c) => c.isEnrolled);
  const availableCourses = courses.filter((c) => !c.isEnrolled);

  return (
    <div className="space-y-10">
      {/* AVAILABLE COURSES TO JOIN */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4">
          Join New Courses
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Courses shared by your teacher will appear here.
        </p>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading courses...
          </div>
        ) : availableCourses.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl shadow border text-center text-gray-500">
            No new courses available to join at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <div
                key={course.courseId}
                className="p-6 rounded-2xl bg-white shadow-md border hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-indigo-600">
                    {course.courseCode}
                  </h3>
                  <p className="text-lg font-semibold">{course.courseName}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                    {course.shortDescription}
                  </p>
                </div>

                <button
                  onClick={() => handleJoin(course.courseId)}
                  disabled={joinLoading === course.courseId}
                  className={`mt-4 w-full py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition
                    ${
                      joinLoading === course.courseId
                        ? "bg-green-400"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {joinLoading === course.courseId ? (
                    "Joining..."
                  ) : (
                    <>
                      <FiPlusCircle className="text-lg" /> Join Course
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOINED COURSES */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4">
          Joined Courses
        </h2>
        <p className="text-gray-600 text-lg">
          Continue learning from your joined courses.
        </p>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : joinedCourses.length === 0 ? (
          <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
            You haven't joined any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {joinedCourses.map((course) => (
              <div
                key={course.courseId}
                className="p-6 rounded-2xl bg-white shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <h3 className="text-xl font-bold text-indigo-600">
                  {course.courseCode}
                </h3>
                <p className="text-lg font-semibold">{course.courseName}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    {/* Dummy progress for now as backend doesn't return this yet */}
                    <span>0%</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all"
                      style={{ width: `0%` }}
                    ></div>
                  </div>
                </div>

                <button className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 cursor-pointer">
                  <FiPlayCircle /> Resume Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}