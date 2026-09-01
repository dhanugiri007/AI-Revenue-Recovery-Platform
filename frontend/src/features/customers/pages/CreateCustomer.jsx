import React, { useState } from 'react'
import { useCustomer } from '../hooks/use.customer';
import { useNavigate, Link } from 'react-router';

const CreateCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    customerType: '',
  })
  const [error, setError] = useState('')

  const { loading, handleCreateCustomer } = useCustomer();
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    const data = await handleCreateCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      customerType: formData.customerType,
    });

    if (data?.customer) {
      navigate('/get-customers')
    } else {
      setError('Failed to create customer. Please check the form and try again.')
    }
  }

  if (loading) {
    return (<main><h1>Loading.......</h1></main>)
  }

  return (
    <main>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter customer email"
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label htmlFor="customerType">Customer Type</label>
            <select
              id="customerType"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>

          <button type="submit">Create Customer</button>
        </form>
      </div>
    </main>
  )
}

export default CreateCustomer