package com.ecommerce.week7_ecommerce_backend.repository;

import com.ecommerce.week7_ecommerce_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

}