package com.taskmanager.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

    @GetMapping("/websocket")
    public String websocket() {
        return "WebSocket is configured";
    }
}