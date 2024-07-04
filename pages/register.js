import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const TicketDetailsModal = ({
  ticketType,
  ticketPrice,
  closeModal,
  BuyTicket,
}) => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Ticket Details
      </h2>
      <div className="mb-4">
        <p className="text-lg">
          <strong>Type:</strong> {ticketType}
        </p>
        <p className="text-lg">
          <strong>Price:</strong> {ticketPrice}
        </p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={closeModal}
          className="mr-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Close
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to buy this ticket?")) {
              BuyTicket(ticketPrice);
            }
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Buy Ticket
        </button>
      </div>
    </div>
  </div>
);

const BoughtTicketModal = ({
  ticketType,
  ticketPrice,
  closeModal1,
  handleRemoveTicket,
}) => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Ticket Details
      </h2>
      <div className="mb-4">
        <p className="text-lg">
          <strong>Type:</strong> {ticketType}
        </p>
        <p className="text-lg">
          <strong>Price:</strong> {ticketPrice}
        </p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={closeModal1}
          className="mr-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Close
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to remove your ticket")) {
              handleRemoveTicket(ticketPrice);
            }
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Remove Ticket
        </button>
      </div>
    </div>
  </div>
);

const Register = () => {
  const router = useRouter();
  const [newSeat, setNewSeat] = useState({ RowNumber: "", ColumnNumber: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSeat({
      ...newSeat,
      [name]: value,
    });
  };
  const isValidSeat = (row, seat) => {
    // Check if row is a single uppercase letter (A-Z)
    const rowRegex = /^[A-Z]$/;
    const validRow = rowRegex.test(row);

    // Check if seat is a positive integer
    const seatRegex = /^[1-9]\d*$/;
    const validSeat = seatRegex.test(seat);

    return validRow && validSeat;
  };

  const handleAddSeat = (e) => {
    e.preventDefault();

    // Extract row and seat from the newSeat state
    const { RowNumber, ColumnNumber } = newSeat;

    // Check if the seat is within the valid range
    if (!isValidSeat(RowNumber, ColumnNumber)) {
      toast.error("Invalid seat number. Please enter a valid seat.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Check if the seat is already in the waiting list
    if (
      waitingListData.some(
        (item) =>
          item.RowNumber === RowNumber && item.ColumnNumber === ColumnNumber
      )
    ) {
      toast.warn(
        "Seat already in the waiting list. Please book another seat.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }

    // Check if the seat is available in the 2D matrix
    const seatInfo = fetchedSeats.find(
      (ticket) =>
        ticket.RowNumber === convertRowToNumber(RowNumber) &&
        ticket.ColumnNumber === parseInt(ColumnNumber)
    );

    if (seatInfo) {
      if (seatInfo.UserID == UserID) {
        toast.error("You have already bought this seat!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (seatInfo.UserID == null) {
        toast.error("Seat already available,you can directly buy the seat!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Seat is available
        setWaitingListData([...waitingListData, newSeat]);
        setNewSeat({ RowNumber: "", ColumnNumber: "" }); // Clear input fields
        toast.success("Seat added to waiting list successfully.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      // Seat is occupied
      toast.error(
        "No Data available for this seat.Cannot add the seat to the Waiting List!",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };
  const handleApplyWaitingList = async (e) => {
    e.preventDefault();
    console.log(waitingListData + "abgdsjinbsajd");
    try {
      const response = await fetch(
        `/api/waitingList?UserID=${UserID}&EventID=${EventID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(waitingListData),
        }
      );

      if (response.ok) {
        console.log("Waiting list application submitted successfully!");
        toast.success("Waiting List updated successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.error(
          "Failed to submit waiting list application:",
          response.statusText
        );
        // Add error handling logic here if needed
      }
    } catch (error) {
      console.error(
        "Error submitting waiting list application:",
        error.message
      );
      // Add error handling logic here if needed
    }
  };

  const handleRemoveSeat = (index) => {
    const newList = [...waitingListData];
    newList.splice(index, 1);
    setWaitingListData(newList);
  };
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketType, setTicketType] = useState(""); // State to hold current ticket type
  const [ticketPrice, setTicketPrice] = useState(""); // State to hold current ticket price
  const [tickets, setTickets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [fetchedSeats, setFetchedSeats] = useState([]); // State to hold all fetched seats
  const [showTicketDetails, setShowTicketDetails] = useState(false); // State to show/hide modal
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [revenue, setRevenue] = useState(0); // State to show/hide modal
  const { EventID, UserID } = router.query;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/userdetails?UserID=${UserID}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            setBalance(data.user.balance);
          }
        } else {
          console.error("Failed to fetch selected seats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching selected seats:", error.message);
      }
    };

    fetchBalance();
  }, [UserID]);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`/api/oneevent?EventID=${EventID}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setRevenue(data.CurrentRevenue);
          }
        } else {
          console.error("Failed to fetch selected seats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching selected seats:", error.message);
      }
    };

    fetchRevenue();
  }, [EventID]);
  useEffect(() => {
    const fetchSelectedSeats = async () => {
      try {
        const response = await fetch(`/api/fetchSeats?EventID=${EventID}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            setFetchedSeats(data.seats);
          }
        } else {
          console.error("Failed to fetch selected seats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching selected seats:", error.message);
      }
    };

    fetchSelectedSeats();
  }, [EventID]);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      try {
        const response = await fetch(`/api/eventslots?EventID=${EventID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch occupied slots");
        }
        const data = await response.json();
        console.log(data.timetableEntries);
        setOccupiedSlots(data.timetableEntries);
      } catch (error) {
        console.error("Error fetching occupied slots:", error);
        // Handle error (e.g., show error message to user)
      }
    };
    fetchOccupiedSlots();
  }, [EventID]);
  const [waitingListData, setWaitingListData] = useState([]);
  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const response = await fetch(`/api/fetchwaitingList?UserID=${UserID}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            setWaitingListData(data.seats);
          }
        } else {
          console.error("Failed to fetch selected seats:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching selected seats:", error.message);
      }
    };

    fetchWaitingList();
  }, [EventID]);

  const handleSeatClick = (row, seat) => {
    const selectedSeat = { row, seat };
    const isLocked = isSeatLocked(row, seat);

    if (!isLocked) {
      const selectedTicket = fetchedSeats.find(
        (ticket) =>
          ticket.RowNumber === convertRowToNumber(row) &&
          ticket.ColumnNumber === seat
      );

      if (selectedTicket) {
        setTicketType(selectedTicket.TicketType);
        setTicketPrice(selectedTicket.Price);
        setSelectedSeats([selectedSeat]);
        setShowTicketDetails(true); // Available
        setShowUserDetails(false);
      }
    } else {
      setShowTicketDetails(false);
      const selectedTicket = fetchedSeats.find(
        (ticket) =>
          ticket.RowNumber === convertRowToNumber(row) &&
          ticket.ColumnNumber === seat
      );
      if (selectedTicket) {
        setTicketType(selectedTicket.TicketType);
        setTicketPrice(selectedTicket.Price);
      }
      setSelectedSeats([selectedSeat]);
      if (selectedTicket && selectedTicket.UserID === parseInt(UserID)) {
        setShowUserDetails(true); // Booked by the current user
      }
    }
  };

  const closeModal = () => {
    setShowTicketDetails(false);
  };
  const closeModal1 = () => {
    setShowUserDetails(false);
  };
  const checkSeatAvailability = async (
    fetchedSeats,
    EventID,
    waitingListData
  ) => {
    // Loop through fetched seats and check for availability
    for (const seat of fetchedSeats) {
      const match = waitingListData.find(
        (existingSeat) =>
          existingSeat.RowNumber === seat.RowNumber &&
          existingSeat.ColumnNumber === seat.ColumnNumber &&
          existingSeat.EventID === seat.EventID &&
          seat.UserID == null
      );

      if (match) {
        toast.success(
          `Seat at Row ${seat.RowNumber}, Column ${seat.ColumnNumber} is available for you to buy now!`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    }
  };
  useEffect(() => {
    checkSeatAvailability(fetchedSeats, EventID, waitingListData);
  }, [fetchedSeats, EventID, waitingListData]);
  const renderLegend = () => (
    <div className="mt-4 flex items-center justify-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
        <span>Seats Not Available for Booking</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <span>Occupied Seats</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <span>Available Seats</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <span>Seats Booked by You</span>
      </div>
    </div>
  );
  const BuyTicket = async (Price) => {
    console.log("aubjdfsoiadnadson");
    if (Price > balance) {
      toast.error(`Not enough account balance!`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      console.log(selectedSeats[0].row);
      const response = await fetch(`/api/buyticket?UserID=${UserID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seat: selectedSeats[0] }), // Assuming only one seat is selected
      });

      if (response.ok && response.status === 200) {
        const updatebalance = balance - parseInt(Price);
        const updaterevenue = parseInt(revenue) + parseInt(Price);
        const response1 = await fetch(
          `/api/reducebalance?UserID=${UserID}&EventID=${EventID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatebalance, updaterevenue }),
          }
        );
        if (response1.ok) {
          console.log("Ticket bought successfully!");
          toast.success(`Ticket bought successfully!`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          window.location.reload();
        }
      } else {
        // Handle error
        console.error("Failed to buy ticket:", response.statusText);
      }
    } catch (error) {
      console.error("Error buying ticket:", error.message);
    }
  };

  const isSeatLocked = (row, seat) => {
    const seatInfo = fetchedSeats.find(
      (ticket) =>
        ticket.RowNumber === convertRowToNumber(row) &&
        ticket.ColumnNumber === seat
    );

    if (!seatInfo) {
      return false;
    }

    if (seatInfo.UserID === null) {
      return false;
    }

    return true;
  };

  const convertRowToNumber = (rowLetter) => {
    const charCode = rowLetter.toUpperCase().charCodeAt(0);
    return charCode - 64;
  };

  const handleRemoveTicket = async (Price) => {
    try {
      const response = await fetch(`/api/removeticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seat: selectedSeats[0] }),
      });

      if (response.ok && response.status === 200) {
        console.log("Price" + Price + "balance" + balance);
        const updatebalance = parseInt(balance) + parseInt(Price);
        const updaterevenue = parseInt(revenue) - parseInt(Price);
        console.log(updatebalance + "hsadbik");
        const response1 = await fetch(
          `/api/reducebalance?UserID=${UserID}&EventID=${EventID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatebalance, updaterevenue }),
          }
        );
        if (response1.ok) {
          console.log("Ticket removed successfully!");
          toast.success(`Ticket removed successfully!`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          window.location.reload();
        }
      } else {
        console.error("Failed to remove ticket:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing ticket:", error.message);
    }
  };

  return (
    <div className="container mx-auto">
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
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-200 bg-blue-900 text-white w-full">
          <thead>
            <tr>
              <th className="border border-gray-200"></th>
              {[...Array(20).keys()].map((num) => (
                <th key={num} className="border border-gray-200 text-white">
                  {num + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((row) => (
              <tr key={row}>
                <td className="border border-gray-200 text-white">{row}</td>
                {[...Array(20).keys()].map((seat) => {
                  const isLocked = isSeatLocked(row, seat + 1); // Adjust seat number by adding 1
                  const hasData = fetchedSeats.some(
                    (ticket) =>
                      ticket.RowNumber === convertRowToNumber(row) &&
                      ticket.ColumnNumber === seat + 1 // Adjust seat number by adding 1
                  );
                  const backgroundColor = !hasData
                    ? "bg-blue-700" // Blue for seats with no data
                    : fetchedSeats.find(
                        (ticket) =>
                          ticket.RowNumber === convertRowToNumber(row) &&
                          ticket.ColumnNumber === seat + 1
                      ).UserID === null
                    ? "bg-green-500" // Green for available seats
                    : fetchedSeats.find(
                        (ticket) =>
                          ticket.RowNumber === convertRowToNumber(row) &&
                          ticket.ColumnNumber === seat + 1
                      ).UserID == parseInt(UserID)
                    ? "bg-yellow-500" // Yellow for seats booked by the current user
                    : "bg-red-500"; // Red for seats booked by other users

                  return (
                    <td
                      key={seat}
                      className={`border border-gray-200 p-2 cursor-pointer ${backgroundColor}`}
                      onClick={() => handleSeatClick(row, seat + 1)} // Adjust seat number by adding 1
                    >
                      {seat + 1} {/* Adjust seat number by adding 1 */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTicketDetails && (
        <TicketDetailsModal
          ticketType={ticketType}
          ticketPrice={ticketPrice}
          closeModal={closeModal}
          BuyTicket={BuyTicket}
        />
      )}
      {showUserDetails && (
        <BoughtTicketModal
          ticketType={ticketType}
          ticketPrice={ticketPrice}
          closeModal1={closeModal1}
          handleRemoveTicket={handleRemoveTicket}
        />
      )}

      {renderLegend()}
      <div className="mt-4 flex flex-wrap space-x-4">
        <div className="w-full md:w-1/2">
          <h3 className="mb-2 text-lg font-semibold">
            Time Table for the Event
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-200 w-full">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border border-gray-100 px-4 py-2">Day</th>
                  <th className="border border-gray-100 px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {occupiedSlots.map((slot, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-blue-900 text-white"
                        : "bg-blue-800 text-white"
                    }
                  >
                    <td className="border border-gray-100 px-4 py-2">
                      {slot.DayOfWeek}
                    </td>
                    <td className="border border-gray-100 px-4 py-2">
                      {slot.TimeSlot}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <form
            onSubmit={handleAddSeat}
            className="mt-4 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-2">
              <label htmlFor="row">Row Number:</label>
              <input
                type="text"
                id="row"
                name="RowNumber"
                value={newSeat.RowNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="seat">Column Number:</label>
              <input
                type="text"
                id="seat"
                name="ColumnNumber"
                value={newSeat.ColumnNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <button
              type="submit"
              className="w-30 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add Seat to Waiting List
            </button>
          </form>

          <div className="mt-4">
            <h3 className="mb-2">Waiting List:</h3>
            <ul className="flex flex-wrap space-x-4">
              {waitingListData.map((seat, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex flex-col mr-2">
                    <span className="font-bold">Row:</span>
                    <span>{seat.RowNumber}</span>
                  </div>
                  <div className="flex flex-col mr-2">
                    <span className="font-bold">Column:</span>
                    <span>{seat.ColumnNumber}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSeat(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <button
              onClick={handleApplyWaitingList}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Update Waiting List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
