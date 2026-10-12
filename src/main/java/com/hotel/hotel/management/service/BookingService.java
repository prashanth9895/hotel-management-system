
package com.hotel.hotel.management.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hotel.hotel.management.controller.BookingRequest;
import com.hotel.hotel.management.entity.Booking;
import com.hotel.hotel.management.entity.Customer;
import com.hotel.hotel.management.entity.Room;
import com.hotel.hotel.management.repository.BookingRepository;
import com.hotel.hotel.management.repository.CustomerRepository;
import com.hotel.hotel.management.repository.RoomRepository;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            CustomerRepository customerRepository) {

        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));
    }

    public Booking createBooking(BookingRequest request) {

        // Validate required fields
        if (request == null
                || request.getRoomId() == null
                || request.getCustomerId() == null
                || request.getCheckIn() == null
                || request.getCheckOut() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "All booking fields are required");
        }

        LocalDate checkIn = request.getCheckIn();
        LocalDate checkOut = request.getCheckOut();

        // Validate dates
        if (!checkOut.isAfter(checkIn)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in");
        }

        // Check whether the room exists
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Room not found"));

        // Check whether the customer exists
        Customer customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Customer not found"));

        // Reject overlapping bookings for the same room
        boolean dateConflict = bookingRepository.hasDateConflict(
                request.getRoomId(),
                checkIn,
                checkOut);

        if (dateConflict) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Room is already booked for the selected dates");
        }

        // Create booking only when there is no conflict
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setCustomer(customer);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking is already cancelled");
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
}
