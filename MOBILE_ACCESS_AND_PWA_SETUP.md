# Mobile Access & PWA Setup Guide

## Overview
This guide covers two methods to access HIMS on mobile devices:
1. **Mobile Browser Access** - Access via phone's web browser
2. **Progressive Web App (PWA)** - Install as a native-like app

---

## Option 1: Mobile Browser Access

### Step 1: Find Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually something like `192.168.1.100`)

**On Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Step 2: Configure Laravel for Network Access

1. **Update `.env` file:**
```env
APP_URL=http://YOUR_IP_ADDRESS:8000
SESSION_DOMAIN=YOUR_IP_ADDRESS
SANCTUM_STATEFUL_DOMAINS=YOUR_IP_ADDRESS:8000
```

Replace `YOUR_IP_ADDRESS` with your actual IP (e.g., `192.168.1.100`)

2. **Start Laravel server accessible on network:**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### Step 3: Access from Mobile Device

1. **Ensure mobile device is on the same WiFi network** as your computer
2. **Open browser on your phone** (Chrome, Safari, etc.)
3. **Navigate to:** `http://YOUR_IP_ADDRESS:8000`
4. **Login** with your credentials

### Troubleshooting Mobile Browser Access

**Can't connect?**
- Check firewall settings on your computer
- Ensure both devices are on same network
- Try disabling Windows Firewall temporarily
- On Windows, allow port 8000:
  ```bash
  netsh advfirewall firewall add rule name="Laravel" dir=in action=allow protocol=TCP localport=8000
  ```

**Session issues?**
- Clear browser cache on mobile
- Check SESSION_DOMAIN in .env matches your IP
- Ensure cookies are enabled

---

## Option 2: Progressive Web App (PWA)

### What is a PWA?
A PWA allows your web app to be installed on mobile devices like a native app:
- ✓ Add to home screen
- ✓ Works offline (limited)
- ✓ Full-screen experience
- ✓ Push notifications
- ✓ Fast loading
- ✓ App-like feel

### Files Created

1. **`public/manifest.json`** - PWA configuration
2. **`public/sw.js`** - Service worker for offline support
3. **`public/offline.html`** - Offline fallback page
4. **`resources/views/app.blade.php`** - Updated with PWA meta tags

### Step 1: Generate App Icons

You need to create app icons in various sizes. Use an online tool like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

**Required icon sizes:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Save icons to:** `public/icons/`

Example structure:
```
public/
  icons/
    icon-72x72.png
    icon-96x96.png
    icon-128x128.png
    icon-144x144.png
    icon-152x152.png
    icon-192x192.png
    icon-384x384.png
    icon-512x512.png
```

### Step 2: Create Icons Folder

```bash
mkdir public/icons
```

Then add your generated icons to this folder.

### Step 3: Test PWA Installation

1. **Access app via mobile browser** (follow Option 1 steps)
2. **On Android (Chrome):**
   - Tap the menu (3 dots)
   - Select "Add to Home screen"
   - Confirm installation
   
3. **On iOS (Safari):**
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Confirm installation

4. **The app icon will appear on your home screen**

### Step 4: Verify PWA Features

**Check if PWA is working:**
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Manifest: Should show HIMS details
   - Service Workers: Should show registered worker
   - Cache Storage: Should show cached files

### PWA Features Implemented

#### 1. Offline Support
- App caches essential files
- Shows offline page when no connection
- Auto-reloads when connection restored

#### 2. App Shortcuts
Quick access to:
- Dashboard
- Inventory
- Messages

#### 3. Install Prompts
- Browser will prompt users to install
- Can be added to home screen manually

#### 4. Theme Integration
- Uses teal theme color (#0d9488)
- Matches app branding
- Status bar styling

#### 5. Responsive Design
- Works on all screen sizes
- Touch-friendly interface
- Mobile-optimized layouts

### Customizing PWA

**Change app name:**
Edit `public/manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Short Name"
}
```

**Change theme color:**
Edit `public/manifest.json` and `resources/views/app.blade.php`:
```json
{
  "theme_color": "#YOUR_COLOR"
}
```

**Add more shortcuts:**
Edit `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "New Shortcut",
      "url": "/your-route",
      "icons": [...]
    }
  ]
}
```

---

## Production Deployment

### For Production Server

1. **Update .env for production:**
```env
APP_URL=https://yourdomain.com
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

2. **Use HTTPS** (required for PWA features like push notifications)

3. **Configure web server** (Apache/Nginx) to serve PWA files:
```nginx
# Nginx example
location /manifest.json {
    add_header Cache-Control "public, max-age=604800";
}

location /sw.js {
    add_header Cache-Control "no-cache";
    add_header Service-Worker-Allowed "/";
}
```

4. **Test PWA on production:**
- Use Lighthouse in Chrome DevTools
- Check PWA score
- Verify all features work

---

## Testing Checklist

### Mobile Browser Access
- [ ] Can access app from mobile browser
- [ ] Login works correctly
- [ ] All pages load properly
- [ ] Forms submit successfully
- [ ] Images and assets load
- [ ] Responsive design works

### PWA Installation
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] Install prompt appears
- [ ] App installs to home screen
- [ ] App opens in standalone mode
- [ ] Icons display correctly
- [ ] Splash screen shows (Android)

### PWA Features
- [ ] Offline page displays when offline
- [ ] App caches resources
- [ ] Shortcuts work
- [ ] Theme color applies
- [ ] App name displays correctly
- [ ] Responsive on all devices

---

## Common Issues & Solutions

### Issue: PWA won't install
**Solution:**
- Ensure HTTPS in production (or localhost for testing)
- Check manifest.json is valid (use validator)
- Verify all icon paths are correct
- Check browser console for errors

### Issue: Service worker not registering
**Solution:**
- Check sw.js is accessible at /sw.js
- Clear browser cache
- Check for JavaScript errors
- Ensure HTTPS (required for service workers)

### Issue: Icons not showing
**Solution:**
- Verify icon files exist in public/icons/
- Check file paths in manifest.json
- Ensure correct image format (PNG)
- Check file permissions

### Issue: Offline mode not working
**Solution:**
- Check service worker is active
- Verify cache strategy in sw.js
- Test with DevTools offline mode
- Check offline.html exists

---

## Next Steps

1. **Generate app icons** using online tools
2. **Test on actual mobile devices**
3. **Configure production server** with HTTPS
4. **Submit to app stores** (optional, using PWA wrappers)
5. **Monitor PWA analytics** to track installations

---

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Use Chrome DevTools Application tab
3. Test with Lighthouse PWA audit
4. Verify all files are accessible
