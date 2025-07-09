import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../store/order";

const Collections = () => {
  const dispatch = useDispatch();
  const [totals, setTotals] = useState({
    cashAmount: 0,
    onlineAmount: 0,
    overallTotal: 0,
  });

  const { allOrders, loading: ordersLoading } = useSelector((state) => state.order);

  useEffect(() => {
    // Fetch all orders on component mount
    dispatch(fetchAllOrders());
  }, [dispatch]);

  
  useEffect(() => {
    if (allOrders && allOrders.length > 0) {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      ); // Midnight today
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      ); // 11:59:59 PM today

      const todayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });

      //Changes Calculate total logic for handling split(Online + Cash)-Armaan Siddiqui
      if (todayOrders.length > 0) {
        let cashAmount = 0;
        let onlineAmount = 0;
        todayOrders.forEach((order) => {
          if (order.paymentMode === "Cash") {
            cashAmount += order.finalPayment;
          } 
          else if (order.paymentMode === "Online") {
            onlineAmount += order.finalPayment;
          }

          // Added else if for Online + Cash mode handling - Armaan Siddiqui
          else if (order.paymentMode === "Online + Cash") {
            cashAmount += order.cash ?? 0;
            onlineAmount += order.online ?? 0;
          }
        });

        const overallTotal = cashAmount + onlineAmount;

        setTotals({ cashAmount, onlineAmount, overallTotal });
      } else {
        setTotals({ cashAmount: 0, onlineAmount: 0, overallTotal: 0 });
      }
    } else {
      setTotals({ cashAmount: 0, onlineAmount: 0, overallTotal: 0 });
    }
  }, [allOrders]);



  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Today's Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash Amount */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Cash Amount</h2>
          <p className="text-4xl font-bold text-green-500 mt-4">
            ₹{totals.cashAmount}
          </p>
        </div>

        {/* Online Amount */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Online Amount</h2>
          <p className="text-4xl font-bold text-blue-500 mt-4">
            ₹{totals.onlineAmount}
          </p>
        </div>

        {/* Overall Total */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Overall Total</h2>
          <p className="text-4xl font-bold text-purple-500 mt-4">
            ₹{totals.overallTotal}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collections;
