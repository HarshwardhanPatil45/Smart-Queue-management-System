package com.project.Smart_Queue_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Smart_Queue_management.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    // 👇 Add this line to find all doctors
    List<User> findByRole(String role);

  long countByRole(String string);

  
}