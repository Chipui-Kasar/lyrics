# Cloudinary Image Upload Implementation

This implementation adds Cloudinary image upload functionality to the admin panel for managing artist profile photos and song thumbnails.

## Features Implemented

### 1. Cloudinary Upload API (`/api/upload`)

- Handles file uploads to Cloudinary
- Automatically optimizes images (400x400, auto quality)
- Organizes uploads in folders (`tangkhul-lyrics/artists`)
- Returns secure URLs and public IDs

### 2. Image Upload Hook (`useImageUpload`)

- Manages upload state (loading, progress)
- Handles errors gracefully
- Provides reusable upload functionality

### 3. ImageUpload Component

- Dual mode: File upload or URL input
- Image preview functionality
- Upload progress indicator
- File validation (type, size)
- Easy switching between upload methods

### 4. Integration Points

#### Artists Form (`AddArtists.tsx`)

- Replaced simple text input with ImageUpload component
- Handles both file uploads and direct URL input
- Maintains existing functionality while adding new features

#### Lyrics Form (`AddLyrics.tsx`)

- Added thumbnail upload capability
- Same ImageUpload component for consistency
- Supports song cover art/thumbnail images

## Environment Variables Required

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## File Structure

```
src/
├── app/api/upload/route.ts         # Cloudinary upload API
├── components/
│   └── component/
│       └── Admin/
│           ├── ImageUpload/
│           │   └── ImageUpload.tsx # Reusable upload component
│           ├── Artists/
│           │   └── AddArtists.tsx  # Updated with image upload
│           └── Lyrics/
│               └── AddLyrics.tsx   # Updated with thumbnail upload
├── hooks/
│   └── useImageUpload.ts          # Upload hook
└── lib/
    └── imageUtils.ts              # Image validation utilities
```

## Usage

### For Artists

1. Navigate to Admin → Artists tab
2. Use the "Upload File" button to select an image
3. Or switch to "Enter URL" to provide a direct URL
4. Image preview shows immediately after upload/URL entry
5. Form submission saves the Cloudinary URL to MongoDB

### For Lyrics/Songs

1. Navigate to Admin → Lyrics tab
2. Same upload interface for song thumbnails
3. Supports both file upload and URL input
4. Thumbnail appears in form preview

## Image Optimizations

- **Automatic resizing**: 400x400 pixels
- **Smart cropping**: Focuses on faces for profile photos
- **Format optimization**: Auto-converts to WebP when supported
- **Quality optimization**: Automatically adjusts for best balance
- **CDN delivery**: Fast loading via Cloudinary's global CDN

## Security Features

- File type validation (images only)
- File size limits (5MB max)
- Secure upload tokens
- Organized folder structure
- Environment variable protection

## Database Integration

- Image URLs are stored in MongoDB
- No changes to existing data models required
- Backward compatible with existing image URLs
- URLs are automatically updated in artist/lyrics records

## Error Handling

- Comprehensive client-side validation
- Server-side error responses
- User-friendly error messages
- Graceful fallbacks for failed uploads
- Progress indicators for user feedback

## Next.js Configuration

Updated `next.config.mjs` to allow Cloudinary images:

- Added `res.cloudinary.com` to allowed domains
- Configured remote patterns for security
- Supports both legacy domains and modern patterns
