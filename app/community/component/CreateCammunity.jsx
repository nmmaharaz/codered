"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useGroupData } from "../[user_name]/Member/component/index";

function CreateCammunity() {
  const [groupName, setGroupName] = useState("");
  const [audience, setAudience] = useState("Public");
  const [friendName, setFriendName] = useState([]);
  const [description, setDescription] = useState("");
  const [friendData, setFriendData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data } = useSession();
  const { refetch } = useGroupData(`/api/community`);

  const dropzoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const dropzone = dropzoneRef.current;
    const fileInput = fileInputRef.current;

    if (!dropzone || !fileInput) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      dropzone.classList.add("border-indigo-600");
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-indigo-600");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-indigo-600");
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    };

    const handleFileSelect = (file) => {
      if (file && file.type.startsWith("image/")) {
        displayPreview(file);
        uploadImage(file);
      } else {
        toast.error("Please upload a valid image file (PNG, JPG, or GIF).");
      }
    };

    const displayPreview = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
      };
    };

    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
    fileInput.addEventListener("change", handleFileChange);

    return () => {
      dropzone.removeEventListener("dragover", handleDragOver);
      dropzone.removeEventListener("dragleave", handleDragLeave);
      dropzone.removeEventListener("drop", handleDrop);
      fileInput.removeEventListener("change", handleFileChange);
    };
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=ee909033f338b65f995ac2f0b70180f4",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uploadedUrl = response.data.data.url;
      const shortenedUrl = await shortenUrl(uploadedUrl);
      setPreviewSrc(shortenedUrl);
      return shortenedUrl;
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed.");
      return null;
    }
  };

  const shortenUrl = async (longUrl) => {
    try {
      const response = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        { long_url: longUrl },
        {
          headers: {
            Authorization: `Bearer YOUR_BITLY_ACCESS_TOKEN`,
          },
        }
      );
      return response.data.link;
    } catch (error) {
      console.error("URL shortening failed", error);
      return longUrl;
    }
  };

  const handleSelect = (name) => {
    if (selectedFriends.includes(name)) {
      const updated = selectedFriends.filter((n) => n !== name);
      setSelectedFriends(updated);
      setFriendName(updated);
    } else {
      const updated = [...selectedFriends, name];
      setSelectedFriends(updated);
      setFriendName(updated);
    }
  };

  const filteredFriends = friendData.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await axios.get(
          `/api/friend/${data?.user?.email}`
        );
        setFriendData(response.data);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    if (data?.user?.email) {
      fetchFriendData();
    }
  }, [data?.user?.email]);

  const handleCommunityCreate = async (e) => {
    e.preventDefault();
    const baseUsername = `${groupName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    if (!data?.user?.email) return alert("Please login first");

    const newCommunity = await axios.post(
      `/api/community/${data?.user?.email}`,
      {
        group_name: groupName,
        group_picture: previewSrc,
        audience: audience,
        members: selectedFriends,
        description: description,
        email: data?.user?.email,
        user_name: baseUsername,
      }
    );

    if (newCommunity.status === 201) {
      document.getElementById("create_group")?.close();
      refetch();
      toast.success(newCommunity?.data.message);
    } else {
      toast.error("Error creating community");
    }
  };

  return (
    <dialog id="create_group" className="modal modal-middle">
      <form
        onSubmit={handleCommunityCreate}
        className="fixed inset-0 flex justify-center items-center p-4"
      >
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button
            type="button"
            onClick={() => document.getElementById("create_group")?.close()}
            className="text-gray-500 hover:text-gray-700 absolute top-3 right-3"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-4">Create Group</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600">Group name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full text-black/80 border border-gray-300 rounded p-2 mt-1"
                placeholder="Add Group name here"
              />
            </div>

            <div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={previewSrc ? previewSrc: "https://placehold.co/80"}
                    alt="Group Picture"
                    width={80}
                    height={80}
                    className="rounded-full w-[80px] h-[80px] object-cover border"
                  />
                  {previewSrc && (
                    <button
                      onClick={() => setPreviewSrc(null)}
                      className="absolute top-0 right-0 bg-gray-700 text-white text-xs rounded-full px-2"
                    >
                      ✖
                    </button>
                  )}
                </div>

                <div
                  ref={dropzoneRef}
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded text-sm inline-block relative overflow-hidden"
                >
                  Upload Group Picture
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/gif"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-600">Select audience</label>
              <div className="flex space-x-4 mt-1">
                {(["Public", "Private"]).map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={type}
                      className="accent-blue-700"
                      checked={audience === type}
                      onChange={() => setAudience(type)}
                    />
                    <span className="text-gray-800">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-600">Invite friends</label>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full cursor-pointer text-sm mt-2 p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              >
                {selectedFriends.length > 0
                  ? selectedFriends.join(", ")
                  : "Select friends"}
              </div>

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 text-black/80 border-b border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend, index) => (
                      <div
                        key={index}
                        className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                          selectedFriends.includes(friend.name)
                            ? "bg-gray-200"
                            : ""
                        }`}
                        onClick={() => handleSelect(friend.name)}
                      >
                        <span className="text-gray-700">{friend.name}</span>
                        {selectedFriends.includes(friend.name) && (
                          <span className="text-green-500 font-bold">
                            &#10003;
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No friends found</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600">Group description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-gray-600 border border-gray-300 rounded p-2 mt-1 h-24"
                placeholder="Description here"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded">
                Create now
              </button>
            </div>
          </div>
        </div>
      </form>
    </dialog>
  );
}

export default CreateCammunity;
