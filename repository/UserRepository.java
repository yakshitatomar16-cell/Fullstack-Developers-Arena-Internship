package com.ecommerce.week7_ecommerce_backend.repository;

import com.ecommerce.week7_ecommerce_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}