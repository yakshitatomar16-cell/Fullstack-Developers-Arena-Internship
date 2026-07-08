package com.ecommerce.week7_ecommerce_backend.controller;

import com.ecommerce.week7_ecommerce_backend.entity.Order;
import com.ecommerce.week7_ecommerce_backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }
}