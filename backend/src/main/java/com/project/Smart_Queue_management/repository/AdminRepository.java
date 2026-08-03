package com.project.Smart_Queue_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Smart_Queue_management.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Empty is fine! You don't need custom queries here yet.
  
}