package com.project.Smart_Queue_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.Smart_Queue_management.entity.Appointment;
import com.project.Smart_Queue_management.repository.AppointmentRepository;

@Service
public class QueueService {

    @Autowired
    private AppointmentRepository appointmentRepository; // ✅ FIXED VARIABLE TYPE

    // Example methods (Keep whatever logic you had, just fix the repository usage)
    
    public Appointment bookToken(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
