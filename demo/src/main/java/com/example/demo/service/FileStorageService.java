package com.example.demo.service;

import com.example.demo.dto.UploadResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private final Path root = Paths.get("uploads").toAbsolutePath().normalize();

    public UploadResponse storeImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (!IMAGE_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        return store(file, "images");
    }

    public UploadResponse storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        return store(file, "files");
    }

    private UploadResponse store(MultipartFile file, String folder) throws IOException {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalName.substring(dotIndex).replaceAll("[^a-zA-Z0-9.]", "");
        }

        String fileName = UUID.randomUUID() + extension;
        Path targetFolder = root.resolve(folder).normalize();
        Files.createDirectories(targetFolder);

        Path target = targetFolder.resolve(fileName).normalize();
        file.transferTo(target);

        String path = "/uploads/" + folder + "/" + fileName;
        return new UploadResponse(fileName, originalName, file.getContentType(), file.getSize(), path);
    }
}
