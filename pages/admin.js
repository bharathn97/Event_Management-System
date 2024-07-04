import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Admin = ({ logout }) => {
  const router = useRouter();
  //Check is the token exists in the local storage if not redirect to hmepage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };

    checkToken();
  }, []);
  const [initialData, setInitialData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/allevents");
        const data = await response.json();
        setInitialData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching the instructor courses:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleEditClick = (EventID) => {
    const slug = `${EventID}`;
    router.push(`/event_admin/${slug}`);
  };
  const handleEventFeedback = async (EventID) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to set the Feedback for this course: ${EventID}?`
    );
    if (userConfirmed) {
      const eventData = initialData.find((Event) => Event.EventID === EventID);
      if (!eventData) {
        console.error("Course data not found");
        return;
      }
      try {
        const response = await fetch(
          `/api/updateeventfeedback?EventID=${EventID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          setFeedbackStatus((prevStatus) => ({
            ...prevStatus,
            [EventID]: true,
          }));
          toast.success(
            `Event Feedback For ${EventID} has been set Successfully!`,
            {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        } else {
          // Handle error
          console.error("Failed to update event feedback");
        }
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = initialData.filter(
      (Event) =>
        Event.EventID.toLowerCase().includes(query) ||
        Event.EventName.toLowerCase().includes(query)
    );

    setSearchQuery(query);
    setFilteredData(filtered);
  };
  const handleRemove = async (EventID, EventName) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to drop the course: ${EventID} - ${EventName}?`
    );

    if (userConfirmed) {
      try {
        const response = await fetch("/api/deleteEvent", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ EventID: EventID }),
        });

        if (response.ok) {
          const updatedData = initialData.filter(
            (Event) => Event.EventID !== EventID
          );
          setFilteredData(updatedData);
          toast.success(`${EventID} Removed Successfully!`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          console.error("Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };
  const handleCourseFeedback = async (EventID) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to set the feedback for this event: ${EventID}?`
    );

    if (userConfirmed) {
      try {
        const response = await fetch(
          `/api/updateeventfeedback?EventID=${EventID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          toast.success(
            `Event Feedback For ${EventID} has been set successfully!`,
            {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        } else {
          // Handle error
          console.error("Failed to update course feedback");
        }
      } catch (error) {
        console.error("Error updating course feedback:", error);
      }
    }
  };
  return (
    <div className="flex">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        limit={5}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colors"
      />
      <div className="w-70">
        <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              <div className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mx-4 font-medium">Dashboard</span>
              </div>

              <Link
                href={"/userdetails"}
                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mx-4 font-medium">User Details</span>
              </Link>

              <button
                onClick={() => {
                  router.push({
                    pathname: "/newevent_admin",
                  });
                }}
                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mx-4 font-medium">New Event</span>
              </button>
              <Link
                href={"/enrollmentdetails"}
                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mx-4 font-medium">
                  After Math Event Details
                </span>
              </Link>

              <Link
                href={"/eventfeedbacksadmin"}
                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mx-4 font-medium">View Event Back Forms</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mx-4 font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </aside>
      </div>
      <div className="w-4/5">
        <section className="container px-6 w-70" style={{ height: "400px" }}>
          <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
              <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                All Events
              </button>
            </div>

            <div className="relative flex items-center mt-4 md:mt-0">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-3 focus:outline-none">
                            <span>Event ID</span>
                            <svg
                              className="h-3"
                              viewBox="0 0 10 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.1"
                              />
                              <path
                                d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.3"
                              />
                            </svg>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Host
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Type
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Dates
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Location
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Maximum Attendance
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Current Revenue
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Edit
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Set Event Feed Back Form
                        </th>
                        <th
                          scope="col"
                          className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData.map((Event) => (
                        <tr key={Event.EventID}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white ">
                                {Event.EventID}
                              </h2>
                            </div>
                          </td>
                          <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                              {Event.EventName}
                            </div>
                          </td>
                          <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {Event.EventHost}
                              </h4>
                            </div>
                          </td>
                          <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {Event.EventType}
                              </h4>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center">
                              <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                {new Date(Event.EventDate).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {Event.Location}
                            </h4>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {Event.Description}
                            </h4>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {Event.MaximumAttendance}
                            </h4>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {Event.CurrentRevenue}
                            </h4>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <button
                                class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                onClick={() => handleEditClick(Event.EventID)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <button
                                className={`px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none ${
                                  Event.SetCourseFeedback // Check for boolean value true
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                }`}
                                disabled={Event.SetCourseFeedback} // Check for boolean value true
                                onClick={() =>
                                  handleCourseFeedback(Event.EventID)
                                }
                              >
                                Set Event Feedback form
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <button
                                class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                                onClick={() =>
                                  handleRemove(Event.EventID, Event.EventName)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Admin;
