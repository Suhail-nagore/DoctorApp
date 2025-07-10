import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../store/doctor";
import { fetchCategories } from '../store/categories';
import {  fetchSubcategoryDetail } from '../store/subcategories';

import { placeOrder,resetOrderState } from '../store/order';

import { toast } from "react-toastify"; 

//added navigate for rerouting to print report- Armaan Siddiqui
import { useNavigate } from 'react-router-dom'; 
import api from "@/common/axios";



const ModalEditForms = ({ isOpen, onClose, onSubmit, initialData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [valueS, setValueS] = useState("");

  // Redux state
  const { doctors } = useSelector((state) => state.doctors);
  const { categories} = useSelector((state) => state.categories);
  const { subcategory, loading} = useSelector((state) => state.subcategory);
  
  // state for managing wrong disc input- Armaan Siddiqui
  const [prevDiscount, setPrevDiscount] = useState("");


  // Local state for form fields
  const [formData, setFormData] = useState({
    phoneNo: "",
    name: "",
    age: "",
    gender:"",
    address: "",
    referredBy: "",
    category: "",
    subcategory: "",
    fees: "",
    discount: "",
    finalPayment: "",
    paymentMode: "",
    referralFee:"",

    // added required fields for order creating- Armaan Siddiqui
    serialNo: "",
    placedBy: "",
   
  });

  // Initialize form data if editing existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        phoneNo: initialData.phoneNo || "",
        name: initialData.name || "",
        age: initialData.age || "",
        gender: initialData.gender || "",
        address: initialData.address || "",
        referredBy: initialData.referredBy || "",
        category: initialData.category || "",
        subcategory: initialData.subcategory || "",
        fees: initialData.fees || "",
        discount: initialData.discount || "",
        finalPayment: initialData.finalPayment || "",
        paymentMode: initialData.paymentMode || "",
        referralFee: initialData.referralFee || "",
        
        // Added fields for online + cash - Armaan Siddiqui
        online: initialData.online || "",
        cash: initialData.cash || "",
        referralFee: initialData.referralFee || "", 


        // Added required fields for creating new order-Armaan Siddiqui
        serialNo: initialData.serialNo || `ORD-${Date.now()}`,
        placedBy: initialData.placedBy || "",



      });
    }
  }, [initialData]);
  

  // Fetch data on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDoctors());
       dispatch(fetchCategories()); 
    }
  }, [isOpen, dispatch]);

  // Handle input change
  const handleChange = (e) => {
      
  
    //Calculate values on change- Armaan Siddiqui
    const { name, value } = e.target;

    if (name === "subcategory") {
      const selectedSub = filteredSubcategories.find((sub) => sub.name === value);
      if (selectedSub?._id) {
        setValueS(selectedSub._id); // correct ID
        dispatch(fetchSubcategoryDetail(selectedSub._id));
      }

      setFormData((prev) => ({
        ...prev,
        subcategory: value,
        fees: "",
        referralFee: "",
        discount: "",
        finalPayment: "",
        online: "",
        cash: "",
      }));
      return;
    }

    // Track previous discount- Armaan Siddiqui
    if (name === "discount") {
      setPrevDiscount(formData.discount);  // Save old value before update-Armaan Siddiqui
    }

    if (name === "paymentMode") {
      setFormData((prev) => ({
        ...prev,
        paymentMode: value,
        online: value === "Online + Cash" ? prev.online : "",
        cash: value === "Online + Cash" ? prev.cash : "",
      }));
      return;
    }

    setFormData((prev) => {
    const updated = recalculateFormData(prev, name, value);
    if (updated === prev) return prev;
    return updated;
  });

      
    // Update formData with the changed value
    // setFormData((prevState) => {
    //   const updatedFormData = {
    //     ...prevState,
    //     [name]: value,
    //   };
  
    // Removed hard coded final payment calculation- Armaan Siddiqui
       
    // // If fees or discount change, recalculate finalPayment
    // if (name === "fees" || name === "discount") {
    //   let fees = name === "fees" ? parseFloat(value) || 0 : parseFloat(updatedFormData.fees) || 0;
    //   let discount = name === "discount" ? parseInt(value) || 0 : parseInt(updatedFormData.discount) || 0;
  
    
    //   // Update finalPayment after validation
    //   updatedFormData.finalPayment = fees - discount;
    // }
  
       
    //   return updatedFormData;
    // });
  };
      
    
  
  

  useEffect(() => {
    const fetchSubcategoriesByCategory = async () => {
      if (!formData.category) {
        setFilteredSubcategories([]); // Clear subcategories if no category is selected
        return;
      }

      try {
        const response = await api.get(
          `/subcategory?category=${formData.category}`
        );
        setFilteredSubcategories(response.data.subcategories); // Update subcategories based on category
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategoriesByCategory();
  }, [formData.category]);

  useEffect(() => {
     
    
      if (valueS) {
        dispatch(fetchSubcategoryDetail(valueS));
      }
    }, [valueS]);

    useEffect(() => {
      if (subcategory && subcategory._id === valueS) {
        setFormData((prev) => {
          const updated = {
            ...prev,
            fees: subcategory.price || "",
            referralFee: subcategory.referralFee || "",
            discount: "",
            finalPayment: subcategory.price || "",
            online: "",
            cash: "",
          };
          return recalculateFormData(updated, null, null);
        });
      }
    }, [subcategory, valueS]);

      // Added function for checking and reinitializing fields in form on value change - Armaan Siddiqui
      const recalculateFormData = (prev, name, value) => {
        const numVal = parseFloat(value) || 0;
        const updated = { ...prev, [name]: value };

        if (name === "fees" || name === "discount") {
          const fees = name === "fees" ? numVal : parseFloat(prev.fees) || 0;
          const discount = name === "discount" ? numVal : parseFloat(prev.discount) || 0;
          const referralFee = parseFloat(prev.referralFee) || 0;

          if (discount > referralFee) {
            alert("Discount cannot be greater than Referral Fee.");
            updated.discount = prevDiscount; // Revert to previous discount
            updated.finalPayment = (fees - parseFloat(prevDiscount || 0)).toFixed(2);
            return updated;
          }

          updated.fees = fees;
          updated.discount = discount;
          updated.finalPayment = (fees - discount).toFixed(2);

          if (prev.paymentMode === "Online + Cash") {
            updated.online = "";
            updated.cash = "";
          }
        }

        const final = parseFloat(updated.finalPayment) || 0;

        if (prev.paymentMode === "Online + Cash") {
          if (name === "online") {
            if (numVal > final) {
              alert("Amount cannot be greater than Final Payment.");
              return prev;
            }
            updated.online = numVal;
            updated.cash = (final - numVal).toFixed(2);
          }

          if (name === "cash") {
            if (numVal > final) {
              alert("Amount cannot be greater than Final Payment.");
              return prev;
            }
            updated.cash = numVal;
            updated.online = (final - numVal).toFixed(2);
          }
        }

        return updated;
      };



  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Second check for data on submit - Armaan Siddiqui
  const online =( formData.paymentMode === "Online + Cash" && parseFloat(formData.online) )|| 0;
  const cash = ( formData.paymentMode === "Online + Cash" && parseFloat(formData.cash) )|| 0;
  const final = parseFloat(formData.finalPayment) || 0;

  // added unbilled change handling- Armaan Siddiqui
  if (formData.paymentMode === "Online + Cash") {
    if (online + cash !== final) {
      toast.error("Online + Cash should equal Final Payment");
      return;
    }
  }

  try {
    if (initialData?._id) {
      await api.get(`/fetchUnbilledOrderById/${initialData._id}`);


    }
    const orderData = {
      ...formData,
      online,
      cash,
      finalPayment: final,


      // Modifying order data for complying with schema of order- Armaan Siddiqui
      serialNo: formData.serialNo || `ORD-${Date.now()}`,
      placedBy: formData.placedBy || "Unknown",
    };
    const orderResponse = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(orderResponse)) {
      if (initialData?._id) {
        await api.delete(`/unbilled/${initialData._id}`);
      }
      navigate("/print-report"); //added reroute for print report- Armaan Siddiqui
      onClose?.();
    }
    else {
      toast.error("Failed to save order");
      console.error("Dispatch error:", orderResponse);
    }

  } catch (err) {
    console.error("Could not save order:", err);
    toast.error("Could not save order");
  }
};


  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>

            <div>
  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
    Gender
  </label>
  <select
    id="gender"
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
     <option value="">Select Your Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>
  
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Referred By (Doctor Select) */}
           
