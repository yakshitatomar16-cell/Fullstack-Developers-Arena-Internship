package com.ecommerce.week7_ecommerce_backend.dto;

public class OrderDTO {

    private Long userId;
    private double totalAmount;

    public OrderDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}