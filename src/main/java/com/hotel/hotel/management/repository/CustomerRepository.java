
package com.hotel.hotel.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.hotel.management.entity.Customer;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    boolean existsByEmail(String email);
}
