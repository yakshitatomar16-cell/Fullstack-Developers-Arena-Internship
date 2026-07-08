package com.ecommerce.week7_ecommerce_backend.repository;

import com.ecommerce.week7_ecommerce_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}