package com.example.demo.service;

import com.example.demo.entity.Command;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.CommandRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.Util;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CommandService {

    private final CommandRepository commandRepository;
    private final UserRepository userRepository;
    private final Util util;

    public CommandService(CommandRepository commandRepository, UserRepository userRepository, Util util) {
        this.commandRepository = commandRepository;
        this.userRepository = userRepository;
        this.util = util;
    }

    public Page<Command> getAllCommands(Pageable pageable) {
        User currentUser = util.getCurrentUser();

        if (util.isLanhDao(currentUser) || util.isVanThu(currentUser)) {
            return commandRepository.findAll(pageable);
        }
        return Page.empty();
    }

    public Page<Command> searchCommands(String keyword,String loaiVanBan ,String donViGui, String ngayNhan, Pageable pageable) {
        User currentUser = util.getCurrentUser();

        if (util.isLanhDao(currentUser) || util.isVanThu(currentUser)) {
            return commandRepository.search(
                normalizeSearchTerm(keyword),
                normalizeSearchTerm(donViGui),
                normalizeSearchTerm(loaiVanBan),
                normalizeDateSearchTerm(ngayNhan),
                pageable
            );
        }

        return Page.empty();
    }

    public Optional<Command> getCommandById(Long id) {
        User currentUser = util.getCurrentUser();
        Optional<Command> command = commandRepository.findById(id);

        if (command.isEmpty()) {
            return Optional.empty();
        }

        if (util.isLanhDao(currentUser) || util.isVanThu(currentUser)) {
            return command;
        }

        return Optional.empty();
    }

    public Command createCommand(Command commandDetails) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (!util.isVanThu(currentUser)) {
            throw new RuntimeException("Ban khong co quyen tao cong van");
        }

        commandDetails.setUser(currentUser);
        commandDetails.setLanhDao(resolveLeader(commandDetails.getLanhDao()));
        commandDetails.setDa_phe_duyet(false);
        return commandRepository.save(commandDetails);
    }

    public Command updateCommand(Long id, Command commandDetails) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        if (!util.isVanThu(currentUser)) {
            throw new RuntimeException("Ban khong co quyen cap nhat cong van");
        }

        return commandRepository.findById(id).map(command -> {
            command.setSo_van_ban(commandDetails.getSo_van_ban());
            command.setNgay_ban_hanh(commandDetails.getNgay_ban_hanh());
            command.setNgay_nhan(commandDetails.getNgay_nhan());
            command.setDon_vi_gui(commandDetails.getDon_vi_gui());
            command.setNoi_dung(commandDetails.getNoi_dung());
            command.setLoai_van_ban(commandDetails.getLoai_van_ban());
            command.setFile(commandDetails.getFile());
            command.setLanhDao(resolveLeader(commandDetails.getLanhDao()));
            command.setDa_phe_duyet(commandDetails.isDa_phe_duyet());

            return commandRepository.save(command);
        }).orElseThrow(() -> new RuntimeException("Command not found"));
    }

    public void deleteCommand(Long id) {
        User currentUser = util.getCurrentUser();

        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        if (!util.isVanThu(currentUser)) {
            throw new RuntimeException("Ban khong co quyen xoa cong van");
        }

        Optional<Command> command = commandRepository.findById(id);
        if (command.isEmpty()) {
            throw new RuntimeException("Command not found");
        }

        commandRepository.deleteById(id);
    }

    public void deleteCommands(List<Long> ids) {
        for (Long id : ids) {
            deleteCommand(id);
        }
    }

    private User resolveLeader(User leaderDetails) {
        if (leaderDetails == null || leaderDetails.getId() <= 0) {
            throw new RuntimeException("Lanh dao phe duyet khong hop le");
        }

        User leader = userRepository.findById(leaderDetails.getId())
            .orElseThrow(() -> new RuntimeException("Khong tim thay lanh dao phe duyet"));

        if (leader.getRole() != Role.LANHDAO) {
            throw new RuntimeException("Nguoi duoc chon khong phai lanh dao");
        }

        return leader;
    }

    private String normalizeSearchTerm(String value) {
        if (value == null) {
            return "";
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? "" : normalizedValue;
    }

    private Date normalizeDateSearchTerm(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        if (normalizedValue.isEmpty()) {
            return null;
        }

        return Date.valueOf(normalizedValue);
    }
}
