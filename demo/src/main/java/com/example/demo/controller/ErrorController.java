package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.webmvc.error.ErrorAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import java.util.Map;

@Controller
public class ErrorController implements org.springframework.boot.webmvc.error.ErrorController {

    private final ErrorAttributes errorAttributes;

    public ErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        WebRequest webRequest = new ServletWebRequest(request);
        
        // Cấu hình lấy thêm thông tin như MESSAGE và EXCEPTION để hiển thị chi tiết lỗi
        ErrorAttributeOptions options = ErrorAttributeOptions.defaults()
                .including(ErrorAttributeOptions.Include.MESSAGE)
                .including(ErrorAttributeOptions.Include.EXCEPTION);
        
        Map<String, Object> errors = this.errorAttributes.getErrorAttributes(webRequest, options);
        
        model.addAttribute("status", errors.getOrDefault("status", 500));
        model.addAttribute("error", errors.getOrDefault("error", "Internal Server Error"));
        model.addAttribute("message", errors.getOrDefault("message", "No message available"));
        model.addAttribute("path", errors.getOrDefault("path", ""));
        
        return "error/error"; // Trả về templates/error/error.html
    }
}
