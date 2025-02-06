import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../../store/Admin/products/UserSlice';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  MoreVertical 
} from 'lucide-react';

function Dashboard() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Sorting and Filtering Logic
  const sortedAndFilteredUsers = React.useMemo(() => {
    if (!users) return [];

    let result = [...users];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(user => 
        filterStatus === 'active' ? user.active : !user.active
      );
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [users, searchTerm, sortConfig, filterStatus]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key && 
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle user actions
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
      dispatch(fetchAllUsers());
    }
  };

  const handleToggleStatus = (userId) => {
    dispatch(toggleUserStatus(userId));
  };

  // Rendering loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {['fname', 'email', 'age', 'phone', 'active'].map((key) => (
                  <th 
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort(key)}
                  >
                    <div className="flex items-center">
                      {key === 'fname' ? 'Name' : 
                       key === 'active' ? 'Status' : 
                       key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortConfig.key === key && (
                        sortConfig.direction === 'ascending' ? 
                        <ArrowUp className="ml-2 inline" size={16} /> : 
                        <ArrowDown className="ml-2 inline" size={16} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedAndFilteredUsers.length > 0 ? (
                sortedAndFilteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.fname} {user.lname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="Toggle Status"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;