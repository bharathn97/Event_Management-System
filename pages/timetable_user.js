import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const TimeTableUser = () => {
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
  const [slots, setSlots] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (UserID) {
          const responseOccupiedSlots = await fetch(
            `/api/occupiedSlots?UserID=${UserID}`
          );
          const dataOccupiedSlots = await responseOccupiedSlots.json();

          const responseAttendingSlots = await fetch(
            `/api/attendingslots?UserID=${UserID}`
          );
          const dataAttendingSlots = await responseAttendingSlots.json();

          // Merge the results from both API calls
          const mergedSlots = [
            ...dataOccupiedSlots.timetableEntries.map((entry) => ({
              ...entry,
              source: "Hosting Event",
            })),
            ...dataAttendingSlots.eventTimeTableEntries.map((entry) => ({
              ...entry,
              source: "Attending Event",
            })),
          ];

          setSlots(mergedSlots);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [UserID]);

  const [timetableData, setTimeTableData] = useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
    Sat: {},
    Sun: {},
  });
  useEffect(() => {
    try {
      if (slots) {
        const updatedTimetableData = {
          Mon: { ...timetableData.Mon },
          Tue: { ...timetableData.Tue },
          Wed: { ...timetableData.Wed },
          Thu: { ...timetableData.Thu },
          Fri: { ...timetableData.Fri },
          Sat: { ...timetableData.Sat },
          Sun: { ...timetableData.Sun },
        };

        slots.forEach((slot) => {
          const { DayOfWeek, TimeSlot, EventID, source } = slot;

          // Ensure timetableData[DayOfWeek][TimeSlot] is always an array
          if (!updatedTimetableData[DayOfWeek][TimeSlot]) {
            updatedTimetableData[DayOfWeek][TimeSlot] = [];
          }

          // Push the entry to the array
          updatedTimetableData[DayOfWeek][TimeSlot].push({ EventID, source });
        });

        setTimeTableData(updatedTimetableData);
      }
    } catch (error) {
      console.log(error);
      console.log("Error in updating the time table");
    }
  }, [slots]);

  return (
    <div>
      <section className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-black">
            My Time Table
          </h1>
        </div>
        <div class="flex flex-col mt-6">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200"
                      >
                        Day
                      </th>
                      {[
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
                      ].map((timeSlot) => (
                        <th
                          scope="col"
                          class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200"
                          key={timeSlot}
                        >
                          {timeSlot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {Object.keys(timetableData).map((day) => (
                      <tr
                        key={day}
                        className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                      >
                        <td class="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200">
                          {day}
                        </td>
                        {[
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
                        ].map((timeSlot) => (
                          <td
                            key={timeSlot}
                            className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                          >
                            {timetableData[day][timeSlot] &&
                              timetableData[day][timeSlot].length > 0 &&
                              timetableData[day][timeSlot]
                                .filter(
                                  (entry, index, self) =>
                                    index ===
                                    self.findIndex(
                                      (e) =>
                                        e.EventID === entry.EventID &&
                                        e.source === entry.source
                                    )
                                )
                                .map((entry, index) => (
                                  <div key={index}>
                                    <div>{entry.EventID}</div>
                                    <div>{entry.source}</div>
                                  </div>
                                ))}
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
        <Link href={`/user?userID=${UserID}`}>
          <div class="flex">
            <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">
              DashBoard
            </button>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default TimeTableUser;
