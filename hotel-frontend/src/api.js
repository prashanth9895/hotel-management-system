
const API_URL = 'http://localhost:8080/api'

// Get all customers
export async function getCustomers() {
  const response = await fetch(`${API_URL}/customers`)
  if (!response.ok) throw new Error('Customers failed to load.')
  return response.json()
}

// Get all rooms
export async function getRooms() {
  const response = await fetch(`${API_URL}/rooms`)
  if (!response.ok) throw new Error('Rooms failed to load.')
  return response.json()
}

// Get all bookings
export async function getBookings() {
  const response = await fetch(`${API_URL}/bookings`)
  if (!response.ok) throw new Error('Bookings failed to load.')
  return response.json()
}

// Create customer
export async function createCustomer(customer) {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Error adding customer.')
  }

  return response.json()
}

// Update customer
export async function updateCustomer(id, customer) {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Error updating customer.')
  }

  return response.json()
}

// Create booking
export async function createBooking(booking) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Error creating booking.')
  }

  return response.json()
}

// Cancel booking
export async function cancelBooking(id) {
  const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    method: 'POST',
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Error cancelling booking.')
  }

  return response.json()
}

