import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrdersHistory, 
  deliverOrder,
} from '../../store/shop/Orders';
import { allUsers } from "../../store/shop/Orders"; // Assuming you have this action
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../../components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "../../components/ui/alert-dialog";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  Search,
  Filter,
  RefreshCw,
  X
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { cancelOrder } from '../../store/shop/Orders';
import { updateOTP } from '../../store/shop/Orders';
import { submitReview } from '../../store/shop/Orders/reviewSlice';
import { authenticateByEmail } from '../../store/Auth_Slice';

const OrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { AllUsers } = useSelector((state) => state.order); // Assuming you have users in your store
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  const userId = user.id;

  useEffect(() => {
    dispatch(fetchOrdersHistory(userId));
    dispatch(allUsers()); // Fetch all users to get buyer names
  }, [dispatch, userId]);

  useEffect(()=> {
    const userInfoString = localStorage.getItem('user');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const email = userInfo.email;
        console.log("Memory", userInfo);
        
        if (email) {
          dispatch(authenticateByEmail(email)).then((response) => {
            console.log("CAS login response", response);
          }).catch((error) => {
            console.error("Authentication failed", error);
          });
        }
      } catch (error) {
        console.error("Error parsing user info from local storage", error);
      }
  }},)
  // Helper function to get buyer name
  // console.log("AllUsers",AllUsers.data);
  const getBuyerName = (buyerId) => {
    const buyer =AllUsers.data.find(u => u._id === buyerId);
    return buyer ? `${buyer.fname} ${buyer.lname}` : buyerId;
  };

  const handleDeliver = async () => {
    if (!selectedOrder || !otp) {
      alert("Please select an order and enter OTP.");
      return;
    }

    const resultAction = await dispatch(deliverOrder({ 
      orderId: selectedOrder._id, 
      otp 
    }));

    if (deliverOrder.fulfilled.match(resultAction)) {
      alert("Order delivered successfully!");
      setOtp("");
      setSelectedOrder(null);
      dispatch(fetchOrdersHistory(userId)); // Refresh orders
    } else {
      alert("Failed to deliver order: " + (resultAction.payload?.message || "Unknown error"));
    }
  };

  const handleCancelOrder = async (orderId) => {
    const resultAction = dispatch(cancelOrder(orderId)).then((response)=>
    {
      console.log(response);
      if(response.payload)
      {
        console.log("Order Cancelled successfully");
        dispatch(fetchOrdersHistory(userId));
      }
    });

    
  };

  const refreshOrders = () => {
    dispatch(fetchOrdersHistory(userId));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus(null);
  };

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
  };

  const handleGenerateOTP = (OrderId) => {
    const newOtp = generateOTP();
    setOtp(newOtp);
    console.log("NewOtp is", newOtp);
    dispatch(updateOTP({OrderId, newOtp})).then((response) => {
      console.log(response);
    });
    alert(`New OPT is ${newOtp}`);
  }
  // Filter and search logic
  const filterOrders = (orderList) => {
    return orderList.filter(order => {
      const matchesSearch = 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getBuyerName(order.buyerId).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus ? order.status === filterStatus : true;
      
      return matchesSearch && matchesStatus;
    });
  };

  const pendingOrders = filterOrders(orders.boughtOrders?.filter(order => order.status === "pending") || []);
  const boughtOrders = filterOrders(orders.boughtOrders || []);
  const soldOrders = filterOrders(orders.soldOrders || []);
  const deliverableOrders = filterOrders(orders.soldOrders?.filter(order => order.status === "pending") || []);

  const [rating, setRating] = useState(0);
const [reviewComment, setReviewComment] = useState("");

// Add this function to handle review submission:
const handleSubmitReview = async (orderId, sellerId) => {
  if (rating === 0 || !reviewComment.trim()) {
    alert("Please provide both a rating and a comment");
    return;
  }
  console.log("OrderID, SellerId", orderId,sellerId);
  const resultAction = dispatch(submitReview({
    sellerId,
    rating,
    comment: reviewComment,
    orderId,
    userId
  })).then((response) => {
    console.log("review",response);
    if(response.payload)
    {
      alert("Review submitted successfully!");
      setRating(0);
      setReviewComment("");
      // dispatch(fetchOrdersHistory(userId)); // Refresh orders
    }
    else
    {
      alert("Failed to submit review: " + (resultAction.payload?.message || "Unknown error"));
    }
  });

};

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-blue-600" />
              <span>Order Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-10 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={refreshOrders}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          
          {/* Filter Indicators */}
          <div className="flex items-center space-x-2 mt-2">
            {(searchTerm || filterStatus) && (
              <>
                <span className="text-sm text-gray-600">Applied Filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center">
                    Search: {searchTerm}
                    <X 
                      className="ml-2 h-3 w-3 cursor-pointer" 
                      onClick={() => setSearchTerm("")} 
                    />
                  </Badge>
                )}
                {filterStatus && (
                  <Badge variant="secondary" className="flex items-center">
                    Status: {filterStatus}
                    <X 
                      className="ml-2 h-3 w-3 cursor-pointer" 
                      onClick={() => setFilterStatus(null)} 
                    />
                  </Badge>
                )}
                {(searchTerm || filterStatus) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="pending">
                <Clock className="mr-2 h-4 w-4" />
                Pending Orders
              </TabsTrigger>
              <TabsTrigger value="bought">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Bought Items
              </TabsTrigger>
              <TabsTrigger value="sold">
                <TrendingUp className="mr-2 h-4 w-4" />
                Sold Items
              </TabsTrigger>
              <TabsTrigger value="deliverable">
                <Package className="mr-2 h-4 w-4" />
                Deliver Items
              </TabsTrigger>
            </TabsList>

            {/* Order Tables - Keep previous implementation */}
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Current OTP</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{otp}</TableCell>
                      <TableCell className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateOTP(order._id)}
                        >
                          Generate OTP
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="bought">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boughtOrders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          {order.status === "pending" && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              Cancel Order
                            </Button>
                          )}
                          {order.status === "completed" && !order.hasReview && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Leave a Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Share your experience with this seller
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Button
                                        key={star}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setRating(star)}
                                        className={rating >= star ? "text-yellow-500" : "text-gray-300"}
                                      >
                                        ★
                                      </Button>
                                    ))}
                                  </div>
                                  <Input
                                    placeholder="Write your review..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleSubmitReview(order._id, order.sellerId)}
                                  >
                                    Submit Review
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sold">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soldOrders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>{getBuyerName(order.buyerId)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="deliverable">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliverableOrders.map(order => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id.slice(-6)}</TableCell>
                      <TableCell>{getBuyerName(order.buyerId)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedOrder(order)}
                            >
                              Deliver
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Verify Delivery</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enter the OTP to complete this delivery.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              <Input 
                                placeholder="Enter OTP" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeliver}>
                                Confirm Delivery
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersManagement;