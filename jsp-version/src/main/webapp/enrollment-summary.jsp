<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.enrollment.model.*, java.util.*" %>
<%
    // Ensure the enrollment list exists in session
    List<EnrolledCourse> enrollments =
        (List<EnrolledCourse>) session.getAttribute("enrollments");
    if (enrollments == null) {
        enrollments = new ArrayList<>();
        session.setAttribute("enrollments", enrollments);
    }

    // ── Handle POST actions ─────────────────────────────────────────────────
    if ("POST".equals(request.getMethod())) {
        String action   = request.getParameter("action");
        String courseId = request.getParameter("courseId");

        if ("update".equals(action)) {
            try {
                int credits = Integer.parseInt(request.getParameter("credits"));
                if (credits <= 0) {
                    session.setAttribute("warning",
                        "Credit hours cannot be 0 or negative. Please enter a value between 1 and 4.");
                } else if (credits > 4) {
                    session.setAttribute("warning", "Credit hours cannot exceed 4.");
                } else {
                    for (EnrolledCourse ec : enrollments) {
                        if (ec.getCourse().getId().equals(courseId)) {
                            ec.setCreditHours(credits);
                            break;
                        }
                    }
                }
            } catch (NumberFormatException e) {
                session.setAttribute("warning", "Please enter a valid number for credit hours.");
            }
            response.sendRedirect("enrollment-summary.jsp");
            return;

        } else if ("remove".equals(action)) {
            for (int i = 0; i < enrollments.size(); i++) {
                if (enrollments.get(i).getCourse().getId().equals(courseId)) {
                    enrollments.remove(i);
                    break;
                }
            }
            response.sendRedirect("enrollment-summary.jsp");
            return;

        } else if ("confirm".equals(action)) {
            response.sendRedirect("enrollment-confirmation.jsp");
            return;
        }
    }

    // ── GET: retrieve and clear flash warning ───────────────────────────────
    String warning = (String) session.getAttribute("warning");
    session.removeAttribute("warning");

    // Compute totals
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
    <title>Enrollment Summary</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@600;700;800;900&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="styles.css"/>
</head>
<body>

<header>
    <h1>My Enrollment</h1>
    <a href="index.jsp" class="nav-link">&#8592; Continue Browsing</a>
</header>

<div class="main">

    <% if (warning != null) { %>
    <div class="message message-warning">&#9888; <%= warning %></div>
    <% } %>

    <% if (enrollments.isEmpty()) { %>

    <div class="empty-state">
        <p>You have no enrolled courses yet.</p>
        <a href="index.jsp" class="nav-link" style="display:inline-block;margin-top:1.2rem;">Browse Courses</a>
    </div>

    <% } else { %>

    <!-- Enrollment table -->
    <div class="table-card">
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Code</th>
                        <th>Section</th>
                        <th>Credit Hours</th>
                        <th>Cost / Credit</th>
                        <th>Total Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <% for (EnrolledCourse ec : enrollments) { %>
                    <tr>
                        <td class="td-course-name"><%= ec.getCourse().getTitle() %></td>
                        <td class="td-code"><%= ec.getCourse().getCode() %></td>
                        <td><span class="section-badge"><%= ec.getSection() %></span></td>
                        <td>
                            <form action="enrollment-summary.jsp" method="post" class="credit-form">
                                <input type="hidden" name="action"   value="update"/>
                                <input type="hidden" name="courseId" value="<%= ec.getCourse().getId() %>"/>
                                <input type="number" name="credits"  class="credit-input"
                                       value="<%= ec.getCreditHours() %>" min="1" max="4"/>
                                <button type="submit" class="btn btn-update">Update</button>
                            </form>
                        </td>
                        <td class="td-cost">$<%= String.format("%.2f", EnrolledCourse.COST_PER_CREDIT) %></td>
                        <td class="td-total">$<%= String.format("%.2f", ec.getTotalCost()) %></td>
                        <td>
                            <form action="enrollment-summary.jsp" method="post">
                                <input type="hidden" name="action"   value="remove"/>
                                <input type="hidden" name="courseId" value="<%= ec.getCourse().getId() %>"/>
                                <button type="submit" class="btn btn-remove">Remove</button>
                            </form>
                        </td>
                    </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Totals + Confirm -->
    <div class="totals-bar">
        <div class="totals-stats">
            <div class="stat">
                <span class="stat-label">Enrolled Courses</span>
                <span class="stat-value"><%= enrollments.size() %></span>
            </div>
            <div class="stat">
                <span class="stat-label">Total Credit Hours</span>
                <span class="stat-value"><%= totalCredits %></span>
            </div>
            <div class="stat">
                <span class="stat-label">Total Tuition</span>
                <span class="stat-value highlight">$<%= String.format("%.2f", totalCost) %></span>
            </div>
        </div>
        <form action="enrollment-summary.jsp" method="post">
            <input type="hidden" name="action" value="confirm"/>
            <button type="submit" class="confirm-btn">Confirm Enrollment</button>
        </form>
    </div>

    <% } %>

</div>
</body>
</html>
