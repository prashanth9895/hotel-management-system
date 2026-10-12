package com.hotel.hotel.management.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hotel.hotel.management.entity.Customer;
import com.hotel.hotel.management.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository customerRepository) {
        this.repository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Customer not found"));
    }

    public Customer createCustomer(Customer customer) {
        return repository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer customer = getCustomerById(id);

        // Update these fields according to your Customer entity.
        // Example fields may be name, email, and phone.
        customer.setFullName(updatedCustomer.getFullName());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setPhone(updatedCustomer.getPhone());

        return repository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        repository.delete(customer);
    }
}