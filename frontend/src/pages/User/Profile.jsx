import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/Auth_Slice';
import { AlertCircle, Star, StarHalf } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {MessageCircleQuestion, Send, X, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { fetchSellerReviews } from '../../store/shop/Orders/reviewSlice';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // seller reviews
  const { reviews, averageRating, totalReviews, loading: reviewsLoading } = useSelector((state) => state.review);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch reviews on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerReviews(user.id));
    }
  }, [dispatch, user?.id]);

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const [passwordError, setPasswordError] = useState('');
  const [editedUser, setEditedUser] = useState({
    phone: user?.phone || '',
    age: user?.age || '',
    fname: user?.fname || '',
    lname: user?.lname || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const apiKey = "AIzaSyCWBjH9GC79LnU7YKBybE_uI_XDeVCph_w";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      text: "Welcome! I'm your e-commerce support assistant. How can I help you today?",
      sender: 'bot',
      type: 'welcome'
    }]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { 
      text: inputMessage, 
      sender: 'user',
      type: 'message',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationContext = messages
        .slice(-5)
        .map(m => `${m.sender === 'user' ? 'Customer' : 'Support'}: ${m.text}`)
        .join('\n');

      const contextPrompt = `Provide helpful, concise, and friendly customer support.
      
      Conversation Context:
      ${conversationContext}
      
      User's Latest Query: ${inputMessage}
      
      Respond professionally and helpfully, referencing previous conversation if relevant.`;

      const result = await model.generateContent(contextPrompt);
      const botResponse = {
        text: result.response.text(),
        sender: 'bot',
        type: 'message',
        timestamp: new Date().toISOString()
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, {
        text: "I'm experiencing technical difficulties. Please try again or contact our support team.",
        sender: 'bot',
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render message with styling
  const renderMessage = (msg) => {
    const isUser = msg.sender === 'user';
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';

    if (msg.type === 'welcome') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (msg.type === 'error') {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }

    return (
      <div 
        key={msg.timestamp}
        className={`p-3 rounded-lg max-w-[80%] mb-2 shadow-sm
          ${isUser 
            ? 'bg-blue-100 ml-auto text-right' 
            : `${bgColor} ${textColor} mr-auto text-left`}`}
      >
        {msg.text}
      </div>
    );
  };


  const validatePassword = () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(passwordForm.newPassword)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    try {
      // Here you would typically make an API call to update the password
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Show success message (you could add a toast notification here)
    } catch (error) {
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handleSave = () => {
    // Original validation logic...
    const phoneRegex = /^[0-9]{10}$/;
    const ageRegex = /^[1-9][0-9]?$/;
    const nameRegex = /^[A-Za-z]{2,50}$/;

    if (!phoneRegex.test(editedUser.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    if (!ageRegex.test(editedUser.age)) {
      alert('Please enter a valid age between 1 and 99');
      return;
    }

    if (!nameRegex.test(editedUser.fname)) {
      alert('Please enter a valid first name (2-50 letters)');
      return;
    }

    if (!nameRegex.test(editedUser.lname)) {
      alert('Please enter a valid last name (2-50 letters)');
      return;
    }

    dispatch(updateUserProfile({
      phone: editedUser.phone,
      age: editedUser.age,
      fname: editedUser.fname,
      lname: editedUser.lname
    }));

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-">
    <div className="w-full max-w-md">
    <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-600 data-[state=active]:shadow-sm
                      py-2.5 px-4 rounded-md font-medium transition-all duration-200
                      hover:bg-gray-50 hover:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-600 data-[state=active]:shadow-sm
                      py-2.5 px-4 rounded-md font-medium transition-all duration-200
                      hover:bg-gray-50 hover:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>Reviews ({totalReviews})</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Existing profile content - copy everything from the original return statement here */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-20 relative">
          <div className="absolute transform translate-y-8 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-300 shadow-md flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-4 pb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isEditing ? (
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  name="fname"
                  value={editedUser.fname}
                  onChange={handleInputChange}
                  className="w-1/2 p-2 border rounded text-gray-900 text-sm"
                  placeholder="First Name"
                />
                <input 
                  type="text" 
                  name="lname"
                  value={editedUser.lname}
                  onChange={handleInputChange}
                  className="w-1/2 p-2 border rounded text-gray-900"
                  placeholder="Last Name"
                />
              </div>
            ) : (
              `${user?.fname} ${user?.lname}`
            )}
          </h2>
          <p className="text-gray-600 mb-6">{user?.role}</p>
          
          <div className="space-y-4">
            {/* Email (non-editable) */}
            <ProfileItem 
              label="Email" 
              value={user?.email || 'No email provided'}
              readOnly
            />

            {/* Phone Number */}
            <ProfileItem 
              label="Phone" 
              value={isEditing ? 
                <input 
                  type="tel" 
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-900"
                  placeholder="Enter 10-digit phone number"
                /> : 
                user?.phone || 'No phone provided'
              }
            />

            {/* Age */}
            <ProfileItem 
              label="Age" 
              value={isEditing ? 
                <input 
                  type="number" 
                  name="age"
                  value={editedUser.age}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-gray-900"
                  placeholder="Enter age"
                  min="1"
                  max="99"
                /> : 
                user?.age || 'Not specified'
              }
            />

            {/* Password Reset Section */}
            {isChangingPassword ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="w-full p-2 border rounded text-gray-900"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full p-2 border rounded text-gray-900"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full p-2 border rounded text-gray-900"
                />
                
                <div className="flex space-x-4 justify-center mt-4">
                  <button
                    onClick={handlePasswordSubmit}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordError('');
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-200 transition flex items-center justify-center space-x-2"
              >
                <span>Change Password</span>
              </button>
            )}
          </div>

          {/* Edit/Save Button */}
          <div className="mt-6">
            {isEditing ? (
              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={handleSave} 
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => {
                    setEditedUser({
                      phone: user?.phone || '',
                      age: user?.age || '',
                      fname: user?.fname || '',
                      lname: user?.lname || ''
                    });
                    setIsEditing(false);
                  }} 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Seller Reviews</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-lg font-semibold">
                    {averageRating?.toFixed(1)} / 5.0
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : reviews?.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {review.reviewerId.fname?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {review.reviewerId.fname} {review.reviewerId.lname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        Order ID: {review.orderId.slice(-6)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      
      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Support Button */}
        {!isChatOpen && (
          <div className="relative">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center justify-center"
            >
              <HelpCircle size={32} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                ?
              </span>
            </button>
          </div>
        )}

        {/* Chatbot Modal */}
        {isChatOpen && (
          <div className="w-[400px] bg-white border-2 border-blue-500 rounded-xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
              <div className="flex items-center space-x-2">
                <HelpCircle size={24} />
                <h3 className="font-bold text-lg">Customer Support</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-blue-600 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-[600px]">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="text-gray-500 italic p-2 flex items-center">
                  <div className="animate-pulse mr-2">●●●</div>
                  Support is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }} className="p-4 border-t flex items-center space-x-2">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="How can we assist you?"
                className="flex-grow border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const ProfileItem = ({ label, value, readOnly = false }) => (
  <div className={`flex items-center ${readOnly ? 'bg-gray-50' : 'bg-gray-100'} p-3 rounded-lg border border-gray-200 hover:bg-gray-200 transition-all`}>
    <div className="flex-grow">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default UserProfile;