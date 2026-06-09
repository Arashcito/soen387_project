package com.enrollment.model;

import java.io.Serializable;

public class Course implements Serializable {
    private static final long serialVersionUID = 1L;

    private final String id;
    private final String title;
    private final String code;
    private final String instructor;
    private final int seats;
    private final int creditHours;
    private final String description;

    public Course(String id, String title, String code, String instructor,
                  int seats, int creditHours, String description) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.instructor = instructor;
        this.seats = seats;
        this.creditHours = creditHours;
        this.description = description;
    }

    public String getId()          { return id; }
    public String getTitle()       { return title; }
    public String getCode()        { return code; }
    public String getInstructor()  { return instructor; }
    public int    getSeats()       { return seats; }
    public int    getCreditHours() { return creditHours; }
    public String getDescription() { return description; }
}
