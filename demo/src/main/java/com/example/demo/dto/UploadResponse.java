package com.example.demo.dto;

public record UploadResponse(
    String fileName,
    String originalName,
    String contentType,
    long size,
    String path
) {
}
