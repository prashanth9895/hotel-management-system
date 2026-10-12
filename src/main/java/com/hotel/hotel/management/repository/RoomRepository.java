
package com.hotel.hotel.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.hotel.management.entity.Room;


public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomNumber(String roomNumber);

}
