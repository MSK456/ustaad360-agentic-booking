# Debugging & Error Recovery Journal

## 1. Expo Go Font Loading Mismatch
- **Symptom**: App crashed immediately on load on certain android devices.
- **Root Cause**: Ionicons referenced before custom fonts hydrated.
- **Fix**: Wrapped navigation render in conditional isFontLoaded state checks using standard font loader hooks.

## 2. Duplicate Keys / Rendering Crash
- **Symptom**: List render crashed when searching plumbers.
- **Root Cause**: Mock providers shared similar auto-generated indexes.
- **Fix**: Assured all key properties leverage specific unique UUID patterns.

## 3. Sector Realism coordinates Mismatch
- **Symptom**: Plumber in Lahore mapped with 1.2km distance for G-13 Islamabad address.
- **Root Cause**: Missing region validation logic inside DiscoveryAgent filters.
- **Fix**: Strictly segregated matches based on user's target city. Added sector boundaries in distance calculators.

## 4. Double Booking & User Overlaps
- **Symptom**: Booking confirmed for same provider at same time twice.
- **Root Cause**: Booking confirm screen committed directly without querying active stores.
- **Fix**: Integrated double-booking check utilizing `getActiveBookings` store references.
