import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
const NewEvent = () => {
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

  const [examData, setExamData] = useState({
    examName: "",
    maxMarks: "",
    weightage: "",
  });

  const [occupiedSlots, setOccupiedSlots] = useState([]);
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await fetch("/api/allcourses");
  //       const data = await response.json();
  //     } catch (error) {
  //       console.error("Error fetching courses:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  const [eventData, setEventData] = useState(initialEventData);
  const [exams, setExams] = useState([]);
  const handleAddExam = () => {
    setExams([...exams, examData]);
    setExamData({ examName: "", maxMarks: "", weightage: "" });
  };

  const handleRemoveExam = (index) => {
    const updatedExams = [...exams];
    updatedExams.splice(index, 1);
    setExams(updatedExams);
  };

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
    let data = { eventData };
    let res = await fetch("/api/newevent_admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let response = await res.json();
    setEventData(initialEventData);
    toast.success("New event sent for verification!", {
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
    setExams([]);
    setPrerequisites([]);
  };
  const handleCreditsChange = (event) => {
    const selectedCredits = event.target.value;
    setEventData((prevData) => ({
      ...prevData,
      credits: selectedCredits,
    }));
  };
  const [prerequisitesData, setPrerequisiteData] = useState({
    prerequisitesDegree: "",
    prerequisitesBranch: "",
    LectureSlots: [],
    PracticalSlots: [],
  });
  const [prerequisites, setPrerequisites] = useState([]);
  const [timetableData, setTimeTableData] = useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
  });

  const [selectedPrerequisite, setSelectedPrerequisite] = useState({
    prerequisitesDegree: "",
    prerequisitesBranch: "",
  });

  const generateTimetable = () => {
    const filteredSlots = occupiedSlots.filter(
      (slot) =>
        slot.prerequisitesDegree === selectedPrerequisite.prerequisitesDegree &&
        slot.prerequisitesBranch === department
    );
    const updatedTimetableData = {
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
    };
    filteredSlots.forEach((slot) => {
      slot.LectureSlots.forEach((lecture) => {
        if (!updatedTimetableData[lecture.day]) {
          updatedTimetableData[lecture.day] = {};
        }
        updatedTimetableData[lecture.day][lecture.time] = "Occupied";
      });
      slot.PracticalSlots.forEach((practical) => {
        if (!updatedTimetableData[practical.day]) {
          updatedTimetableData[practical.day] = {};
        }
        updatedTimetableData[practical.day][practical.time] = "Occupied";
      });
    });
    setTimeout(() => {
      setTimeTableData(updatedTimetableData);
    }, 100);
  };

  const updateTimeTable = (Slots) => {
    const currentTimetableData = { ...timetableData };

    Slots.LectureSlots.forEach((lecture) => {
      if (!currentTimetableData[lecture.day]) {
        currentTimetableData[lecture.day] = {};
      }
      currentTimetableData[lecture.day][lecture.time] = "Occupied";
    });
    Slots.PracticalSlots.forEach((practical) => {
      if (!currentTimetableData[practical.day]) {
        currentTimetableData[practical.day] = {};
      }
      currentTimetableData[practical.day][practical.time] = "Occupied";
    });

    setTimeTableData(currentTimetableData);
  };
  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, prerequisitesData]);
    setPrerequisiteData({
      prerequisitesDegree: "",
      prerequisitesBranch: department,
      LectureSlots: [],
      PracticalSlots: [],
    });
  };
  const handleRemovePrerequisite = (index) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites.splice(index, 1);
    setPrerequisites(updatedPrerequisites);
    setTimeTableData({
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
    });
  };
  const handleSlotChange = (
    prerequisiteIndex,
    slotIndex,
    slotType,
    key,
    value,
    degree,
    branch
  ) => {
    const updatedPrerequisites = [...prerequisites];
    const updatedPrerequisite = { ...updatedPrerequisites[prerequisiteIndex] };
    if (!updatedPrerequisite[slotType]) {
      updatedPrerequisite[slotType] = [];
    }
    if (!updatedPrerequisite[slotType][slotIndex]) {
      updatedPrerequisite[slotType][slotIndex] = {};
    }
    updatedPrerequisite[slotType][slotIndex][key] = value;
    updatedPrerequisites[prerequisiteIndex] = updatedPrerequisite;

    setPrerequisites(updatedPrerequisites);
  };

  const handleCheck = (prerequisite) => {
    console.log("Checking prerequisites:", prerequisite);
    let isConflict = false;
    if (prerequisite.LectureSlots) {
      console.log("Checking Lecture Slots:", prerequisite.LectureSlots);

      for (let j = 1; j < prerequisite.LectureSlots.length; j++) {
        const slot = prerequisite.LectureSlots[j];
        console.log("Checking Lecture Slot:", slot);

        if (slot.day) {
          const { day, time } = slot;
          console.log("Checking Day and Time:", day, time);

          if (timetableData[day] && timetableData[day][time] === "Occupied") {
            isConflict = true;
            break;
          }
        }
      }
    }

    if (!isConflict && prerequisite.PracticalSlots) {
      console.log("Checking Practical Slots:", prerequisite.PracticalSlots);

      for (let k = 1; k < prerequisite.PracticalSlots.length; k++) {
        const slot = prerequisite.PracticalSlots[k];
        console.log("Checking Practical Slot:", slot);

        if (slot.day) {
          const { day, time } = slot;
          console.log("Checking Day and Time:", day, time);

          if (timetableData[day] && timetableData[day][time] === "Occupied") {
            isConflict = true;
            break;
          }
        }
      }
    }

    if (isConflict) {
      alert("Error: Slots are already occupied!");
    } else {
      alert("Timetable is available. Updating timetable...");
      updateTimeTable(prerequisite);
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
      <form>
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-bold leading-7 text-black">
              Create A New Event
            </h1>
            <h2 class="mt-1 text-sm leading-6 text-gray-600">
              Create a new event as admin
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
                      value={eventData.EventName}
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
                  Event Host-Choose Already existing User's User ID to set the
                  Host
                </label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="EventHost"
                      id="EventHost"
                      class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      value={eventData.EventHost}
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
                    value={eventData.EventType}
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
                    value={eventData.Description}
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
                value={eventData.MaximumAttendance}
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
                      new Date(eventData.EventDate).toISOString().split("T")[0]
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
                  value={eventData.Location}
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
      <div class="mt-10">
        <h1 class="text-xl font-bold leading-8 text-black">
          SET THE COURSE GRADES STRUCTURE
        </h1>
        <div class="space-y-6">
          <table class="w-full border-collapse border border-purple-500 text-lg">
            <thead>
              <tr class="bg-purple-500 text-white">
                <th class="py-3 px-6 text-left">Exam Name</th>
                <th class="py-3 px-6 text-left">Max Marks</th>
                <th class="py-3 px-6 text-left">Weightage</th>
                <th class="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {exams.map((exam, index) => (
                <tr key={index} class="border-b border-purple-500">
                  <td class="py-3 px-6 text-left">{exam.examName}</td>
                  <td class="py-3 px-6 text-left">{exam.maxMarks}</td>
                  <td class="py-3 px-6 text-left">{exam.weightage}</td>
                  <td class="py-3 px-6 text-left">
                    <button
                      type="button"
                      onClick={() => handleRemoveExam(index)}
                      class="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div class="flex items-center gap-x-8 mt-4">
            <input
              type="text"
              name="examName"
              placeholder="Exam Name"
              value={examData.examName}
              onChange={(e) =>
                setExamData({ ...examData, examName: e.target.value })
              }
              class="border border-purple-500 rounded-md px-4 py-2 text-lg"
            />
            <input
              type="number"
              name="maxMarks"
              placeholder="Max Marks"
              value={examData.maxMarks}
              onChange={(e) =>
                setExamData({ ...examData, maxMarks: e.target.value })
              }
              class="border border-purple-500 rounded-md px-4 py-2 text-lg"
            />
            <input
              type="number"
              name="weightage"
              placeholder="Weightage"
              value={examData.weightage}
              onChange={(e) =>
                setExamData({ ...examData, weightage: e.target.value })
              }
              class="border border-purple-500 rounded-md px-4 py-2 text-lg"
            />
            <button
              type="button"
              onClick={handleAddExam}
              class="bg-indigo-600 text-white px-6 py-2 rounded-md text-lg"
            >
              Add Exam
            </button>
          </div>
        </div>
      </div>

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
export default NewEvent;
