import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Slug = () => {
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
  const { slug } = router.query;
  const [initialData, setInitialData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `/api/allEventRequestAdditions?EventHost=${slug}`
        );
        const data = await response.json();
        setInitialData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching Events:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = initialData.filter(
      (Event) =>
        Event.EventID.toLowerCase().includes(query) ||
        Event.EventTitle.toLowerCase().includes(query)
    );

    setSearchQuery(query);
    setFilteredData(filtered);
  };
  const handleApprove = async () => {
    try {
      if (!selectedEventID) {
        console.error("No Event selected for approval");
        return;
      }

      const res = await fetch(
        `/api/adminapproval?EventID=${selectedEventID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ additionstatus: "success" }), // Add the updated data here
        }
      );

      if (!res.ok) {
        // Handle non-successful status codes
        const errorResponse = await res.json();
        console.error("Error updating Event:", errorResponse.error);
        // You may want to set an error state or display a notification to the user
        return;
      }
      if (res.ok) {
        toast.success(
          `${selectedEventID} has been approved for the faculty ${slug}!`,
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
        const fetchEvents = async () => {
          try {
            const response = await fetch(
              `/api/allEventrequestadditions?EventHost=${slug}`
            );
            const data = await response.json();
            setInitialData(data);
            setFilteredData(data);
          } catch (error) {
            console.error("Error fetching Events:", error);
          }
        };
        fetchEvents();
        // Handle the response as needed
      }
    } catch (error) {
      console.error("Error updating Event:", error);
      // Handle unexpected errors (e.g., network issues)
      // You may want to set an error state or display a notification to the user
    }
  };

  useEffect(() => {
    if (selectedEventID !== null) {
      handleApprove();
    }
  }, [selectedEventID]);

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
        <section className="container px-6 w-full" style={{ height: "400px" }}>
          <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
              <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                New Event Addition Requests
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
                          className="px-8 py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-3 focus:outline-none">
                            <span>Event Code</span>
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
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Title
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Maximum Attendance
                        </th>
                        <th
                          scope="col"
                          className="px-8 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Event Date
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Approve
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData.map((Event) => (
                        <tr key={Event.EventID}>
                          <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white ">
                                {Event.EventID}
                              </h2>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                              {Event.EventName}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {Event.Description}
                              </h4>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {Event.Location}
                              </h4>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {Event.MaximumAttendance}
                              </h4>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center">
                              <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                {
                                  new Date(Event.EventDate)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              <button
                                className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                onClick={() => {
                                  setSelectedEventID(Event.EventID);
                                }}
                              >
                                Approve
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
export default Slug;
