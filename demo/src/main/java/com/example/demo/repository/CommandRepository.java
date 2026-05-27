package com.example.demo.repository;

import com.example.demo.entity.Command;
import com.example.demo.entity.User;
import java.sql.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommandRepository extends JpaRepository<Command, Long> {
    List<Command> findByUser(User user);

    @Query(
        """
        select c
        from Command c
        where (
               :keyword = ''
            or lower(coalesce(c.so_van_ban, '')) like lower(concat('%', :keyword, '%'))
            or lower(coalesce(c.noi_dung, '')) like lower(concat('%', :keyword, '%'))
        )
        and (
               :donViGui = ''
            or lower(coalesce(c.don_vi_gui, '')) like lower(concat('%', :donViGui, '%'))
        )
        and (
               :loaiVanBan = ''
            or lower(coalesce(c.loai_van_ban, '')) like lower(concat('%', :loaiVanBan, '%'))
        )
        and (
               :ngayNhan is null
            or c.ngay_nhan = :ngayNhan
        )
        and (
               :filterStatus = false
            or (:isStatusNull = true and c.trang_thai is null)
            or (:isStatusNull = false and c.trang_thai = :status)
        )
        """
    )
    Page<Command> search(
        @Param("keyword") String keyword,
        @Param("donViGui") String donViGui,
        @Param("loaiVanBan") String loaiVanBan,
        @Param("ngayNhan") Date ngayNhan,
        @Param("status") Command.Status status,
        @Param("isStatusNull") boolean isStatusNull,
        @Param("filterStatus") boolean filterStatus,
        Pageable pageable
    );
}
