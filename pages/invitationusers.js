import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const InvitationUser = () => {
  const router = useRouter();
  const [usersData, setUsersData] = useState([]);
  const { EventID, UserID } = router.query;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/allusers");
        const data = await response.json();
        setUsersData(data.filter((user) => user.id !== parseInt(UserID)));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (EventID && UserID) {
      fetchUsers();
    }
  }, [EventID, UserID]);

  const handleInvite = async (userId) => {
    const shouldInvite = window.confirm("Invite this user to the event?");
    if (!shouldInvite) {
      return;
    }
    try {
      const res = await fetch("/api/inviteusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EventID: EventID,
          UserID: userId,
        }),
      });
      const data = await res.json();
      if (data.success === true && res.ok) {
        toast.success("Invitation sent successfully!");
      } else if (data.success === false && res.ok) {
        toast.error("Invitation already sent to this user");
      } else {
        toast.error("Failed to send invitation.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation.");
    }
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="flex items-center gap-x-3">
        <h1 className="text-lg font-medium text-gray-800 dark:text-black">
          Send Invitations to Users if the Event is Private
        </h1>
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
                      <div className="flex items-center gap-x-3">
                        <span>Name</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <button className="flex items-center gap-x-2">
                        <span>Phone Number</span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Email address
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Send Invitation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {usersData.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white">
                                {user.name}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1  gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          <h2 className="text-sm font-normal text-emerald-500">
                            {user.phoneNumber}
                          </h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-2">
                          <button
                            className="px-3 py-2 text-s text-indigo-500 dark:bg-gray-800 bg-indigo-100/60"
                            onClick={() => handleInvite(user.id)}
                          >
                            Send Invitation
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
      <ToastContainer position="bottom-right" />
    </section>
  );
};

export default InvitationUser;
