package com.enrollment.model;

import java.io.Serializable;

public class EnrolledCourse implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final double COST_PER_CREDIT = 150.0;

    private final Course course;
    private final String section;
    private int creditHours;

    public EnrolledCourse(Course course, String section, int creditHours) {
        this.course = course;
        this.section = section;
        this.creditHours = creditHours;
    }

    public Course getCourse()    { return course; }
    public String getSection()   { return section; }
    public int getCreditHours()  { return creditHours; }
    public void setCreditHours(int creditHours) { this.creditHours = creditHours; }
    public double getTotalCost() { return creditHours * COST_PER_CREDIT; }
}
