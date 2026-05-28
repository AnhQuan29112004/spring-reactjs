package com.example.demo.controller.command;

import com.example.demo.entity.Command;
import com.example.demo.service.CommandService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commands")
public class CommandController {

    private final CommandService commandService;

    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    @GetMapping
    public Page<Command> getAllCommands(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String donViGui,
        @RequestParam(required = false) String ngayNhan,
        @RequestParam(required = false) String loaiVanBan,
        @RequestParam(required = false) String trangThai,
        @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {
        return commandService.searchCommands(name,loaiVanBan, donViGui, ngayNhan, trangThai, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Command> getCommandById(@PathVariable Long id) {
        return commandService.getCommandById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Command> createCommand(@RequestBody Command command) {
        try {
            return ResponseEntity.ok(commandService.createCommand(command));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Command> updateCommand(@PathVariable Long id, @RequestBody Command commandDetails) {
        try {
            return ResponseEntity.ok(commandService.updateCommand(id, commandDetails));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommand(@PathVariable Long id) {
        try {
            commandService.deleteCommand(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCommands(@RequestBody List<Long> ids) {
        try {
            commandService.deleteCommands(ids);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Access denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.notFound().build();
        }
    }
}
