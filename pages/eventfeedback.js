import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const initialFeedbackData = {
  eventOrganization: "How well was the event organized?",
  speakerEffectiveness: "Rate the effectiveness of the speakers/presenters.",
  relevanceToAudience: "How relevant was the event content to you?",
  audienceEngagement: "How engaged were the attendees during the event?",
  overallSatisfaction: "Rate your overall satisfaction with the event.",
};

const options = ["Excellent", "Good", "Average", "Fair", "Poor"];

const EventFeedback = () => {
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

  const { EventID, UserID } = router.query;

  const [feedback, setFeedback] = useState(
    Object.fromEntries(
      Object.keys(initialFeedbackData).map((key) => [key, null])
    )
  );

  const handleFeedbackChange = (question, value) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [question]: value,
    }));
  };

  const submitFeedback = async () => {
    try {
      const shouldUpdate = window.confirm(
        "Are you sure with the event feedback?"
      );
      if (!shouldUpdate) {
        return;
      }

      console.log(feedback);
      console.log(EventID);

      const response = await fetch(
        `/api/eventfeedback?EventID=${EventID}&UserID=${UserID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success === true) {
        toast.success(
          `Event Feedback for Event ${EventID} Submitted Successfully!`,
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

        console.log("Feedback submitted successfully");
      } else if (response.ok && data.success === false) {
        toast.error(`Feedback already exists for this user and event`, {
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
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
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
      <div className="space-y-4 ">
        <h1 className="text-base font-bold leading-7 text-black text-4xl">
          EVENT FEEDBACK
        </h1>
        <section className="container px-2 mx-auto w-9/10">
          <div className="flex flex-col">
            <div className="-mx-2 -my-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
              <div className="inline-block w-full py-2 align-middle md:px-4 lg:px-6">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <form>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="py-3.5 px-2 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            Question
                          </th>
                          {options.map((option, index) => (
                            <th
                              key={index}
                              className="py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              {option}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                        {Object.entries(initialFeedbackData).map(
                          ([key, question], index) => (
                            <tr key={index}>
                              <td className="px-2 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                                {question}
                              </td>
                              {options.map((option, optionIndex) => (
                                <td
                                  key={optionIndex}
                                  className="px-2 py-4 text-sm whitespace-nowrap"
                                >
                                  <input
                                    type="radio"
                                    name={key}
                                    value={options.length - optionIndex}
                                    onChange={() =>
                                      handleFeedbackChange(
                                        key,
                                        options.length - optionIndex
                                      )
                                    }
                                    checked={
                                      feedback[key] ===
                                      options.length - optionIndex
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </form>
                  <div className="px-4 py-2 my-6" colspan="6">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      type="button"
                      onClick={submitFeedback}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventFeedback;
