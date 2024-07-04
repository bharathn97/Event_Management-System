import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const TicketTypes = ["VIP", "VVIP", "Normal", "Premium", "Economy"]; // Types of tickets

const BoughtTicketModal = ({
  ticketType,
  ticketPrice,
  closeModal1,
  handleRemoveTicket,
  boughtseat,
  updateSeatingDetails,
}) => {
  const [newTicketType, setNewTicketType] = useState(ticketType);
  const [newTicketPrice, setNewTicketPrice] = useState(ticketPrice);

  const handleUpdateDetails = () => {
    updateSeatingDetails(newTicketType, newTicketPrice);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Ticket Details
        </h2>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Type:</strong>{" "}
            <select
              value={newTicketType}
              onChange={(e) => setNewTicketType(e.target.value)}
            >
              {TicketTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </p>
          <p className="text-lg">
            <strong>Price:</strong>{" "}
            <input
              type="text"
              value={newTicketPrice}
              onChange={(e) => setNewTicketPrice(e.target.value)}
            />
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
            onClick={handleUpdateDetails}
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Update Details
          </button>
          <button
            onClick={() => {
              if (boughtseat) {
                alert("Already Bought, cannot remove ticket.");
              } else {
                if (
                  window.confirm("Are you sure you want to remove your ticket")
                ) {
                  handleRemoveTicket();
                }
              }
            }}
            className="ml-4 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {boughtseat ? "Already Bought" : "Remove Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SeatingMatrix = () => {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketType, setTicketType] = useState(""); // State to hold current ticket type
  const [ticketPrice, setTicketPrice] = useState(""); // State to hold current ticket price
  const [tickets, setTickets] = useState([]);
  const [fetchedSeats, setFetchedSeats] = useState([]);
  const [deleteSeat, setDeletedSeat] = useState([]); // State to hold all created tickets
  const { EventID } = router.query;
  const [boughtseat, setBought] = useState(null);
  const [previousSelectedSeats, setPreviousSelectedSeats] = useState([]);
  const handleSeatClick = (row, seat) => {
    const newSelection = { row, seat };
    const isSelected = isSelectedSeat(newSelection);

    // Find the fetched seat object
    const fetchedSeat = fetchedSeats.find(
      (fetchedSeat) =>
        fetchedSeat.RowNumber === convertRowToNumber(row) &&
        fetchedSeat.ColumnNumber === seat + 1
    );

    if (fetchedSeat) {
      if (fetchedSeat.UserID != null) {
        toast.error(`Ticket already booked by someone you cannot edit this!`, {
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
      setDeletedSeat(fetchedSeat);
      console.log(fetchedSeat + "hyvusadiuasbdib");
      setTicketType(fetchedSeat.TicketType);
      setTicketPrice(fetchedSeat.Price);
      setBought(fetchedSeat.UserID);
      setShowUserDetails(true); // Show the modal
    } else {
      if (!isSelected) {
        setSelectedSeats((prevSelectedSeats) => [
          ...prevSelectedSeats,
          newSelection,
        ]);
      } else {
        // If the seat is already selected, deselect it
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.filter(
            (selectedSeat) =>
              selectedSeat.row !== row || selectedSeat.seat !== seat
          )
        );
      }
    }
  };

  const [showUserDetails, setShowUserDetails] = useState(false);

  const closeModal1 = () => {
    setShowUserDetails(false);
  };
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

  const handleAssignTickets = () => {
    if (ticketType && ticketPrice && selectedSeats.length > 0) {
      const newTicket = {
        id: Date.now(),
        type: ticketType,
        price: ticketPrice,
        seats: selectedSeats,
      };
      setTickets((prevTickets) => [...prevTickets, newTicket]);
      setPreviousSelectedSeats((prevPreviousSelectedSeats) => [
        ...prevPreviousSelectedSeats,
        ...selectedSeats,
      ]);
      setSelectedSeats([]);
    }
  };

  const handleDeleteTicket = (ticketId) => {
    // Find the index of the ticket to delete
    const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId);

    if (ticketIndex !== -1) {
      // Remove the ticket at the found index from the tickets state
      const updatedTickets = [...tickets];
      updatedTickets.splice(ticketIndex, 1);
      setTickets(updatedTickets);

      // Remove the seats associated with the deleted ticket from selectedSeats
      const ticketToDelete = tickets[ticketIndex];
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter(
          (selectedSeat) =>
            !ticketToDelete.seats.find(
              (assignedSeat) =>
                assignedSeat.row === selectedSeat.row &&
                assignedSeat.seat === selectedSeat.seat
            )
        )
      );
    }
  };

  const handleSelectAllSeats = () => {
    const allSeats = [];
    // Generate all seat combinations
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].forEach((row) => {
      [...Array(20).keys()].forEach((seat) => {
        allSeats.push({ row, seat });
      });
    });
    setSelectedSeats(allSeats);
  };

  const handleClearAllSeats = () => {
    setSelectedSeats([]); // Clear all selected seats
  };

  const isSelectedSeat = (seat) => {
    return selectedSeats.some(
      (selectedSeat) =>
        selectedSeat.row === seat.row && selectedSeat.seat === seat.seat
    );
  };

  const isSeatLocked = (row, seat) => {
    return tickets.some((ticket) =>
      ticket.seats.some(
        (assignedSeat) => assignedSeat.row === row && assignedSeat.seat === seat
      )
    );
  };

  const convertRowToNumber = (rowLetter) => {
    // Convert row letter to uppercase and get its char code
    const charCode = rowLetter.toUpperCase().charCodeAt(0);
    // Subtract char code of 'A' and add 1 to get the row number
    return charCode - 64;
  };

  const handleUpdateSeatDetails = async (newTicketType, newTicketPrice) => {
    try {
      const updatedSeat = {
        ...deleteSeat,
        TicketType: newTicketType,
        Price: newTicketPrice,
      };
      console.log(
        updatedSeat.TicketType +
          "   " +
          updatedSeat.Price +
          "  " +
          updatedSeat.RowNumber +
          " " +
          updatedSeat.ColumnNumber
      );

      // Make API call to update seating details
      const response = await fetch("/api/updateSeatDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSeat),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          console.log("Seating details updated successfully!");
          setShowUserDetails(false); // Close modal
        } else {
          console.error(
            "Failed to update seating details:",
            data.message || "Unknown error"
          );
        }
      } else {
        console.error("Failed to update seating details:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating seating details:", error.message);
    }
  };

  const handleUpdateSeatingDetails = async () => {
    try {
      const seatsData = previousSelectedSeats.map((seat) => ({
        RowNumber: convertRowToNumber(seat.row),
        ColumnNumber: seat.seat + 1,
        Price: ticketPrice,
        TicketType: ticketType,
        EventID: EventID,
      }));
      console.log(seatsData + "hey");

      const response = await fetch("/api/createseats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seatsData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          console.log("Seats created successfully!");
          setSelectedSeats([]); // Clear all selected seats
        } else {
          console.error(
            "Failed to create seats:",
            data.message || "Unknown error"
          );
        }
      } else {
        console.error("Failed to create seats:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating seats:", error.message);
    }
  };
  const renderLegend = () => (
    <div className="mt-4 flex items-center justify-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
        <span>Seats Not Yet Assigned</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <span>Assigned Seats</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <span>Selected Seats</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <span>Seats Already Booked!</span>
      </div>
    </div>
  );
  const handleRemoveTicket = async () => {
    try {
      console.log(deleteSeat.Price + deleteSeat.TicketType + "Delete Seat");
      const response = await fetch(`/api/removeticketseat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteSeat),
      });

      if (response.ok && response.status === 200) {
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
                  const isLocked = isSeatLocked(row, seat); // Adjust seat number by adding 1
                  const isSelected = isSelectedSeat({ row, seat });
                  const isFetched = fetchedSeats.some(
                    (fetchedSeat) =>
                      fetchedSeat.RowNumber === convertRowToNumber(row) &&
                      fetchedSeat.ColumnNumber === seat + 1
                  );
                  const isBooked = fetchedSeats.some(
                    (fetchedSeat) =>
                      fetchedSeat.RowNumber === convertRowToNumber(row) &&
                      fetchedSeat.ColumnNumber === seat + 1 &&
                      fetchedSeat.UserID != null
                  );

                  let backgroundColor = "";
                  if (isLocked) {
                    backgroundColor = "bg-red-500";
                  } else if (isSelected) {
                    backgroundColor = "bg-green-500";
                  } else {
                    backgroundColor = "bg-blue-700";
                  }

                  if (isBooked && isFetched) {
                    backgroundColor = "bg-yellow-500";
                  }
                  if (!isBooked && isFetched) {
                    backgroundColor = "bg-red-500";
                  }

                  return (
                    <td
                      key={seat}
                      className={`border border-gray-200 p-2 cursor-pointer ${backgroundColor}`}
                      onClick={() => handleSeatClick(row, seat)}
                    >
                      {seat + 1}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <label className="text-lg font-normal mr-2">Ticket Type:</label>
          <select
            className="px-4 py-2 border rounded-md"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          >
            <option value="">Select Ticket Type</option>
            {TicketTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label className="text-lg font-normal mr-2">Ticket Price:</label>
          <input
            className="px-4 py-2 border rounded-md"
            type="text"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
          />
        </div>
        <button
          className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded"
          onClick={handleAssignTickets}
        >
          Assign Tickets
        </button>
      </div>

      {/* Select All Seats and Clear All Seats Buttons */}
      <div className="flex justify-center mb-4">
        <button
          className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded mr-4"
          onClick={handleSelectAllSeats}
        >
          Select All Seats
        </button>
        <button
          className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
          onClick={handleClearAllSeats}
        >
          Clear All Seats
        </button>
      </div>

      {/* Display Tickets as Cards */}
      <div className="flex flex-wrap justify-start">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-gray-100 border border-gray-200 rounded-md p-4 m-2 flex flex-col"
          >
            <h3 className="text-lg font-semibold">{ticket.type}</h3>
            <p className="text-gray-600">Price: ${ticket.price}</p>
            <p className="text-gray-600">
              Seats:{" "}
              {ticket.seats
                .map((seat) => `${seat.row}${seat.seat + 1}`)
                .join(", ")}
            </p>
            <button
              className="text-white bg-red-500 border-0 py-2 px-4 mt-2 focus:outline-none hover:bg-red-600 rounded"
              onClick={() => handleDeleteTicket(ticket.id)}
            >
              Delete Ticket
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded"
          onClick={handleUpdateSeatingDetails}
        >
          Update Seating Details
        </button>
      </div>

      {showUserDetails && (
        <BoughtTicketModal
          ticketType={ticketType}
          ticketPrice={ticketPrice}
          closeModal1={closeModal1}
          handleRemoveTicket={handleRemoveTicket}
          boughtseat={boughtseat}
          updateSeatingDetails={handleUpdateSeatDetails}
        />
      )}
      {renderLegend()}
    </div>
  );
};

export default SeatingMatrix;
