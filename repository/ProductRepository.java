package com.ecommerce.week7_ecommerce_backend.repository;

import com.ecommerce.week7_ecommerce_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}