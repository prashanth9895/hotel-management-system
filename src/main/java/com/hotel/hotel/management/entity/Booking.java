
package com.hotel.hotel.management.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @NotNull
    @Column(nullable = false)
    private LocalDate checkIn;

    @NotNull
    @Column(nullable = false)
    private LocalDate checkOut;

    @Column(nullable = false)
    private String status = "CONFIRMED";

    public Booking() {}

    public Long getId() { return id; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) {
        this.checkIn = checkIn;
    }

    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) {
        this.checkOut = checkOut;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
