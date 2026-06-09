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

@WebServlet("/summary")
public class EnrollmentSummaryServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("text/html;charset=UTF-8");
        HttpSession session = req.getSession();
        String ctx = req.getContextPath();

        // Flash warning (e.g. invalid credit hours)
        String warning = (String) session.getAttribute("warning");
        session.removeAttribute("warning");

        List<EnrolledCourse> enrollments = CourseListingServlet.getEnrollments(session);

        PrintWriter out = resp.getWriter();
        CourseListingServlet.printHead(out, ctx, "Enrollment Summary");

        out.println("<header>");
        out.println("  <h1>My Enrollment</h1>");
        out.println("  <a href='" + ctx + "/courses' class='nav-link'>&#8592; Continue Browsing</a>");
        out.println("</header>");
        out.println("<div class='main'>");

        if (warning != null) {
            out.println("<div class='message message-warning'>&#9888; " + warning + "</div>");
        }

        if (enrollments.isEmpty()) {
            out.println("<div class='empty-state'>");
            out.println("  <p>You have no enrolled courses yet.</p>");
            out.println("  <a href='" + ctx + "/courses' class='nav-link' style='display:inline-block;margin-top:1.2rem;'>Browse Courses</a>");
            out.println("</div>");
        } else {
            // ── Table ────────────────────────────────────────────────────────
            out.println("<div class='table-card'><div class='table-wrap'><table>");
            out.println("<thead><tr>");
            out.println("  <th>Course</th><th>Code</th><th>Section</th>");
            out.println("  <th>Credit Hours</th><th>Cost / Credit</th><th>Total Cost</th><th>Actions</th>");
            out.println("</tr></thead><tbody>");

            int totalCredits = 0;
            double totalCost = 0;

            for (EnrolledCourse ec : enrollments) {
                totalCredits += ec.getCreditHours();
                totalCost   += ec.getTotalCost();

                out.println("<tr>");
                out.println("  <td class='td-course-name'>" + ec.getCourse().getTitle() + "</td>");
                out.println("  <td class='td-code'>" + ec.getCourse().getCode() + "</td>");
                out.println("  <td><span class='section-badge'>" + ec.getSection() + "</span></td>");

                // Credit-hours cell with Update form
                out.println("  <td>");
                out.println("    <form action='" + ctx + "/summary' method='post' class='credit-form'>");
                out.println("      <input type='hidden' name='action'   value='update'/>");
                out.println("      <input type='hidden' name='courseId' value='" + ec.getCourse().getId() + "'/>");
                out.println("      <input type='number' name='credits'  class='credit-input' value='" + ec.getCreditHours() + "' min='1' max='4'/>");
                out.println("      <button type='submit' class='btn btn-update'>Update</button>");
                out.println("    </form>");
                out.println("  </td>");

                out.println("  <td class='td-cost'>$" + String.format("%.2f", EnrolledCourse.COST_PER_CREDIT) + "</td>");
                out.println("  <td class='td-total'>$" + String.format("%.2f", ec.getTotalCost()) + "</td>");

                // Remove form
                out.println("  <td>");
                out.println("    <form action='" + ctx + "/summary' method='post'>");
                out.println("      <input type='hidden' name='action'   value='remove'/>");
                out.println("      <input type='hidden' name='courseId' value='" + ec.getCourse().getId() + "'/>");
                out.println("      <button type='submit' class='btn btn-remove'>Remove</button>");
                out.println("    </form>");
                out.println("  </td>");
                out.println("</tr>");
            }

            out.println("</tbody></table></div></div>");

            // ── Totals bar ───────────────────────────────────────────────────
            out.println("<div class='totals-bar'>");
            out.println("  <div class='totals-stats'>");
            out.println("    <div class='stat'><span class='stat-label'>Enrolled Courses</span><span class='stat-value'>" + enrollments.size() + "</span></div>");
            out.println("    <div class='stat'><span class='stat-label'>Total Credit Hours</span><span class='stat-value'>" + totalCredits + "</span></div>");
            out.println("    <div class='stat'><span class='stat-label'>Total Tuition</span><span class='stat-value highlight'>$" + String.format("%.2f", totalCost) + "</span></div>");
            out.println("  </div>");
            out.println("  <form action='" + ctx + "/summary' method='post'>");
            out.println("    <input type='hidden' name='action' value='confirm'/>");
            out.println("    <button type='submit' class='confirm-btn'>Confirm Enrollment</button>");
            out.println("  </form>");
            out.println("</div>");
        }

        out.println("</div>"); // main
        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String action   = req.getParameter("action");
        String courseId = req.getParameter("courseId");
        HttpSession session = req.getSession();
        String ctx = req.getContextPath();

        List<EnrolledCourse> enrollments = CourseListingServlet.getEnrollments(session);

        switch (action == null ? "" : action) {

            case "update":
                try {
                    int credits = Integer.parseInt(req.getParameter("credits"));
                    if (credits <= 0) {
                        session.setAttribute("warning",
                            "Credit hours cannot be 0 or negative. Please enter a value between 1 and 4.");
                    } else if (credits > 4) {
                        session.setAttribute("warning",
                            "Credit hours cannot exceed 4.");
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
                break;

            case "remove":
                for (int i = 0; i < enrollments.size(); i++) {
                    if (enrollments.get(i).getCourse().getId().equals(courseId)) {
                        enrollments.remove(i);
                        break;
                    }
                }
                break;

            case "confirm":
                resp.sendRedirect(ctx + "/confirm");
                return;
        }

        resp.sendRedirect(ctx + "/summary");
    }
}
