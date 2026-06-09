package com.enrollment.servlet;

import com.enrollment.model.Course;
import com.enrollment.model.CourseData;
import com.enrollment.model.EnrolledCourse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@WebServlet("/courses")
public class CourseListingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/html;charset=UTF-8");
        HttpSession session = req.getSession();
        String ctx = req.getContextPath();

        // Flash message set after a successful enroll
        String info = (String) session.getAttribute("info");
        session.removeAttribute("info");

        List<EnrolledCourse> enrollments = getEnrollments(session);
        Set<String> enrolledIds = new HashSet<>();
        for (EnrolledCourse ec : enrollments) {
            enrolledIds.add(ec.getCourse().getId());
        }

        PrintWriter out = resp.getWriter();
        printHead(out, ctx, "Course Listing");

        out.println("<header>");
        out.println("  <h1>Available Courses</h1>");
        out.println("  <a href='" + ctx + "/summary' class='nav-link'>My Enrollment</a>");
        out.println("</header>");
        out.println("<div class='main'>");

        if (info != null) {
            out.println("<div class='message message-success'>&#10003; " + info + "</div>");
        }

        out.println("<div class='courses-container'>");

        for (Course c : CourseData.ALL_COURSES) {
            boolean enrolled = enrolledIds.contains(c.getId());

            out.println("<div class='course-card'>");
            out.println("  <h2 class='course-title'>" + c.getTitle() + "</h2>");
            out.println("  <div class='course-meta'>");
            out.println("    <div class='course-meta-item'><span class='meta-label'>Course Code:</span><span class='meta-value'>" + c.getCode() + "</span></div>");
            out.println("    <div class='course-meta-item'><span class='meta-label'>Instructor:</span><span class='meta-value'>" + c.getInstructor() + "</span></div>");
            out.println("    <div class='course-meta-item'><span class='meta-label'>Available Seats:</span><span class='meta-value'>" + c.getSeats() + "</span></div>");
            out.println("    <div class='course-meta-item'><span class='meta-label'>Credit Hours:</span><span class='meta-value'>" + c.getCreditHours() + "</span></div>");
            out.println("  </div>");
            out.println("  <div class='course-description'>" + c.getDescription() + "</div>");

            if (enrolled) {
                out.println("  <div class='enrolled-badge'>&#10003; Already Enrolled</div>");
            } else {
                out.println("  <form action='" + ctx + "/courses' method='post' class='enrollment-controls'>");
                out.println("    <input type='hidden' name='courseId' value='" + c.getId() + "'/>");
                out.println("    <label class='section-label' for='sec-" + c.getId() + "'>Select section</label>");
                out.println("    <select id='sec-" + c.getId() + "' name='section' class='section-select'>");
                out.println("      <option value=''>Choose a time slot...</option>");
                out.println("      <option value='Morning'>Morning (9:00 AM - 11:00 AM)</option>");
                out.println("      <option value='Afternoon'>Afternoon (1:00 PM - 3:00 PM)</option>");
                out.println("      <option value='Evening'>Evening (6:00 PM - 8:00 PM)</option>");
                out.println("    </select>");
                out.println("    <button class='enroll-btn' type='submit'>Enroll</button>");
                out.println("  </form>");
            }

            out.println("</div>"); // course-card
        }

        out.println("</div>"); // courses-container
        out.println("</div>"); // main
        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String courseId = req.getParameter("courseId");
        String section  = req.getParameter("section");
        HttpSession session = req.getSession();
        String ctx = req.getContextPath();

        if (courseId == null || section == null || section.isEmpty()) {
            resp.sendRedirect(ctx + "/courses");
            return;
        }

        Course course = CourseData.findById(courseId);
        if (course == null) {
            resp.sendRedirect(ctx + "/courses");
            return;
        }

        List<EnrolledCourse> enrollments = getEnrollments(session);

        // Prevent duplicate enrollment
        for (EnrolledCourse ec : enrollments) {
            if (ec.getCourse().getId().equals(courseId)) {
                resp.sendRedirect(ctx + "/courses");
                return;
            }
        }

        enrollments.add(new EnrolledCourse(course, section, course.getCreditHours()));
        session.setAttribute("info", course.getTitle() + " has been added to your enrollment.");
        resp.sendRedirect(ctx + "/courses");
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    static void printHead(PrintWriter out, String ctx, String title) {
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'><head>");
        out.println("<meta charset='UTF-8'/>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'/>");
        out.println("<title>" + title + "</title>");
        out.println("<link href='https://fonts.googleapis.com/css2?family=Rubik:wght@600;700;800;900&display=swap' rel='stylesheet'/>");
        out.println("<link rel='stylesheet' href='" + ctx + "/styles.css'/>");
        out.println("</head><body>");
    }

    @SuppressWarnings("unchecked")
    static List<EnrolledCourse> getEnrollments(HttpSession session) {
        List<EnrolledCourse> list = (List<EnrolledCourse>) session.getAttribute("enrollments");
        if (list == null) {
            list = new ArrayList<>();
            session.setAttribute("enrollments", list);
        }
        return list;
    }
}
