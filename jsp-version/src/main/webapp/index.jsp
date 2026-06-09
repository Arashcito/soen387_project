<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.enrollment.model.*, java.util.*" %>
<%
    // ── Handle POST (Enroll) ────────────────────────────────────────────────
    if ("POST".equals(request.getMethod())) {
        String courseId = request.getParameter("courseId");
        String section  = request.getParameter("section");

        if (courseId != null && section != null && !section.isEmpty()) {
            Course course = CourseData.findById(courseId);
            if (course != null) {
                List<EnrolledCourse> enrollments =
                    (List<EnrolledCourse>) session.getAttribute("enrollments");
                if (enrollments == null) {
                    enrollments = new ArrayList<>();
                    session.setAttribute("enrollments", enrollments);
                }
                // Prevent duplicate enrollment
                boolean alreadyEnrolled = false;
                for (EnrolledCourse ec : enrollments) {
                    if (ec.getCourse().getId().equals(courseId)) {
                        alreadyEnrolled = true;
                        break;
                    }
                }
                if (!alreadyEnrolled) {
                    enrollments.add(new EnrolledCourse(course, section, course.getCreditHours()));
                    session.setAttribute("info", course.getTitle() + " has been added to your enrollment.");
                }
            }
        }
        response.sendRedirect("index.jsp");
        return;
    }

    // ── GET: prepare page data ──────────────────────────────────────────────
    String info = (String) session.getAttribute("info");
    session.removeAttribute("info");

    List<EnrolledCourse> enrollments =
        (List<EnrolledCourse>) session.getAttribute("enrollments");

    Set<String> enrolledIds = new HashSet<>();
    if (enrollments != null) {
        for (EnrolledCourse ec : enrollments) {
            enrolledIds.add(ec.getCourse().getId());
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Course Listing</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600;700;800;900&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="styles.css"/>
</head>
<body>

<header>
    <h1>Available Courses</h1>
    <a href="enrollment-summary.jsp" class="nav-link">My Enrollment</a>
</header>

<div class="main">

    <% if (info != null) { %>
    <div class="message message-success">&#10003; <%= info %></div>
    <% } %>

    <div class="courses-container">
        <% for (Course c : CourseData.ALL_COURSES) {
               boolean enrolled = enrolledIds.contains(c.getId()); %>

        <div class="course-card">
            <h2 class="course-title"><%= c.getTitle() %></h2>

            <div class="course-meta">
                <div class="course-meta-item">
                    <span class="meta-label">Course Code:</span>
                    <span class="meta-value"><%= c.getCode() %></span>
                </div>
                <div class="course-meta-item">
                    <span class="meta-label">Instructor:</span>
                    <span class="meta-value"><%= c.getInstructor() %></span>
                </div>
                <div class="course-meta-item">
                    <span class="meta-label">Available Seats:</span>
                    <span class="meta-value"><%= c.getSeats() %></span>
                </div>
                <div class="course-meta-item">
                    <span class="meta-label">Credit Hours:</span>
                    <span class="meta-value"><%= c.getCreditHours() %></span>
                </div>
            </div>

            <div class="course-description"><%= c.getDescription() %></div>

            <% if (enrolled) { %>
            <div class="enrolled-badge">&#10003; Already Enrolled</div>
            <% } else { %>
            <form action="index.jsp" method="post" class="enrollment-controls">
                <input type="hidden" name="courseId" value="<%= c.getId() %>"/>
                <label class="section-label" for="sec-<%= c.getId() %>">Select section</label>
                <select id="sec-<%= c.getId() %>" name="section" class="section-select">
                    <option value="">Choose a time slot...</option>
                    <option value="Morning">Morning (9:00 AM - 11:00 AM)</option>
                    <option value="Afternoon">Afternoon (1:00 PM - 3:00 PM)</option>
                    <option value="Evening">Evening (6:00 PM - 8:00 PM)</option>
                </select>
                <button class="enroll-btn" type="submit">Enroll</button>
            </form>
            <% } %>
        </div>

        <% } %>
    </div>

</div>
</body>
</html>
