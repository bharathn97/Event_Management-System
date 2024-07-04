import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
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

  const { UserID, slug } = router.query;
  const initialEventData = {
    EventName: "",
    EventHost: "",
    Description: "",
    EventDate: null,
    EventType: "Public",
    MaximumAttendance: 0,
    CurrentRevenue: 0,
    Location: "",
  };
  const [eventData, setEventData] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/oneevent?EventID=${slug}`);
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchEvents();
  }, [slug]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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
              Update the event
            </h1>
            <h2 class="mt-1 text-sm leading-6 text-gray-600">
              Update the Event as ADMIN
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
              <div class="sm:col-span-4">
                <label
                  htmlFor="username"
                  class="block text-lg font-large font-bold leading-6 text-gray-900"
                >
                  Event Host-Please Select the User ID of the user You want to
                  host the event
                </label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="EventName"
                      id="EventName"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      value={eventData && eventData.EventHost}
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
