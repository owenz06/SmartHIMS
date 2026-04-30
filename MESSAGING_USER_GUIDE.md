# Messaging System - User Guide

## 📱 Overview

The Hospital Inventory Management System includes a built-in messaging system that allows staff members to communicate directly with each other based on their roles and organizational hierarchy.

## 🔐 Who Can Message Whom?

### Messaging Hierarchy

The system enforces a hierarchical messaging structure to maintain proper communication channels:

#### Pharmacist
- ✅ **Can message**: Manager
- ❌ **Cannot message**: Procurement Officer, Admin, Super Admin

#### Manager  
- ✅ **Can message**: Pharmacist, Procurement Officer
- ❌ **Cannot message**: Admin, Super Admin (directly)

#### Procurement Officer
- ✅ **Can message**: Manager, Admin, Super Admin
- ❌ **Cannot message**: Pharmacist (directly)

#### Admin & Super Admin
- ✅ **Can message**: Everyone (unrestricted access)

### Why This Hierarchy?

This structure ensures:
- Proper chain of command
- Efficient communication flow
- Reduced message clutter
- Clear escalation paths
- Professional communication standards

## 🚀 Getting Started

### Accessing Messages

1. Click on **"Messages"** in the sidebar navigation
2. You'll see the Messages page with two panels:
   - **Left Panel**: Your conversations
   - **Right Panel**: Message thread or empty state

### Understanding the Interface

#### Conversation List (Left Panel)
- Shows all your active conversations
- Displays the other person's name and role
- Shows the latest message preview
- Displays when the last message was sent
- **Red badge** with number = unread messages
- **Search bar** at the top to find conversations

#### Message Thread (Right Panel)
- Shows the full conversation with selected person
- Your messages appear on the **right** (blue background)
- Received messages appear on the **left** (gray background)
- Each message shows:
  - Sender name (for received messages)
  - Message content
  - Timestamp
  - Read status (✓ = sent, ✓✓ = read)

## 💬 Sending Messages

### Starting a New Conversation

1. Click the **"New"** button (top of conversation list)
2. You'll see a list of people you can message
3. Click on a person's name to select them
4. Type your message in the text box at the bottom
5. Press **Enter** to send (or click the Send button)

**Note**: You'll only see people you're authorized to message based on your role.

### Replying to an Existing Conversation

1. Click on a conversation from the list
2. The message thread will open on the right
3. Type your message in the text box at the bottom
4. Press **Enter** to send

### Message Input Tips

- **Enter** = Send message
- **Shift + Enter** = New line (for multi-line messages)
- Maximum message length: 5,000 characters
- Messages are plain text (no formatting)

## 📬 Managing Conversations

### Viewing Unread Messages

- **Sidebar Badge**: Red dot with number shows total unread messages
- **Conversation Badge**: Red circle with number shows unread per conversation
- Unread count updates automatically every 30 seconds

### Reading Messages

- Click on a conversation to open it
- Messages are automatically marked as read when you view them
- The sender will see double check marks (✓✓) when you've read their message

### Searching Conversations

1. Use the search bar at the top of the conversation list
2. Type a person's name or email
3. Conversations are filtered in real-time

### Searching for New Recipients

1. Click **"New"** to start a new conversation
2. Use the search bar to find specific people
3. Only authorized recipients will appear

## 🎯 Common Scenarios

### Scenario 1: Pharmacist Needs to Request Stock

**Problem**: Running low on Paracetamol, need to inform Manager

**Solution**:
1. Go to Messages
2. Click "New" if no existing conversation with Manager
3. Select your Manager from the list
4. Type: "We're running low on Paracetamol (50 tablets left). Can you create a stock request?"
5. Press Enter to send

### Scenario 2: Manager Coordinating with Procurement

**Problem**: Need to follow up on pending purchase order

**Solution**:
1. Go to Messages
2. Find conversation with Procurement Officer (or start new one)
3. Type: "Hi, checking on the status of PO #12345 for surgical supplies"
4. Press Enter to send

### Scenario 3: Procurement Officer Updating Admin

**Problem**: Supplier delivery delayed, need to inform Admin

**Solution**:
1. Go to Messages
2. Click "New" and select Admin or Super Admin
3. Type: "FYI - PharmaCorp delivery delayed by 2 days due to logistics. New ETA: March 15"
4. Press Enter to send

### Scenario 4: Admin Broadcasting Important Update

**Problem**: Need to inform all staff about system maintenance

**Solution**:
1. Go to Messages
2. Send individual messages to key personnel (Manager, Procurement Officer, Pharmacist)
3. Type: "System maintenance scheduled for Saturday 10 PM - 2 AM. Please complete all critical tasks before then."
4. Press Enter to send to each person

## 🔔 Notifications

### Unread Badge

- **Location**: Sidebar navigation, next to "Messages"
- **Appearance**: Red dot with number
- **Updates**: Every 30 seconds automatically
- **Click**: Takes you to Messages page

### Read Receipts

