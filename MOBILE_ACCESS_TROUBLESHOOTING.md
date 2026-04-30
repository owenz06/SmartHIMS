# Mobile Access Troubleshooting Guide

## Step-by-Step Diagnosis

### Step 1: Verify Server is Running
On your computer, run:
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

You should see:
```
INFO  Server running on [http://0.0.0.0:8000]
```

**Keep this terminal window open!**

### Step 2: Test on Computer First
Open browser on your computer and try:
```
http://localhost:8000
```

If this works, the server is running correctly.

### Step 3: Find Your Correct IP Address
Run this command:
```bash
ipconfig
```

Look for **"Wireless LAN adapter Wi-Fi"** section (not Ethernet):
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100  <-- This is your IP
```

Common IP ranges:
- `192.168.x.x` (most common)
- `10.x.x.x`
- `172.16.x.x` to `172.31.x.x`

### Step 4: Test IP on Computer
Try accessing from your computer using the IP:
```
http://YOUR_IP:8000
```

Example: `http://192.168.1.100:8000`

**If this doesn't work, it's a firewall issue.**

### Step 5: Disable Windows Firewall (Temporarily)
1. Press `Windows + R`
2. Type `firewall.cpl` and press Enter
3. Click "Turn Windows Defender Firewall on or off"
4. Select "Turn off" for both Private and Public networks
5. Click OK

**Now try accessing from your phone again.**

### Step 6: If Firewall Was the Issue
Re-enable firewall and add a rule:
```bash
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
```

### Step 7: Check if Phone is on Same Network
On your phone:
- Go to WiFi settings
- Check the network name
- Make sure it matches your computer's WiFi

### Step 8: Alternative - Use XAMPP
If Laravel serve doesn't work, use XAMPP:

1. **Move project to XAMPP:**
   ```bash
   # Copy your project to C:\xampp\htdocs\SHIMS
   ```

2. **Update .env:**
   ```env
   APP_URL=http://YOUR_IP/SHIMS/public
   ```

3. **Start XAMPP Apache**

4. **Access from phone:**
   ```
   http://YOUR_IP/SHIMS/public
   ```

### Step 9: Use ngrok (Easiest Solution)
If nothing else works, use ngrok to create a public URL:

1. **Download ngrok:** https://ngrok.com/download

2. **Extract and run:**
   ```bash
   ngrok http 8000
   ```

3. **You'll get a URL like:**
   ```
   https://abc123.ngrok.io
   ```

4. **Access from phone using that URL**

## Common Issues & Solutions

### Issue: "Connection Refused"
**Cause:** Server not running or wrong IP
**Solution:**
- Verify server is running with `--host=0.0.0.0`
- Double-check IP address
- Try `ipconfig /all` for more details

### Issue: "Connection Timeout"
**Cause:** Firewall blocking
**Solution:**
- Temporarily disable firewall
- Add firewall rule for port 8000
- Check antivirus isn't blocking

### Issue: "Different Network"
**Cause:** Phone on mobile data or different WiFi
**Solution:**
- Turn off mobile data on phone
- Connect to same WiFi as computer
- Check WiFi name matches

### Issue: "Works on Computer, Not Phone"
**Cause:** Firewall or network isolation
**Solution:**
- Disable firewall temporarily
- Check router settings for AP isolation
- Try ngrok as alternative

## Quick Test Commands

### Test 1: Check if port is listening
```bash
netstat -an | findstr :8000
```
Should show: `0.0.0.0:8000` or `[::]:8000`

### Test 2: Check firewall rules
```bash
netsh advfirewall firewall show rule name=all | findstr 8000
```

### Test 3: Ping from phone
On phone, use a network tool app to ping your computer's IP.

## Alternative Solutions

### Solution 1: Use XAMPP (Recommended)
- More stable for network access
- No firewall issues usually
- Easier to configure

### Solution 2: Use ngrok (Easiest)
- Works from anywhere
- No firewall configuration needed
- Free tier available
- Get public URL instantly

### Solution 3: Deploy to Cloud
- Use free hosting (Heroku, Railway, etc.)
- Access from anywhere
- No local network issues

## Recommended Approach

**For Development:**
1. Try Laravel serve with firewall disabled
2. If works, add firewall rule
3. If still fails, use XAMPP
4. If still fails, use ngrok

**For Testing with Team:**
- Use ngrok for quick sharing
- Or deploy to free cloud hosting

**For Production:**
- Deploy to proper hosting
- Use HTTPS
- Configure domain name

## Need More Help?

If none of these work, provide:
1. Output of `ipconfig`
2. Output of `netstat -an | findstr :8000`
3. Screenshot of server running
4. Your phone's WiFi network name
5. Your computer's WiFi network name
