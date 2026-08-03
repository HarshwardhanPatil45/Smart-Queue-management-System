package com.project.Smart_Queue_management.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;   // ✅ CORRECT IMPORT

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {
	
    @PostMapping("/predict")
    public Map<String, String> predictSpecialist(@RequestBody Map<String, String> request) {
        
        String input = request.get("symptom");
        String symptom = (input != null) ? input.toLowerCase() : "";
        
        String specialization = "MD Specialist"; 

        // --- CARDIOLOGIST ---
        if (symptom.contains("heart") || symptom.contains("chest") || symptom.contains("breath") || symptom.contains("pulse")) {
            specialization = "Cardiologist";
        } 
        // --- DERMATOLOGIST ---
        else if (symptom.contains("skin") || symptom.contains("rash") || symptom.contains("itch") || symptom.contains("pimple") || symptom.contains("acne")) {
            specialization = "Dermatologist";
        } 
        // --- NEUROLOGIST ---
        else if (symptom.contains("head") || symptom.contains("dizzy") || symptom.contains("migraine") || symptom.contains("brain") || symptom.contains("nerve")) {
            specialization = "Neurologist";
        }
        // --- GENERAL MD ---
        else if (symptom.contains("fever") || symptom.contains("stomach") || symptom.contains("cold") || symptom.contains("cough") || symptom.contains("vomit")) {
            specialization = "MD Specialist";
        }

        Map<String, String> response = new HashMap<>();
        response.put("specialization", specialization);
        return response;
    }
}
