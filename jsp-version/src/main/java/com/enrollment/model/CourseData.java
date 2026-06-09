package com.enrollment.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class CourseData {

    public static final List<Course> ALL_COURSES = Collections.unmodifiableList(Arrays.asList(
        new Course("soen387", "Web Development", "SOEN387", "Dr. Smith", 25, 3,
            "Introduction to modern web applications and server-side development."),
        new Course("soen341", "Software Requirements", "SOEN341", "Prof. Ahmed", 18, 4,
            "Covers requirements elicitation, analysis, and documentation for software systems."),
        new Course("soen228", "Operating Systems", "SOEN228", "Dr. Lee", 12, 3,
            "Fundamental concepts of processes, threads, memory, scheduling, and file systems.")
    ));

    public static Course findById(String id) {
        if (id == null) return null;
        for (Course c : ALL_COURSES) {
            if (c.getId().equals(id)) return c;
        }
        return null;
    }
}
