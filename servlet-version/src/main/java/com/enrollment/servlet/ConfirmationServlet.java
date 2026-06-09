package com.enrollment.servlet;

import com.enrollment.model.EnrolledCourse;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/confirm")
public class ConfirmationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/html;charset=UTF-8");
        HttpSession session = req.getSession();
        String ctx = req.getContextPath();

        List<EnrolledCourse> enrollments = CourseListingServlet.getEnrollments(session);

        int totalCredits = 0;
        double totalCost = 0;
        for (EnrolledCourse ec : enrollments) {
            totalCredits += ec.getCreditHours();
            totalCost   += ec.getTotalCost();
        }

        PrintWriter out = resp.getWriter();
        CourseListingServlet.printHead(out, ctx, "Enrollment Confirmed");

        out.println("<header>");
        out.println("  <h1>Course Enrollment</h1>");
        out.println("  <a href='" + ctx + "/courses' class='nav-link'>&#8592; Browse Courses</a>");
        out.println("</header>");

        out.println("<div class='main'>");
        out.println("<div class='confirmation-wrapper'>");
        out.println("<div class='confirmation-card'>");

        out.println("  <div class='check-circle'><span class='check-icon'>&#10003;</span></div>");
        out.println("  <h2 class='confirmation-title'>Enrollment Confirmed Successfully!</h2>");
        out.println("  <p class='confirmation-subtitle'>Your courses have been registered for this semester.</p>");

        out.println("  <div class='stats-row'>");
        out.println("    <div class='stat-box'><div class='stat-box-label'>Courses Enrolled</div><div class='stat-box-value'>" + enrollments.size() + "</div></div>");
        out.println("    <div class='stat-box'><div class='stat-box-label'>Total Credit Hours</div><div class='stat-box-value'>" + totalCredits + "</div></div>");
        out.println("    <div class='stat-box'><div class='stat-box-label'>Total Tuition</div><div class='stat-box-value accent'>$" + String.format("%.2f", totalCost) + "</div></div>");
        out.println("  </div>");

        out.println("  <hr class='divider'/>");

        out.println("  <div class='thank-you'>Thank you for enrolling! Your registration has been successfully submitted. " +
                    "Please check your student portal for your finalized schedule and any additional steps required to complete your enrollment.</div>");

        out.println("  <div class='actions'>");
        out.println("    <a href='" + ctx + "/courses' class='btn-primary'>Browse More Courses</a>");
        out.println("    <a href='" + ctx + "/summary' class='btn-secondary'>View My Enrollment</a>");
        out.println("  </div>");

        out.println("</div>"); // confirmation-card
        out.println("</div>"); // confirmation-wrapper
        out.println("</div>"); // main
        out.println("</body></html>");
    }
}
