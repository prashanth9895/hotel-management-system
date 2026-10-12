
package com.hotel.hotel.management.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.hotel.management.entity.Booking;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) > 0
        FROM Booking b
        WHERE b.room.id = :roomId
          AND b.status <> 'CANCELLED'
          AND b.checkIn < :checkOut
          AND b.checkOut > :checkIn
        """)
    boolean hasDateConflict(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}
