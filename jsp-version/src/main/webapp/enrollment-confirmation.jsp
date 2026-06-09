<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.enrollment.model.*, java.util.*" %>
<%
    List<EnrolledCourse> enrollments =
        (List<EnrolledCourse>) session.getAttribute("enrollments");
    if (enrollments == null) enrollments = new ArrayList<>();

    int    totalCredits = 0;
    double totalCost    = 0;
    for (EnrolledCourse ec : enrollments) {
        totalCredits += ec.getCreditHours();
        totalCost    += ec.getTotalCost();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Enrollment Confirmed</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600;700;800;900&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="styles.css"/>
</head>
<body>

<header>
    <h1>Course Enrollment</h1>
    <a href="index.jsp" class="nav-link">&#8592; Browse Courses</a>
</header>

<div class="main">
<div class="confirmation-wrapper">
<div class="confirmation-card">

    <div class="check-circle">
        <span class="check-icon">&#10003;</span>
    </div>

    <h2 class="confirmation-title">Enrollment Confirmed Successfully!</h2>
    <p class="confirmation-subtitle">Your courses have been registered for this semester.</p>

    <div class="stats-row">
        <div class="stat-box">
            <div class="stat-box-label">Courses Enrolled</div>
            <div class="stat-box-value"><%= enrollments.size() %></div>
        </div>
        <div class="stat-box">
            <div class="stat-box-label">Total Credit Hours</div>
            <div class="stat-box-value"><%= totalCredits %></div>
        </div>
        <div class="stat-box">
            <div class="stat-box-label">Total Tuition</div>
            <div class="stat-box-value accent">$<%= String.format("%.2f", totalCost) %></div>
        </div>
    </div>

    <hr class="divider"/>

    <div class="thank-you">
        Thank you for enrolling! Your registration has been successfully submitted.
        Please check your student portal for your finalized schedule and any
        additional steps required to complete your enrollment.
    </div>

    <div class="actions">
        <a href="index.jsp" class="btn-primary">Browse More Courses</a>
        <a href="enrollment-summary.jsp" class="btn-secondary">View My Enrollment</a>
    </div>

</div>
</div>
</div>

</body>
</html>
