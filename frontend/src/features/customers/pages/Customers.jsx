import React, { useEffect } from 'react';
import { useCustomer } from '../hooks/use.customer';
import { useNavigate, Link } from 'react-router-dom';

const Customers = () => {
  const { customers = [], handleCustomerList, loading } = useCustomer();
  const navigate = useNavigate(); 

  useEffect(() => {
    handleCustomerList();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Customers</h1>

     
      {customers.length === 0 ? (
        <p>No customers found. Click the button below to add your first customer!</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id || customer._id}>
              <strong>{customer.name}</strong> <br />
              {customer.email} <br />
              {customer.phone} <br />
              {customer.stripeCustomerId} <br />
              {customer.status} <br />
              {customer.totalRevenue}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/create-customer')}>Create Customer</button>
    </div>
  );
};

export default Customers;

