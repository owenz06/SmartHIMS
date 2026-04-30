<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileUploadHelper
{
    /**
     * Upload a file to the specified path
     */
    public static function uploadFile(UploadedFile $file, string $path = 'uploads', array $allowedTypes = null): array
    {
        // Validate file type
        $allowedTypes = $allowedTypes ?? config('uploads.allowed_types.all');
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedTypes)) {
            throw new \InvalidArgumentException('File type not allowed');
        }

        // Validate file size
        $maxSize = config('uploads.max_size') * 1024; // Convert KB to bytes
        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException('File size exceeds maximum allowed size');
        }

        // Generate unique filename
        $filename = Str::uuid() . '.' . $extension;
        $fullPath = $path . '/' . $filename;

        // Store the file
        $storedPath = $file->storeAs($path, $filename, 'public');

        return [
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'path' => $storedPath,
            'url' => Storage::url($storedPath),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    /**
     * Upload and resize an image
     */
    public static function uploadImage(UploadedFile $file, string $path = 'uploads/images', array $sizes = null): array
    {
        $allowedTypes = config('uploads.allowed_types.images');
        $result = self::uploadFile($file, $path, $allowedTypes);

        // Create different sizes if specified
        if ($sizes) {
            $result['sizes'] = [];
            $originalPath = storage_path('app/public/' . $result['path']);

            foreach ($sizes as $sizeName => $dimensions) {
                $resizedFilename = pathinfo($result['filename'], PATHINFO_FILENAME) . '_' . $sizeName . '.' . pathinfo($result['filename'], PATHINFO_EXTENSION);
                $resizedPath = $path . '/' . $resizedFilename;
                $fullResizedPath = storage_path('app/public/' . $resizedPath);

                // Create resized image
                $image = Image::make($originalPath);
                $image->fit($dimensions[0], $dimensions[1]);
                $image->save($fullResizedPath);

                $result['sizes'][$sizeName] = [
                    'path' => $resizedPath,
                    'url' => Storage::url($resizedPath),
                ];
            }
        }

        return $result;
    }

    /**
     * Delete a file
     */
    public static function deleteFile(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }

    /**
     * Get file URL
     */
    public static function getFileUrl(string $path): string
    {
        return Storage::url($path);
    }

    /**
     * Validate file upload
     */
    public static function validateFile(UploadedFile $file, array $allowedTypes = null, int $maxSize = null): array
    {
        $errors = [];
        
        $allowedTypes = $allowedTypes ?? config('uploads.allowed_types.all');
        $maxSize = $maxSize ?? config('uploads.max_size') * 1024;
        
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedTypes)) {
            $errors[] = 'File type not allowed. Allowed types: ' . implode(', ', $allowedTypes);
        }
        
        if ($file->getSize() > $maxSize) {
            $errors[] = 'File size exceeds maximum allowed size of ' . ($maxSize / 1024) . 'KB';
        }
        
        return $errors;
    }
}