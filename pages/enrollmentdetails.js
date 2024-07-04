import React, { useState,useEffect } from 'react';
  import {useRouter} from "next/router"

const EnrollmentDetails=()=>{
  const router=useRouter();
  useEffect(() => {
  const checkToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/');
      }
    } catch (error) {
      router.push("/");
    }
  };th

  checkToken();
}, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/allcourses");
        const data = await response.json();
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching the instructor courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
  const fetchStudentDetails = async () => {
    try {
      // Iterate through each course
      const updatedCourseData = await Promise.all(
        filteredData.map(async (course) => {
          const studentsData = await Promise.all(
            course.enrolledStudents.map(async (studentID) => {
              const response = await fetch(`/api/studentdetailscourse?StudentID=${studentID}`);
              const studentDetails = await response.json();
              return studentDetails;
            })
          );

          // Update the course with student details
          return { ...course, students: studentsData };
        })
      );

      // Trigger a re-render with the updated course data
      setFilteredData(updatedCourseData);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Only fetch student details when courseData changes
  if (filteredData.length > 0 ) {
    fetchStudentDetails();
  }
}, [filteredData]);
  const calculateAverageGPA = (students) => {
    const totalGPA = students.reduce((sum, student) => sum + student.CGPA, 0);
    return (totalGPA / students.length).toFixed(2);
  };

  return (
    <div>
    <section className="container px-6 w-70" style={{ height: '400px' }}>
    <div className="mt-6 md:flex md:items-center md:justify-between">
    </div>
      <div className="flex flex-col mt-6">
        {filteredData.map((course) => (
          <div key={course.CourseCode} className="mt-6">
          <h1 className="text-lg font-bold text-black">{course.CourseCode}</h1>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-black">
            {course.CourseTitle} - {course.credits} Credits - {course.instructor}
            </h2>
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-2 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <button className="flex items-center gap-x-3 focus:outline-none">
                      <span>Student Name</span>
                      <svg
                        className="h-3"
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                      </svg>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-1 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    Email
                  </th>
                  <th scope="col" className="px-1 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  Department
                              </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                              Degree
                                          </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  Student ID
                              </th>

                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                  {course.students && course.students.map((student) => (
                    <tr key={student.studentID}>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                        <div>
                          <h2 className="font-medium text-gray-800 dark:text-white">
                            {student.name}
                          </h2>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                        <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div>
                          <h4 className="text-gray-700 dark:text-gray-200">
                            {student.department}
                          </h4>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div>
                          <h4 className="text-gray-700 dark:text-gray-200">
                            {student.programType}
                          </h4>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div>
                          <p className="text-gray-700 dark:text-gray-200">
                          {student.studentID}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
    <div className="mt-40 w-1/2">
     <section className="container w-1/2 px-6 w-50" style={{ height: '400px' }}>
       <div className="flex flex-col mt-6">
         {filteredData.map((course) => (
           <div key={course.CourseCode} className="mt-6">
             <h1 className="text-lg font-bold text-black">{course.CourseCode}</h1>
             <h2 className="text-lg font-semibold text-gray-800 dark:text-black">
               {course.CourseTitle} - {course.credits} Credits - {course.instructor}
             </h2>
             <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mb-6">
                 <thead className="bg-gray-50 dark:bg-gray-800">
                   <tr>
                     <th
                       scope="col"
                       className="py-3.5 px-2 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-100"
                     >
                       Statistic
                     </th>
                     <th
                       scope="col"
                       className="px-1 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                     >
                       Value
                     </th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                   <tr>
                     <td className="px-2 py-4 text-lg font-medium whitespace-nowrap  dark:text-white dark:bg-gray-900">
                       <div>Total Enrollments</div>
                     </td>
                     <td className="px-2 py-4 text-lg font-medium whitespace-nowrap dark:text-white dark:bg-gray-900">
                       <div>{course.students && course.students.length}</div>
                     </td>
                   </tr>
                   <tr>
   <td className="px-2 py-4 text-lg font-medium whitespace-nowrap dark:text-white dark:bg-gray-900">
     <div>Average CGPA</div>
   </td>
   <td className="px-2 py-4 text-lg font-medium whitespace-nowrap dark:text-white dark:bg-gray-900">
     <div>
       {course.students &&
         course.students.length > 0 &&
         calculateAverageGPA(course.students)}
     </div>
   </td>
 </tr>
                 </tbody>
               </table>
           </div>
           </div>
         ))}
       </div>
     </section>
   </div>
    </div>
  );
};

export default EnrollmentDetails;
