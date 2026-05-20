# Data Schemas

## User Profile:
- `name`: string
- `phone`: string
- `city`: string
- `preferredLanguage`: string
- `totalBookings`: number
- `loyaltyDiscount`: boolean

## Booking Object:
- `id`: string (UUID or custom)
- `userId`: string
- `providerId`: string
- `serviceCategory`: string
- `description`: string
- `status`: string (pending/confirmed/en_route/in_progress/completed/disputed/cancelled)
- `scheduledAt`: string (ISO time)
- `address`: string
- `quotedPrice`: number
- `userBudget`: number
- `finalPrice`: number
- `paymentMethod`: cash / easypaisa / jazzcash
- `createdAt`: string
- `updatedAt`: string
- `traces`: AgentTrace[]
