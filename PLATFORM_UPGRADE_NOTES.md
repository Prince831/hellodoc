# Platform Upgrade Documentation

## Overview
The platform has been completely upgraded from mock data to a fully functional Supabase-backed application with real-time features, proper hooks, and API integrations.

## Key Changes

### 1. Database Integration
- **Before**: All data was mocked in the frontend
- **After**: Full Supabase integration with real-time subscriptions

### 2. Upgraded Hooks

#### `useDoctors` Hook
- Now fetches doctors from Supabase `doctors` table
- Supports filtering by specialization and search terms
- Implements proper caching with React Query

#### `useMessages` Hook
- Connects to `conversations` and `messages` tables
- Real-time message updates using Supabase realtime
- Proper conversation management
- Message sending and reading functionality

#### `useNotifications` Hook
- Fetches notifications from Supabase `notifications` table
- Real-time notification updates
- Mark as read functionality
- Notification creation helper

#### `useAppointments` Hook
- Full CRUD operations with Supabase `appointments` table
- Automatic notification creation on appointment actions
- Proper query invalidation for data consistency

#### `useNotificationTriggers` Hook
- Sets up real-time triggers for important events
- Automatically creates notifications for:
  - Appointment status changes
  - New messages
  - System updates

### 3. App Initialization

#### `useInitializeApp` Hook
- Automatically checks if database is seeded
- Seeds doctors on first load if needed
- Displays loading state during initialization

#### `seedDoctors` Script
- Seeds the database with 5 sample doctors
- Includes complete doctor profiles with:
  - Contact information
  - Specializations
  - Working hours
  - Education and experience
  - Consultation fees

### 4. Real-time Features

All data now updates in real-time:
- **Messages**: New messages appear instantly
- **Notifications**: Notifications popup automatically
- **Appointments**: Status changes reflect immediately
- **Conversations**: Last message updates in real-time

### 5. Architecture Improvements

#### Before
```
Component → Mock Data → Display
```

#### After
```
Component → React Query Hook → Supabase Client → Database
              ↓                      ↓
         Cache/State            Real-time Subscription
```

### 6. Data Flow

1. **Initial Load**
   - App checks if doctors exist in database
   - Seeds database if empty
   - All hooks fetch initial data

2. **User Actions**
   - Actions trigger mutations
   - Mutations update Supabase
   - React Query invalidates affected queries
   - UI updates automatically

3. **Real-time Updates**
   - Supabase broadcasts changes
   - Hooks listen to changes
   - React Query updates cache
   - UI reflects changes instantly

## Database Schema

### Tables Used
- `doctors` - Healthcare providers
- `conversations` - Chat conversations between patients and doctors
- `messages` - Individual messages within conversations
- `appointments` - Scheduled appointments
- `notifications` - User notifications
- `profiles` - User profile information
- `medications` - User medications
- `health_records` - Medical records
- `lab_results` - Laboratory test results

## Environment Setup

The platform uses these Supabase environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anonymous key for client-side access

Both are already configured in `src/integrations/supabase/client.ts`.

## API Functions

### Supabase Edge Functions Used
- `analyze-symptoms`: AI-powered symptom analysis
- Additional functions can be added as needed

## Usage Examples

### Fetching Doctors
```typescript
const { data: doctors, isLoading } = useDoctors('Cardiology', 'John');
```

### Sending Messages
```typescript
const { handleSendMessage } = useMessages();
handleSendMessage('Hello doctor!');
```

### Creating Appointments
```typescript
const createMutation = useCreateAppointment();
createMutation.mutate({
  doctor_id: 'doctor-id',
  date: '2024-01-01T10:00:00Z',
  reason: 'Checkup'
});
```

### Managing Notifications
```typescript
const { notifications, markAsRead, unreadCount } = useNotifications();
markAsRead(notificationId);
```

## Performance Optimizations

1. **Query Caching**: All queries are cached for 5 minutes
2. **Optimistic Updates**: UI updates before server confirms
3. **Lazy Loading**: Components are loaded on demand
4. **Real-time Subscriptions**: Only subscribe to relevant data

## Error Handling

All hooks include:
- Try-catch blocks for error handling
- User-friendly toast notifications
- Proper error logging
- Graceful fallbacks

## Future Enhancements

Potential improvements:
1. Add user authentication
2. Implement pagination for large datasets
3. Add file upload for medical records
4. Implement video consultation features
5. Add appointment reminders
6. Implement search functionality across all data

## Testing

To test the platform:
1. Navigate to different pages
2. Create appointments
3. Send messages to doctors
4. Check notifications
5. Update profile information

All actions should persist to the database and reflect across sessions.

## Troubleshooting

### No doctors showing
- Check if database seeding ran successfully
- Verify Supabase connection
- Check browser console for errors

### Messages not updating
- Verify real-time subscriptions are active
- Check network tab for WebSocket connections
- Ensure RLS policies allow data access

### Notifications not appearing
- Check notification triggers are set up
- Verify notifications table has proper RLS policies
- Check browser console for subscription errors

## Demo User ID

The platform currently uses a demo user ID: `demo-user`

This allows testing without authentication. Replace with actual user IDs when authentication is implemented.
