import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
const Slug = () => {
  const router = useRouter();

  const [eventData, setEventData] = useState(null);
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
  const { UserID, slug } = router.query;
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/oneevent?EventID=${slug}`);
        const data = await response.json();
        setEventData(data);
        console.log(data + "hello");
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchEvents();
  }, [slug]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hoursOfDay = [
    "8-9 AM",
    "9-10 AM",
    "10-11 AM",
    "11-12 AM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
    "5-6 PM",
    "6-7 PM",
    "7-8 PM",
    "8-9 PM",
    "9-10 PM",
    "10-11 PM",
    "11-12 PM",
  ];
  const handleSlotClick = (day, hour) => {
    const updatedTimetableData = { ...timetableData };

    if (!updatedTimetableData[day]) {
      updatedTimetableData[day] = {};
    }

    const slotStatus = updatedTimetableData[day][hour];
    console.log(updatedTimetableData[day][hour]);
    // Check if the slot is undefined, empty, or null
    if (!slotStatus) {
      updatedTimetableData[day][hour] = "Selected";
    } else {
      switch (slotStatus) {
        case "Available":
          updatedTimetableData[day][hour] = "Selected";
          break;
        case "Selected":
          updatedTimetableData[day][hour] = "Available";
          break;
        default:
          // Occupied slots are not clickable
          break;
      }
    }

    setTimeTableData(updatedTimetableData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const sendSelectedSlots = async (EventID) => {
    try {
      // Extract selected slots from timetableData
      const selectedSlots = [];
      for (const day in timetableData) {
        for (const hour in timetableData[day]) {
          if (timetableData[day][hour] === "Selected") {
            selectedSlots.push({ day, hour });
          }
        }
      }

      // Send selected slots to the server
      const response = await fetch(
        `/api/selectedSlots?EventID=${EventID}&UserID=${UserID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedSlots }),
        }
      );

      if (response.ok) {
        toast.success("Selected slots submitted successfully!");
        setTimeTableData({
          Mon: {},
          Tue: {},
          Wed: {},
          Thu: {},
          Fri: {},
        });
        window.location.reload();
      } else {
        throw new Error("Failed to submit selected slots.");
      }
    } catch (error) {
      console.error("Error submitting selected slots:", error.message);
      toast.error("Failed to submit selected slots.");
    }
  };
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      try {
        const response = await fetch(`/api/occupiedSlots?UserID=${UserID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch occupied slots");
        }
        const data = await response.json();
        console.log(data.timetableEntries);
        setOccupiedSlots(data.timetableEntries);
        // Update timetableData based on occupiedSlots
        const updatedTimetableData = {
          Mon: {},
          Tue: {},
          Wed: {},
          Thu: {},
          Fri: {},
        };
        for (const slot of data.timetableEntries) {
          const { DayOfWeek, TimeSlot, EventID } = slot;
          if (EventID == slug) {
            updatedTimetableData[DayOfWeek][TimeSlot] = "CurrentOccupied";
          } else {
            updatedTimetableData[DayOfWeek][TimeSlot] = "Occupied";
          }
        }
        setTimeTableData(updatedTimetableData);
      } catch (error) {
        console.error("Error fetching occupied slots:", error);
        // Handle error (e.g., show error message to user)
      }
    };
    fetchOccupiedSlots();
  }, [UserID]);
  const handleSubmit = async (e) => {
    const shouldUpdate = window.confirm("Do you want to create this new event");
    if (!shouldUpdate) {
      return;
    }
    let data = eventData;
    let res = await fetch(`/api/updateevent?EventID=${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let response = await res.json();
    if (response.success) {
      setEventData(response.event);
      toast.success("Event Updated!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      sendSelectedSlots(slug);
    } else {
      // Handle the case where response.success is false
      toast.error("Event update failed!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleEventTypeChange = (event) => {
    const selectedEventType = event.target.value;
    setEventData((prevData) => ({
      ...prevData,
      EventType: selectedEventType,
    }));
  };
  const handleCancel = () => {
    setEventData(initialEventData);
  };

  const [timetableData, setTimeTableData] = useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
  });

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
      <form>
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-bold leading-7 text-black">
              Create A New Event
            </h1>
            <h2 class="mt-1 text-sm leading-6 text-gray-600">
              After submission an approval is done by the admin
            </h2>

            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label
                  htmlFor="username"
                  class="block text-lg font-large font-bold leading-6 text-gray-900"
                >
                  Event Title
                </label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="EventName"
                      id="EventName"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      value={eventData && eventData.EventName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div class="mt-5 space-y-10">
                <div class="mt-2 space-y-1">
                  <label
                    htmlFor="courseCredits"
                    class="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Event Type
                  </label>
                  <select
                    id="EventType"
                    name="EventType"
                    className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                    value={eventData && eventData.EventType}
                    onChange={handleEventTypeChange}
                  >
                    <option value="Publc">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>
              <div class="col-span-full">
                <label
                  htmlFor="about"
                  class="block text-lg font-large font-bold leading-6 text-gray-900"
                >
                  Event Description
                </label>
                <div class="mt-2">
                  <textarea
                    id="Description"
                    name="Description"
                    rows="2"
                    class="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={eventData && eventData.Description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 space-y-10">
            <div class="mt-2 space-y-1">
              <label
                htmlFor="courseCredits"
                class="block text-lg font-bold leading-6 text-gray-900"
              >
                Maximum Attendance
              </label>
              <input
                type="number"
                name="MaximumAttendance"
                placeholder="Maximum Attendance"
                value={eventData && eventData.MaximumAttendance}
                onChange={handleInputChange}
                class="border border-purple-500 rounded-md px-4 py-2 text-lg"
              />
            </div>
          </div>
          <div class="">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-2">
                <label
                  htmlFor="courseRegDeadline"
                  class="block text-lg font-large font-bold leading-6 text-gray-900"
                >
                  Event Date
                </label>
                <div class="mt-2">
                  <input
                    type="date"
                    name="EventDate"
                    id="EventDate"
                    autoComplete="courseRegDeadline"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                    value={
                      eventData && eventData.EventDate
                        ? new Date(eventData.EventDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="sm:col-span-4">
            <label
              htmlFor="username"
              class="block text-lg font-large font-bold leading-6 text-gray-900"
            >
              Location
            </label>
            <div class="mt-2">
              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="Location"
                  id="Location"
                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={eventData && eventData.Location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div></div>
          <div class="mt-10">
            <div class="space-y-6"></div>
          </div>
        </div>
      </form>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Time/Day
                      </th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day}
                          scope="col"
                          className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {hoursOfDay.map((hour) => (
                      <tr key={hour}>
                        <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {hour}
                        </td>
                        {daysOfWeek.map((day) => (
                          <td
                            key={`${day}-${hour}`}
                            className={`px-4 py-4 text-lg whitespace-nowrap cursor-pointer ${
                              timetableData[day] &&
                              timetableData[day][hour] === "Occupied"
                                ? "text-red-500"
                                : timetableData[day] &&
                                  timetableData[day][hour] === "Selected"
                                ? "text-blue-500"
                                : timetableData[day] &&
                                  timetableData[day][hour] === "CurrentOccupied"
                                ? "text-yellow-500" // Apply yellow color if the value is "CurrentOccupied"
                                : "text-green-500"
                            }`}
                            onClick={() => handleSlotClick(day, hour)}
                          >
                            {timetableData[day] && timetableData[day][hour]
                              ? timetableData[day][hour]
                              : "Available"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={handleCancel}
          class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          SAVE AND SUBMIT TO ADMIN
        </button>
      </div>
    </div>
  );
};
export default Slug;
