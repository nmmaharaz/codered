"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Bookmark, MessageSquare, Settings, Home, Bell, Edit2, MapPin, Camera, UserPlus } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    coverPicture: "",
    profilePicture: "",
    bio: "",
    about: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile-update');
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setProfile({
            coverPicture: data.coverPicture || "",
            profilePicture: data.profilePicture || "",
            bio: data.bio || "",
            about: data.about || "",
            location: data.location || "",
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch user's posts (blogs)
  const fetchUserPosts = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`/api/blog?email=${encodeURIComponent(session.user.email)}`);
      if (response.ok) {
        const blogs = await response.json();
        setUserPosts(Array.isArray(blogs) ? blogs : []);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  };

  // Fetch user's questions
  const fetchUserQuestions = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`/api/question?email=${encodeURIComponent(session.user.email)}`);
      if (response.ok) {
        const questions = await response.json();
        setUserQuestions(Array.isArray(questions) ? questions : []);
      }
    } catch (error) {
      console.error('Error fetching user questions:', error);
      setUserQuestions([]);
    }
  };

  // Fetch data when user session changes
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserPosts();
      fetchUserQuestions();
    }
  }, [session]);

  // Fetch bookmark data when tab changes to bookmarked sections
  useEffect(() => {
    if (session?.user?.email) {
      if (activeTab === 'bookmarked-questions') {
        fetchBookmarkedQuestions();
      } else if (activeTab === 'bookmarked-blogs') {
        fetchBookmarkedBlogs();
      }
    }
  }, [activeTab, session]);

  const fetchBookmarkedQuestions = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid bookmarks data:', data);
        setBookmarkedQuestions([]);
        return;
      }

      const questionIds = data
        .filter(bookmark => bookmark.type === 'question')
        .map(bookmark => bookmark.questionId);

      if (questionIds.length > 0) {
        const questionsResponse = await fetch(`/api/questions?ids=${questionIds.join(',')}`);
        const questions = await questionsResponse.json();
        setBookmarkedQuestions(questions);
      } else {
        setBookmarkedQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarked questions:', error);
      setBookmarkedQuestions([]);
    }
  };

  const fetchBookmarkedBlogs = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid bookmarks data:', data);
        setBookmarkedBlogs([]);
        return;
      }

      const blogIds = data
        .filter(bookmark => bookmark.type === 'blog')
        .map(bookmark => bookmark.blogId);

      if (blogIds.length > 0) {
        const blogsResponse = await fetch(`/api/blogs?ids=${blogIds.join(',')}`);
        const blogs = await blogsResponse.json();
        setBookmarkedBlogs(blogs);
      } else {
        setBookmarkedBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarked blogs:', error);
      setBookmarkedBlogs([]);
    }
  };

  useEffect(() => {
    // Update total bookmarks count whenever bookmarked questions or blogs change
    setTotalBookmarks(bookmarkedQuestions.length + bookmarkedBlogs.length);
  }, [bookmarkedQuestions, bookmarkedBlogs]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the current cover picture URL in case we need to revert
    const previousCoverPicture = profile.coverPicture;

    try {
      setIsUploading(true);
      
      // Show immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, coverPicture: e.target.result }));
      };
      reader.readAsDataURL(file);

      // Upload directly to ImageBB
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error('Failed to upload image to ImageBB');
      }

      // Update profile with the new image URL
      const updateResponse = await fetch('/api/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          coverPicture: result.data.url
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the profile state with the permanent URL
      setProfile(prev => ({ ...prev, coverPicture: result.data.url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      // Revert to previous cover picture if upload fails
      setProfile(prev => ({ ...prev, coverPicture: previousCoverPicture }));
      // Show error message to user
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the current profile picture URL in case we need to revert
    const previousProfilePicture = profile.profilePicture;

    try {
      setIsUploading(true);
      
      // Show immediate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);

      // Upload directly to ImageBB
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error('Failed to upload image to ImageBB');
      }

      // Update profile with the new image URL
      const updateResponse = await fetch('/api/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          profilePicture: result.data.url
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the profile state with the permanent URL
      setProfile(prev => ({ ...prev, profilePicture: result.data.url }));
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Revert to previous profile picture if upload fails
      setProfile(prev => ({ ...prev, profilePicture: previousProfilePicture }));
      // Show error message to user
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        setIsEditing(false);
        // Fetch the updated profile data
        const updatedResponse = await fetch('/api/profile-update');
        const updatedData = await updatedResponse.json();
        if (updatedData) {
          setProfile({
            coverPicture: updatedData.coverPicture || "",
            profilePicture: updatedData.profilePicture || "",
            bio: updatedData.bio || "",
            about: updatedData.about || "",
            location: updatedData.location || "",
          });
        }
      } else {
        console.error("Failed to save profile:", await response.text());
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full">
        <div className="p-4">
          <div className="relative">
            {profile.profilePicture ? (
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => profilePicInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <button
                  onClick={() => profilePicInputRef.current?.click()}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <UserPlus className="w-8 h-8" />
                </button>
              </div>
            )}
            <input
              type="file"
              ref={profilePicInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureUpload}
            />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user?.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("posts")}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md ${
                activeTab === "posts"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md ${
                activeTab === "questions"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Questions
            </button>
            <button
              onClick={() => setActiveTab("bookmarked-questions")}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md ${
                activeTab === "bookmarked-questions"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Bookmarked Questions
            </button>
            <button
              onClick={() => setActiveTab("bookmarked-blogs")}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md ${
                activeTab === "bookmarked-blogs"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Bookmarked Blogs
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="relative mb-8">
            {/* Cover Picture */}
            <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative group">
              {profile.coverPicture ? (
                <div className="w-full h-full relative">
                  <Image
                    src={profile.coverPicture}
                    alt="Cover"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Add cover picture</span>
                </div>
              )}
              {isEditing && (
                <div className="absolute bottom-2 right-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
              )}
              {!isEditing && !profile.coverPicture && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
                  >
                    <Camera className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture and Info */}
            <div className="flex items-end -mt-16 ml-8 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture}
                      alt={session.user?.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={session.user?.image || "/assets/profile-pic.png"}
                      alt={session.user?.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white ">{session.user?.name}</h1>
                <p className="text-white ">{session.user?.email}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="bg-blue-600 text-blue px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About</h3>
              {isEditing ? (
                <textarea
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  className="w-full h-32 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-black"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profile.about || 'No about information yet'}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bio</h3>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full h-32 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-black"
                  placeholder="Write a short bio..."
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profile.bio || 'No bio yet'}</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Location</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-black"
                  placeholder="Enter your location"
                />
              ) : (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{profile.location || 'No location set'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Posts</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{userPosts.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Questions Asked</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{userQuestions.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bookmarks</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{totalBookmarks}</p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {activeTab === "posts" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h2>
                <div className="space-y-4">
                  {userPosts.length > 0 ? (
                    userPosts.map((blog) => (
                      <div key={blog._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={blog.image || "/assets/profile-pic.png"}
                              alt={blog.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {blog.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Posted on {blog.postedAt ? new Date(blog.postedAt).toISOString().split('T')[0] : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {blog.title}
                          </h4>
                          <div 
                            className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                          />
                        </div>

                        {blog.contentImage && blog.contentImage.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={blog.contentImage[0]}
                              alt="Blog content"
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>{blog.likes?.length || 0}</span>
                            <span>Likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{blog.comments?.length || 0}</span>
                            <span>Comments</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "questions" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Questions</h2>
                <div className="space-y-4">
                  {userQuestions.length > 0 ? (
                    userQuestions.map((question) => (
                      <div key={question._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={question.image || "/assets/profile-pic.png"}
                              alt={question.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {question.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Posted on {question.postedAt ? new Date(question.postedAt).toISOString().split('T')[0] : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {question.title}
                          </h4>
                          <div 
                            className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: question.content }}
                          />
                        </div>

                        {question.contentImage && question.contentImage.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={question.contentImage[0]}
                              alt="Question content"
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>{question.likes?.length || 0}</span>
                            <span>Likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{question.dislikes?.length || 0}</span>
                            <span>Dislikes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{question.comments?.length || 0}</span>
                            <span>Comments</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">No questions yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bookmarked-questions" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bookmarked Questions</h2>
                <div className="space-y-4">
                  {bookmarkedQuestions.length > 0 ? (
                    bookmarkedQuestions.map((question) => (
                      <div key={question._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={question.image || "/assets/profile-pic.png"}
                              alt={question.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {question.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Posted on {question.postedAt ? new Date(question.postedAt).toISOString().split('T')[0] : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {question.title}
                          </h4>
                          <div 
                            className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: question.content }}
                          />
                        </div>

                        {question.contentImage && question.contentImage.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={question.contentImage[0]}
                              alt="Question content"
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>{question.likes?.length || 0}</span>
                            <span>Likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{question.dislikes?.length || 0}</span>
                            <span>Dislikes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{question.comments?.length || 0}</span>
                            <span>Comments</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Bookmarked Questions
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Questions you bookmark will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bookmarked-blogs" && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bookmarked Blogs</h2>
                <div className="space-y-4">
                  {bookmarkedBlogs.length > 0 ? (
                    bookmarkedBlogs.map((blog) => (
                      <div key={blog._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={blog.image || "/assets/profile-pic.png"}
                              alt={blog.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {blog.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Posted on {blog.postedAt ? new Date(blog.postedAt).toISOString().split('T')[0] : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {blog.title}
                          </h4>
                          <div 
                            className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                          />
                        </div>

                        {blog.contentImage && blog.contentImage.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={blog.contentImage[0]}
                              alt="Blog content"
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>{blog.likes?.length || 0}</span>
                            <span>Likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{blog.comments?.length || 0}</span>
                            <span>Comments</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Bookmarked Blogs
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Blogs you bookmark will appear here
                        </p>
                      </div>
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}