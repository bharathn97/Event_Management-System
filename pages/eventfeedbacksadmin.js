import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ratingMap = {
  5: "Excellent",
  4: "Good",
  3: "Average",
  2: "Fair",
  1: "Poor",
};

const EventFeedBackAdmin = () => {
  const [initialData, setInitialData] = useState([]);
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

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/EventFeedbackall`);
      const data = await response.json();
      setInitialData(data);
    } catch (error) {
      console.error("Error fetching the instructor events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getRatingLabel = (rating) => {
    return ratingMap[rating] || "Unknown";
  };

  const calculateAverageRating = (feedbackItems) => {
    let totalRating = 0;
    let totalFeedbacks = feedbackItems.length;

    feedbackItems.forEach((feedbackItem) => {
      totalRating +=
        (feedbackItem.eventOrganization +
          feedbackItem.speakerEffectiveness +
          feedbackItem.relevanceToAudience +
          feedbackItem.audienceEngagement +
          feedbackItem.overallSatisfaction) /
        5;
    });

    const averageRating =
      totalFeedbacks === 0 ? 0 : totalRating / totalFeedbacks;
    return averageRating;
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-500"></i>);
    }
    if (halfStar === 1) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-yellow-500"></i>
      );
    }

    const emptyStars = 5 - fullStars - halfStar;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>
      );
    }

    return stars;
  };

  const groupedData = initialData.reduce((acc, currentItem) => {
    if (!acc[currentItem.EventID]) {
      acc[currentItem.EventID] = [];
    }
    acc[currentItem.EventID].push(currentItem);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedData).map((eventID) => (
        <div key={eventID}>
          <h1 className="text-2xl font-semibold mb-4">
            Event Feedbacks for EventID: {eventID}
          </h1>
          <section
            key={eventID}
            className="container px-6 w-70"
            style={{ height: "400px" }}
          >
            <div className="flex flex-col mt-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Event Organisation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Speaker/Anchor Effectiveness
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Relevant To Audience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Engagement of Audience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Overall Satisfaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {groupedData[eventID].map((feedbackItem) => (
                    <tr key={feedbackItem.UserID}>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {feedbackItem.UserID}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {getRatingLabel(feedbackItem.eventOrganization)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {getRatingLabel(feedbackItem.speakerEffectiveness)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {getRatingLabel(feedbackItem.relevanceToAudience)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {getRatingLabel(feedbackItem.audienceEngagement)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {getRatingLabel(feedbackItem.overallSatisfaction)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="container px-6 w-70 mt-8">
            <div className="flex items-center">
              <div className="flex mr-4">
                {renderStarRating(calculateAverageRating(groupedData[eventID]))}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  Average Rating ({groupedData[eventID].length} Reviews)
                </p>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
};

export default EventFeedBackAdmin;
