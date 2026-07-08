package com.ecommerce.week7_ecommerce_backend.service;

import com.ecommerce.week7_ecommerce_backend.entity.Order;
import com.ecommerce.week7_ecommerce_backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}