package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.ui.Model;

@Controller
public class Test {
    @Value("${spring.application.name}")
    private String name;

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("name", name);
        return "test";
    }
}
