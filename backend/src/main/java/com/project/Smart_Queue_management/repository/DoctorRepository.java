package com.project.Smart_Queue_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.Smart_Queue_management.entity.Doctor;


public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // We will use this later to fetch doctors
  // Inside DoctorRepository.java
  Optional<Doctor> findByDoctorId(Long doctorId);
  void deleteByDoctorId(Long doctorId);
}