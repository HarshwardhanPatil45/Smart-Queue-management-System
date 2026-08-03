package com.project.Smart_Queue_management.Config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .csrf(AbstractHttpConfigurer::disable)
	        // Ensure CORS is handled BEFORE authorization
	        .cors(cors -> cors.configurationSource(request -> {
	            CorsConfiguration config = new CorsConfiguration();
	            config.setAllowedOrigins(List.of("http://localhost:3000"));
	            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	            config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With")); // Be specific
	            config.setAllowCredentials(true);
	            return config;
	        }))
	     // 4. Define Access Rules (Open the specific endpoints)
            .authorizeHttpRequests(auth -> auth
                // ✅ OPEN ACCESS to these endpoints
                .requestMatchers("/api/admin/**").permitAll() 
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/queue/**").permitAll() // Fixes your Booking & Status 403
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/prescription/**").permitAll()
                
                // 🔒 Lock everything else
                .anyRequest().authenticated()
            );
	    return http.build();
	}
}