import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import the useRouter hook
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
require("dotenv").config();

export default function Home({ user, setUser }) {
  const [userType, setUserType] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      toast.error("Invalid email format!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    let data = { email, password };
    try {
      let res;
      if (userType === "user") {
        res = await fetch("/api/user_login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else if (userType === "admin") {
        res = await fetch("/api/admin_login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }
      let response = await res.json();
      setEmail("");
      setPassword("");
      if (response.success) {
        console.log(
          `Logging in as ${userType} with email: ${email} and password: ${password}`
        );
        localStorage.setItem("token", response.token);
        toast.success(`You are successfully logged in as ${userType}!`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (userType) {
          await setTimeout(() => {
            if (userType === "admin") {
              router.push({
                pathname: "/admin",
                query: { email: response.admin.email },
              });
            } else if (userType === "user") {
              router.push({
                pathname: "/user",
                query: { userID: response.user.id },
              });
            }
          }, 2000);
        }
      } else {
        toast.error("Invalid credentials!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      toast.error("Invalid email format!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (userType === "admin") {
      if (!email || !password || !name) {
        toast.error("Please fill in all the required details.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
    } else if (userType === "user") {
      if (!email || !password || !name || !phoneNumber) {
        toast.error("Please fill in all the required details.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
    }
    let data = { email, password, name, phoneNumber };
    console.log(
      data.email +
        " " +
        data.password +
        " " +
        data.name +
        " " +
        data.phoneNumber +
        " " +
        userType
    );
    try {
      let res;

      if (userType === "user") {
        res = await fetch("/api/user_registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else if (userType === "admin") {
        res = await fetch("/api/admin_registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      let response = await res.json();
      console.log(response + " " + response.success);
      setEmail("");
      setName("");
      setPassword("");
      setPhoneNumber("");

      if (response.success) {
        localStorage.setItem("token", response.token); //Put Token to local storage which is required to be usd later for user authentication
        localStorage.setItem("email", response.email);
        toast.success(`Your Account has been created as a ${userType}!`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (userType === "admin") {
          router.push("/");
        } else if (userType === "user") {
          router.push("/");
        }
      } else {
        toast.error("Signup failed. Please try again.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  const handleUserTypeSelect = (selectedUserType) => {
    setUserType(selectedUserType);
  };
  const handleGoBack = () => {
    setUserType("");
    setIsSignUp(false);
    setEmail("");
    setPassword("");
    setName("");
    setPhoneNumber("");
  };

  return (
    <main className="flex items-center justify-center h-screen">
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
      {userType ? (
        <div className="border p-8 rounded-md shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </h1>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4"
          />
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4"
          />
          {isSignUp && (
            <>
              {userType === "admin" && (
                <>
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                </>
              )}
              {userType === "user" && (
                <>
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                  <label className="block mb-1">PhoneNo:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                </>
              )}
            </>
          )}

          {isSignUp ? (
            <button
              onClick={handleSignUp}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-indigo-600 text-white p-2 rounded cursor-pointer hover:bg-indigo-700"
            >
              Sign in
            </button>
          )}
          <button
            onClick={handleGoBack}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Go back to user selection
          </button>
        </div>
      ) : (
        <div className="border p-8 rounded-md shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Select User Type</h1>
          <div className="flex justify-between">
            <button
              onClick={() => handleUserTypeSelect("admin")}
              className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-700"
            >
              Admin
            </button>
            <button
              onClick={() => handleUserTypeSelect("user")}
              className="bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-700"
            >
              User
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      )}
    </main>
  );
}
