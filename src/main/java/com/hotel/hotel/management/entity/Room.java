
package com.hotel.hotel.management.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String roomNumber;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @NotNull
    @DecimalMin("0.01")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Min(1)
    private int capacity = 1;

    private boolean available = true;

    public Room() {}

    public Long getId() { return id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) {
        this.available = available;
    }
}
