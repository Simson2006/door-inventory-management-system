package com.doorinventory.door_inventory;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("active_page", "dashboard");
        model.addAttribute("page_title", "Inventory Dashboard");
        return "dashboard";
    }

    @GetMapping("/update_inventory")
    public String updateInventory(Model model) {
        model.addAttribute("active_page", "update_inventory");
        model.addAttribute("page_title", "Inventory");
        return "update_inventory";
    }

    @GetMapping("/transactions")
    public String transactions(Model model) {
        model.addAttribute("active_page", "transactions");
        model.addAttribute("page_title", "Transaction History");
        return "transactions";
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        model.addAttribute("active_page", "profile");
        model.addAttribute("page_title", "Inventory");
        return "profile";
    }
}
