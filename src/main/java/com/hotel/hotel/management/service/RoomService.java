
package com.hotel.hotel.management.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hotel.hotel.management.entity.Room;
import com.hotel.hotel.management.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository repository;

    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    public List<Room> getAllRooms() {
        return repository.findAll();
    }

    public Room getRoomById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Room not found"));
    }

    public Room createRoom(Room room) {
        if (repository.existsByRoomNumber(room.getRoomNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Room number already exists");
        }
        return repository.save(room);
    }

    public Room updateRoom(Long id, Room updated) {
        Room room = getRoomById(id);

        if (!room.getRoomNumber().equals(updated.getRoomNumber())
                && repository.existsByRoomNumber(updated.getRoomNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Room number already exists");
        }

        room.setRoomNumber(updated.getRoomNumber());
        room.setType(updated.getType());
        room.setPricePerNight(updated.getPricePerNight());
        room.setCapacity(updated.getCapacity());
        room.setAvailable(updated.isAvailable());

        return repository.save(room);
    }

    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        repository.delete(room);
    }
}

