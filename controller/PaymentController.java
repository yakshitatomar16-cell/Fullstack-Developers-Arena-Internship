package com.ecommerce.week7_ecommerce_backend.controller;

import com.ecommerce.week7_ecommerce_backend.entity.Payment;
import com.ecommerce.week7_ecommerce_backend.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getPayments() {
        return paymentService.getAllPayments();
    }

    @PostMapping
    public Payment addPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }
}