<div>
  <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
    Referred By
  </label>
  <select
    id="referredBy"
    name="referredBy"
    value={formData.referredBy || ""}  // Default value is an empty string if referredBy is null or 0
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
    <option value="">Select Doctor</option>
    <option value="0">None</option>
    {doctors?.map((doctor) => (
      // <option key={doctor.id} value={doctor._id}>
      //   {doctor.name} {/* Display doctor's name */}
      // </option>
      <option key={doctor._id} value={doctor._id}>
        {doctor.name}
      </option>
    ))}
  </select>
</div>



  
            {/* Category (Select Dropdown) */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              >
                <option value="">Select Category</option>
                {/* Add categories here */}
                {categories?.map((category) => (
      // <option key={category.id} value={category.name}>
      //   {category.name} {/* Display doctor's name */}
      // </option>
        <option key={category._id} value={category.name}>
          {category.name}
        </option>
    ))}
              </select>
            </div>
  
            {/* Subcategory (Select Dropdown) */}
          {/* Subcategory (Select Dropdown) */}
          <div>
  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
    Subcategory
  </label>
  <select
    id="subcategory"
    name="subcategory"
    value={formData.subcategory} // Bind value to the formData.subcategory state
    onChange={handleChange}
    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
  >
    <option value="">Select Subcategory</option>
    {filteredSubcategories?.map((sub) => (
      <option key={sub._id} value={sub.name}>
        {sub.name}
      </option>
    ))}
  </select>
</div>


  
            {/* Fees */}
            <div>
              <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
                Fees
              </label>
              <input
                type="text"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
                readOnly
              />
            </div>
  
            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              />
            </div>
  
            {/* Final Payment */}
            <div>
              <label htmlFor="finalPayment" className="block text-sm font-medium text-gray-700">
                Final Payment
              </label>
              <input
                type="text"
                id="finalPayment"
                name="finalPayment"
                value={formData.finalPayment}
                onChange={handleChange} // You might want to prevent manual edits here
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
                readOnly
                
              />
            </div>

  
            {/* Payment Mode */}
            <div>
              <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
                Payment Mode
              </label>
              <select
                id="paymentMode"
                name="paymentMode"
                value={formData.paymentMode || ""}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                {/* Added Option for new feature- Armaan Siddiqui */}
                <option value="Online + Cash">Online + Cash</option> 

              </select>
            </div>
            {formData.paymentMode === "Online + Cash" && (
              <div>
                <div>
                  <label htmlFor="online">Online Paid</label>
                  <input
                    type="number"
                    id="online"
                    name="online"
                    value={formData.online || ""}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="cash">Cash Paid</label>
                  <input
                    type="number"
                    id="cash"
                    name="cash"
                    value={formData.cash || ""}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm px-4 py-2 text-sm"
                  />
                </div>
              </div>
            )}
            <div>


            {/* Added an extra field for showing the operator/admin who placed the unbill transaction-Armaan Siddiqui */}
            <label htmlFor="placedBy" className="block text-sm font-medium text-gray-700">
              Placed By
            </label>
            <input
              type="text"
              id="placedBy"
              name="placedBy"
              value={formData.placedBy || ""}
              readOnly
              className="mt-2 block w-full rounded-md border-2 border-gray-300 bg-gray-100 shadow-sm px-4 py-2 text-sm cursor-not-allowed"
            />
          </div>

            {/* Referral Fee */}
          
  
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                // disabled={subcategoryLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
  
  
};

export default ModalEditForms;
