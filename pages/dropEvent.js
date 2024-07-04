import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
const DropEvent = ({ user }) => {
  const router = useRouter();
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
  const { UserID } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (UserID) {
          const response = await fetch("/api/allEventsfilteruser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ UserID: UserID }),
          });
          const data = await response.json();
          setInitialData(data);
          setFilteredData(data);
        }
      } catch (error) {
        console.error("Error fetching the eventHost Events:", error);
      }
    };

    fetchEvents();
  }, [UserID]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = initialData.filter(
      (Event) =>
        Event.EventCode.toLowerCase().includes(query) ||
        Event.EventTitle.toLowerCase().includes(query)
    );

    setSearchQuery(query);
    setFilteredData(filtered);
  };
  const handleEditClick = async (EventID) => {
    const confirmed = window.confirm(
      `Are you sure you want to drop the Event: ${EventID}?`
    );
    if (!confirmed) {
      return;
    }
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
      }
    } catch (error) {
      console.error("Error dropping Event:", error.message);
    }
  };
  return (
    <div>
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
      <div className="min-w-full">
        <section className="container px-6 w-70" style={{ height: "400px" }}>
          <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
              <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                Hosted Events
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
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Name
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Date
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Type
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Maximum Attendance
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Drop Option
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData &&
                        filteredData.map((Event) => (
                          <tr key={Event.EventID}>
                            <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                {Event.EventName}
                              </div>
                            </td>
                            <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div>
                                <h4 className="text-gray-700 dark:text-gray-200">
                                  {Event.Description}
                                </h4>
                              </div>
                            </td>
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                {Event.EventDate}
                              </div>
                            </td>
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                {Event.EventType}
                              </div>
                            </td>
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div className="flex items-center">
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                  {Event.MaximumAttendance}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                {Event.Location}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                                <button
                                  class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                  onClick={() => handleEditClick(Event.EventID)}
                                >
                                  Drop
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
            <Link href={`/user?UserID=${UserID}`}>
              <div class="flex">
                <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">
                  DashBoard
                </button>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
export default DropEvent;
