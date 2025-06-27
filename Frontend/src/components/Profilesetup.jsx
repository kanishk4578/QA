import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/userdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(res.data);
      if (res.data.profileImage) {
        setProfilePic(res.data.profileImage);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/upload-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfilePic(res.data.user.profileImage);
      setUserData(res.data.user);
      navigate("/profile");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#7b66ff_0%,_#a08eff_50%,_#d6ccff_100%)] flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Profile Setup</h2>

        <div
          onClick={handleIconClick}
          className="cursor-pointer mx-auto w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow-md hover:opacity-80 transition duration-300"
        >
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {userData && (
          <p className="mt-6 text-lg text-gray-700 font-medium">
            Hello, <span className="text-blue-600">{userData.name || userData.email}</span>
          </p>
        )}

        <p className="mt-2 text-sm text-gray-500">Click the image to update your profile picture</p>
      </div>
    </div>
  );
};

export default ProfileSetup;