- **Single Check (✓)**: Message sent successfully
- **Double Check (✓✓)**: Message read by recipient
- **Location**: Bottom right of your sent messages

## 💡 Tips & Best Practices

### Communication Tips

✅ **Do's**:
- Be clear and concise
- Include relevant details (item names, quantities, dates)
- Use proper grammar and spelling
- Respond promptly to urgent messages
- Keep messages professional
- Use Messages for quick coordination

❌ **Don'ts**:
- Don't use Messages for formal documentation (use email)
- Don't send sensitive patient information
- Don't spam or send unnecessary messages
- Don't use all caps (considered shouting)
- Don't send very long messages (use email instead)

### Efficiency Tips

1. **Use Search**: Quickly find conversations instead of scrolling
2. **Check Unread Badge**: See at a glance if you have new messages
3. **Keyboard Shortcuts**: Use Enter to send, Shift+Enter for new lines
4. **Start Conversations Early**: Don't wait until it's urgent
5. **Follow Up**: If no response in reasonable time, follow up

### Professional Communication

- **Greet**: Start with "Hi [Name]" or "Hello"
- **Be Specific**: Include item codes, quantities, dates
- **Be Polite**: Use "please" and "thank you"
- **Close Properly**: End with "Thanks" or "Best regards"
- **Proofread**: Check your message before sending

## 🔍 Troubleshooting

### "I can't find someone to message"

**Reason**: You may not be authorized to message that person based on hierarchy

**Solution**: 
- Check the hierarchy rules above
- If you need to reach someone outside your hierarchy, ask your Manager or Admin to relay the message

### "My unread count isn't updating"

**Reason**: The system updates every 30 seconds

**Solution**:
- Wait a few seconds and it will update automatically
- Or refresh the page to force an update

### "I can't send a message"

**Possible Reasons**:
1. Message is empty
2. Message exceeds 5,000 characters
3. You're not authorized to message that person
4. Network connection issue

**Solution**:
- Check your message length
- Verify you selected an authorized recipient
- Check your internet connection
- Try refreshing the page

### "Messages aren't appearing in real-time"

**Reason**: The system uses polling (checks every 30 seconds), not real-time WebSocket

**Solution**:
- Wait up to 30 seconds for new messages to appear
- Or refresh the page to see new messages immediately
- This is normal behavior

## 📊 Message Statistics

### What's Tracked
- Total unread messages
- Unread messages per conversation
- Message read status
- Message timestamps
- Conversation activity

### What's NOT Tracked
- Message content (for privacy)
- Typing activity
- Online/offline status
- Message edit history (messages can't be edited)

## 🔒 Privacy & Security

### What's Protected
- ✅ Only authorized users can message each other
- ✅ Cannot access conversations you're not part of
- ✅ Messages are stored securely in the database
- ✅ Hierarchy rules enforced on backend

### What to Remember
- ❌ Messages cannot be edited after sending
- ❌ Messages cannot be deleted after sending
- ❌ All messages are permanent (for audit purposes)
- ❌ Admins may have access to message history

### Best Practices
- Don't share passwords or sensitive credentials
- Don't discuss patient-specific information
- Keep messages professional
- Use Messages for coordination, not documentation

## 📱 Mobile Usage

The messaging system is fully responsive and works on mobile devices:

- **Touch-friendly**: Large tap targets
- **Responsive layout**: Adapts to screen size
- **Mobile keyboard**: Works with mobile keyboards
- **Swipe gestures**: Standard mobile interactions

## 🆘 Getting Help

### For Technical Issues
- Contact System Admin
- Report bugs or errors
- Request feature enhancements

### For Communication Issues
- Follow the hierarchy
- Escalate through proper channels
- Use email for formal communication

### For Training
- Check Help & Support → User Guide
- Ask your Manager for guidance
- Practice with colleagues

## 📈 Future Enhancements

The messaging system may be enhanced in the future with:

- Real-time message delivery (WebSocket)
- File attachments (images, documents)
- Message editing and deletion
- Typing indicators
- Online/offline status
- Group conversations
- Push notifications
- Message search within conversations
- Voice messages
- Video calls

## 🎯 Quick Reference

### Keyboard Shortcuts
- **Enter**: Send message
- **Shift + Enter**: New line

### Message Limits
- **Maximum length**: 5,000 characters
- **Minimum length**: 1 character

### Update Frequency
- **Unread count**: Every 30 seconds
- **Conversation list**: On page load
- **Messages**: When conversation opened

### Hierarchy Quick Reference
```
Pharmacist → Manager
Manager → Pharmacist, Procurement Officer
Procurement Officer → Manager, Admin, Super Admin
Admin/Super Admin → Everyone
```

## 📞 Support

For questions or issues with the messaging system:

1. **Technical Problems**: Contact System Admin
2. **Access Issues**: Contact your Manager
3. **Feature Requests**: Submit through Help & Support
4. **Training**: Check User Guide or ask Manager

---

**Remember**: The messaging system is for quick coordination and communication. For formal documentation, reports, or official records, use the appropriate system features or email.
