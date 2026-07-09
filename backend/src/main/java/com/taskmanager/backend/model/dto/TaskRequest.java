package com.taskmanager.backend.model.dto;

import com.taskmanager.backend.model.enums.TaskPriority;
import com.taskmanager.backend.model.enums.TaskStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskRequest {

    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
}