import { useState, useEffect, useCallback } from 'react'
import './App.css'
import {
  getCustomers,
  getRooms,
  getBookings,
  createCustomer,
  updateCustomer,
  createBooking,
  cancelBooking,
} from './api'

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [customers, setCustomers] = useState([])
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [savingCustomer, setSavingCustomer] = useState(false)

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingCustomerId, setBookingCustomerId] = useState('')
  const [bookingRoomId, setBookingRoomId] = useState('')
  const [bookingCheckIn, setBookingCheckIn] = useState('')
  const [bookingCheckOut, setBookingCheckOut] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [savingBooking, setSavingBooking] = useState(false)
  const [cancellingBookingId, setCancellingBookingId] = useState(null)

  const menuItems = ['Dashboard', 'Customers', 'Rooms', 'Bookings']

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const results = await Promise.all([
        getCustomers(),
        getRooms(),
        getBookings(),
      ])

      setCustomers(Array.isArray(results[0]) ? results[0] : [])
      setRooms(Array.isArray(results[1]) ? results[1] : [])
      setBookings(Array.isArray(results[2]) ? results[2] : [])
    } catch (err) {
      setError(err.message || 'Data load cheyyadam lo error vachindi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const confirmedBookings = bookings.filter(
    (booking) =>
      String(booking.status || '').toUpperCase() === 'CONFIRMED'
  )

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-IN')
  }

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0

    const start = new Date(`${checkIn}T00:00:00`)
    const end = new Date(`${checkOut}T00:00:00`)
    const difference = end.getTime() - start.getTime()

    return difference > 0
      ? Math.round(difference / 86400000)
      : 0
  }

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
    })

  const calculateTotalPrice = (booking) => {
    const nights = calculateNights(
      booking.checkIn,
      booking.checkOut
    )
    const price = Number(
      booking.room?.pricePerNight ?? booking.room?.price ?? 0
    )
    return nights * price
  }

  const resetCustomerForm = () => {
    setEditingCustomerId(null)
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setFormMessage('')
    setFormError('')
  }

  const handleOpenAddCustomer = () => {
    resetCustomerForm()
    setShowCustomerForm(true)
  }

  const handleEditCustomer = (customer) => {
    resetCustomerForm()
    setEditingCustomerId(customer.id)
    setCustomerName(customer.fullName || customer.name || '')
    setCustomerEmail(customer.email || '')
    setCustomerPhone(customer.phone || '')
    setShowCustomerForm(true)
  }

  const handleCustomerSubmit = async (event) => {
    event.preventDefault()
    setFormMessage('')
    setFormError('')

    const fullName = customerName.trim()
    const email = customerEmail.trim()
    const phone = customerPhone.trim()

    if (!fullName || !email || !phone) {
      setFormError('Name, email, phone anni fill cheyyandi.')
      return
    }

    try {
      setSavingCustomer(true)

      if (editingCustomerId !== null) {
        await updateCustomer(editingCustomerId, {
          fullName,
          email,
          phone,
        })
        setFormMessage('Customer details update ayyayi!')
      } else {
        await createCustomer({ fullName, email, phone })
        setFormMessage('Customer successfully add ayyindi!')
      }

      setShowCustomerForm(false)
      resetCustomerForm()
      await loadData()
    } catch (err) {
      setFormError(err.message || 'Customer save avvaledu.')
    } finally {
      setSavingCustomer(false)
    }
  }

  const resetBookingForm = () => {
    setBookingCustomerId('')
    setBookingRoomId('')
    setBookingCheckIn('')
    setBookingCheckOut('')
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    setBookingMessage('')
    setBookingError('')

    if (
      !bookingCustomerId ||
      !bookingRoomId ||
      !bookingCheckIn ||
      !bookingCheckOut
    ) {
      setBookingError('Anni booking details fill cheyyandi.')
      return
    }

    if (bookingCheckIn < getTodayDate()) {
      setBookingError('Past date ki booking cheyyaleru.')
      return
    }

    if (bookingCheckOut <= bookingCheckIn) {
      setBookingError('Check-out date, check-in date taruvatha undali.')
      return
    }

    try {
      setSavingBooking(true)

      await createBooking({
        customerId: Number(bookingCustomerId),
        roomId: Number(bookingRoomId),
        checkIn: bookingCheckIn,
        checkOut: bookingCheckOut,
      })

      setBookingMessage('Booking successfully create ayyindi!')
      resetBookingForm()
      setShowBookingForm(false)
      await loadData()
    } catch (err) {
      setBookingError(err.message || 'Booking create avvaledu.')
    } finally {
      setSavingBooking(false)
    }
  }

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Ee booking cancel cheyyala?')) return

    try {
      setCancellingBookingId(id)
      setBookingError('')
      setBookingMessage('')

      await cancelBooking(id)

      setBookingMessage('Booking cancel ayyindi!')
      await loadData()
    } catch (err) {
      setBookingError(err.message || 'Booking cancel avvaledu.')
    } finally {
      setCancellingBookingId(null)
    }
  }

  const renderDashboard = () => (
    <section className="content-card">
      <h2>Dashboard</h2>
      <p>Hotel Management System overview</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <p>{rooms.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed Bookings</h3>
          <p>{confirmedBookings.length}</p>
        </div>
      </div>

      <h3>Quick Actions</h3>
      <button onClick={() => setActiveTab('Customers')}>
        View Customers
      </button>{' '}
      <button onClick={() => setActiveTab('Rooms')}>
        View Rooms
      </button>{' '}
      <button onClick={() => setActiveTab('Bookings')}>
        Manage Bookings
      </button>
    </section>
  )

  const renderCustomers = () => (
    <section className="content-card">
      <h2>Customers</h2>
      <p>Manage hotel customers</p>

      <button onClick={handleOpenAddCustomer}>+ Add Customer</button>

      {formMessage && <p className="success-message">{formMessage}</p>}
      {formError && <p className="error-message">{formError}</p>}

      {showCustomerForm && (
        <form onSubmit={handleCustomerSubmit} className="data-form">
          <h3>{editingCustomerId !== null ? 'Edit Customer' : 'Add Customer'}</h3>

          <label htmlFor="customerName">Full Name</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />

          <label htmlFor="customerEmail">Email</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />

          <label htmlFor="customerPhone">Phone</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            required
          />

          <button type="submit" disabled={savingCustomer}>
            {savingCustomer ? 'Saving...' : 'Save Customer'}
          </button>{' '}
          <button
            type="button"
            onClick={() => {
              setShowCustomerForm(false)
              resetCustomerForm()
            }}
          >
            Close
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.fullName || customer.name || '—'}</td>
                <td>{customer.email || '—'}</td>
                <td>{customer.phone || '—'}</td>
                <td>
                  <button onClick={() => handleEditCustomer(customer)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan="5">Customers levu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

  const renderRooms = () => (
    <section className="content-card">
      <h2>Rooms</h2>
      <p>Hotel rooms list</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price Per Night</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.roomNumber || '—'}</td>
                <td>{room.type || '—'}</td>
                <td>{room.capacity ?? '—'}</td>
                <td>₹{formatPrice(room.pricePerNight ?? room.price ?? 0)}</td>
                <td>{room.available ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan="6">Rooms levu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

  const renderBookings = () => (
    <section className="content-card">
      <h2>Bookings</h2>
      <p>Hotel reservations</p>

      <button
        onClick={() => {
          setBookingMessage('')
          setBookingError('')
          setShowBookingForm((current) => !current)
        }}
      >
        {showBookingForm ? 'Close Form' : '+ Create Booking'}
      </button>{' '}
      <button onClick={loadData}>Refresh</button>

      {bookingMessage && <p className="success-message">{bookingMessage}</p>}
      {bookingError && <p className="error-message">{bookingError}</p>}

      {showBookingForm && (
        <form onSubmit={handleBookingSubmit} className="data-form">
          <h3>Create Booking</h3>

          <label htmlFor="bookingCustomer">Customer</label>
          <select
            id="bookingCustomer"
            value={bookingCustomerId}
            onChange={(event) => setBookingCustomerId(event.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.fullName || customer.name || 'Customer'} — {customer.email || ''}
              </option>
            ))}
          </select>

          <label htmlFor="bookingRoom">Room</label>
          <select
            id="bookingRoom"
            value={bookingRoomId}
            onChange={(event) => setBookingRoomId(event.target.value)}
            required
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber || room.id} — {room.type || 'Room'} — ₹
                {formatPrice(room.pricePerNight ?? room.price ?? 0)}/night
              </option>
            ))}
          </select>

          <label htmlFor="bookingCheckIn">Check-in Date</label>
          <input
            id="bookingCheckIn"
            type="date"
            value={bookingCheckIn}
            min={getTodayDate()}
            onChange={(event) => {
              const value = event.target.value
              setBookingCheckIn(value)
              if (bookingCheckOut && value && bookingCheckOut <= value) {
                setBookingCheckOut('')
              }
            }}
            required
          />

          <label htmlFor="bookingCheckOut">Check-out Date</label>
          <input
            id="bookingCheckOut"
            type="date"
            value={bookingCheckOut}
            min={bookingCheckIn || getTodayDate()}
            onChange={(event) => setBookingCheckOut(event.target.value)}
            required
          />

          {bookingCheckIn && bookingCheckOut && bookingCheckOut > bookingCheckIn && (
            <p>Nights: {calculateNights(bookingCheckIn, bookingCheckOut)}</p>
          )}

          <button type="submit" disabled={savingBooking}>
            {savingBooking ? 'Creating...' : 'Confirm Booking'}
          </button>{' '}
          <button
            type="button"
            onClick={() => {
              setShowBookingForm(false)
              resetBookingForm()
            }}
          >
            Close
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer?.fullName || booking.customer?.name || '—'}</td>
                <td>{booking.room?.roomNumber || '—'}</td>
                <td>{formatDate(booking.checkIn)}</td>
                <td>{formatDate(booking.checkOut)}</td>
                <td>{calculateNights(booking.checkIn, booking.checkOut)}</td>
                <td>₹{formatPrice(calculateTotalPrice(booking))}</td>
                <td>{booking.status || '—'}</td>
                <td>
                  {String(booking.status || '').toUpperCase() === 'CONFIRMED' ? (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingBookingId === booking.id}
                    >
                      {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="9">Bookings levu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>🏨 HotelEase</h2>
        <h4>MAIN MENU</h4>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={activeTab === item ? 'active' : ''}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <footer>
          <p>Hotel Management System</p>
          <small>Admin Panel</small>
        </footer>
      </aside>

      <main className="main-content">
        {loading ? (
          <section className="content-card">
            <p>Loading data...</p>
          </section>
        ) : error ? (
          <section className="content-card">
            <p className="error-message">{error}</p>
            <button onClick={loadData}>Try Again</button>
          </section>
        ) : (
          <>
            {activeTab === 'Dashboard' && renderDashboard()}
            {activeTab === 'Customers' && renderCustomers()}
            {activeTab === 'Rooms' && renderRooms()}
            {activeTab === 'Bookings' && renderBookings()}
          </>
        )}

        <p className="page-footer">
          © 2026 HotelEase · Hotel Management System
        </p>
      </main>
    </div>
  )
}

export default App
