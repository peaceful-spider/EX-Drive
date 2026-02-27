# ElgoraX Drive - Complete Documentation

**Version:** 1.0.0  
**Last Updated:** February 27, 2026  
**Application Type:** Progressive Web App (PWA)  
**Tech Stack:** React 18.3.1, TypeScript, Tailwind CSS v4, Motion (Framer Motion), React Router 7

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Technical Stack](#2-architecture--technical-stack)
3. [Application Structure](#3-application-structure)
4. [Pages & Routes](#4-pages--routes)
5. [Core Features](#5-core-features)
6. [Components Documentation](#6-components-documentation)
7. [State Management](#7-state-management)
8. [Data Models & Types](#8-data-models--types)
9. [Workflows](#9-workflows)
10. [PWA Features](#10-pwa-features)
11. [UI/UX Patterns](#11-uiux-patterns)
12. [Security & Privacy](#12-security--privacy)

---

## 1. Project Overview

### 1.1 Application Mission
ElgoraX Drive is an **offline-first, privacy-focused cloud storage platform** designed to surpass traditional solutions like Google Drive. It emphasizes true file system views, zero-knowledge encryption, and an adaptive interface that serves both casual users and power users.

### 1.2 Key Differentiators
- **Offline-First Architecture**: Files accessible without internet connection
- **Privacy-First**: Zero-knowledge encryption option (Platinum plan)
- **Adaptive Interface**: Simple Mode vs. Power Mode
- **Advanced Organization**: Hierarchical tags, smart collections, rule-based filtering
- **Granular Sharing**: Time limits, device restrictions, view tracking
- **Mobile-First PWA**: Installable on all platforms with native-like experience

### 1.3 Target Users
- **Free Users**: Casual users needing basic cloud storage
- **Silver Users**: Students and individuals requiring offline access
- **Gold Users**: Professionals and freelancers needing advanced features
- **Platinum Users**: Enterprises requiring zero-knowledge encryption and audit logs

---

## 2. Architecture & Technical Stack

### 2.1 Frontend Stack
- **React 18.3.1**: Core UI library
- **TypeScript**: Type-safe development
- **React Router 7.13.0**: Client-side routing with data mode
- **Tailwind CSS 4.1.12**: Utility-first styling framework
- **Motion (Framer Motion) 12.23.24**: Advanced animations and transitions

### 2.2 UI Component Libraries
- **Radix UI**: Accessible headless component primitives
- **Lucide React 0.487.0**: Icon system
- **Sonner 2.0.3**: Toast notifications
- **Recharts 2.15.2**: Data visualization for analytics

### 2.3 Additional Libraries
- **React DnD 16.0.1**: Drag-and-drop interactions
- **React Hook Form 7.55.0**: Form management
- **Date-fns 3.6.0**: Date manipulation
- **React Resizable Panels 2.1.7**: Resizable layout panels

### 2.4 Build System
- **Vite 6.3.5**: Fast build tool and development server
- **PostCSS**: CSS processing

### 2.5 Project Structure
```
/src
  /app
    /components         # Reusable UI components
      /ui              # Base UI components (shadcn/ui style)
      /settings        # Settings page components
      /figma           # Image fallback utility
    /context           # React Context providers
    /routes            # Page components
    data.ts            # Mock data and initial state
    types.ts           # TypeScript type definitions
    App.tsx            # Root application component
  /lib
    utils.ts           # Utility functions (cn helper)
  /styles
    fonts.css          # Custom font imports
    index.css          # Global styles entry
    tailwind.css       # Tailwind imports
    theme.css          # CSS custom properties/tokens
manifest.json          # PWA manifest
vite.config.ts         # Vite configuration
```

---

## 3. Application Structure

### 3.1 Entry Point
**File:** `/src/app/App.tsx`

The root component that initializes:
- **AuthProvider**: Global authentication state
- **RouterProvider**: React Router setup
- **Toaster**: Toast notification system
- **PWA Meta Tags**: Mobile app configuration

### 3.2 Routing Structure

```typescript
Routes:
/ (Landing)          → Public, shows landing page for browsers
/auth                → Public, authentication gateway
/dashboard           → Private, main file management interface
/onboarding          → Private, new user setup flow
/plans               → Private, subscription management
/settings            → Private, user settings
/profile             → Private, user profile page
```

### 3.3 Route Guards
- **PrivateRoute**: Redirects to `/auth` if not authenticated
- **PublicRoute**: Allows access to landing and auth pages
- **Loading State**: Shows spinner during authentication check

---

## 4. Pages & Routes

### 4.1 Landing Page (`/`)
**File:** `/src/app/routes/Landing.tsx`

#### Purpose
Marketing page showcasing ElgoraX Drive features, plans, and benefits.

#### Key Sections

**a) Hero Section** (`#hero`)
- Main value proposition: "Your files. Your rules."
- CTA buttons: "View Demo" and "Join Waitlist"
- Demo credentials displayed:
  - Email: demo@elgorax.com
  - Password: Demo@123
- Animated background with blob gradients
- Floating dashboard screenshot with animated icons

**b) Preview Section** (`#preview`)
- Two-column grid showing product screenshots
- Smart File Manager preview
- Storage Analytics preview
- Descriptions of key functionality

**c) Why ElgoraX Section** (`#why`)
- 6 feature cards in grid layout:
  1. Full file ownership with zero-knowledge encryption
  2. Fast modern interface
  3. Smart organization system
  4. Desktop & mobile support
  5. Simple and power modes
  6. Enterprise-grade security

**d) Plans Section** (`#plans`)
- 4 pricing tiers displayed in grid:
  - **Free**: ₨0/month, 2GB storage
  - **Silver**: ₨10/month, 10GB storage
  - **Gold**: ₨99/month, 100GB storage (Most Popular)
  - **Platinum**: ₨299/month, 1TB storage
- Feature comparison with checkmarks

**e) Security Section** (`#security`)
- 3-column grid highlighting security features:
  1. Military-Grade Encryption (AES-256)
  2. Zero-Knowledge Architecture
  3. Privacy-First Design
- Animated lock icon with pulse effect

**f) Features Section** (`#features`)
- Feature showcase with icons
- Highlights of advanced capabilities

**g) Status Section** (`#status`)
- Waitlist email signup form
- Coming soon messaging

**h) FAQ Section** (`#faq`)
- 6 frequently asked questions with animated accordion
- "Expand All" / "Collapse All" toggle button
- Topics covered:
  - File migration
  - Storage amounts
  - Business vs. personal plans
  - Data security
  - Offline access
  - Payment methods

#### Navigation Features
- **Sticky Navigation Bar**: 
  - Fixed at bottom on initial load
  - Transitions to top sticky bar on scroll
  - Active section highlighting
  - Quick navigation to all sections

#### Mobile Features
- **PWA Detection**: Auto-redirects installed PWA users to login
- **Mobile App Popup**: 
  - Shows on first visit for mobile browsers
  - Promotes app installation
  - "Download App" CTA
  - Session storage to prevent repeated display

#### Animations
- Scroll-based animations using Motion
- Intersection Observer for section tracking
- Blob animations in background
- Floating icon animations
- Smooth section scrolling

---

### 4.2 Authentication Page (`/auth`)
**File:** `/src/app/routes/Auth.tsx`

#### Purpose
Complete authentication flow with signup, login, and verification.

#### Authentication Steps

**Step 1: Gateway** (`gateway`)
- Initial landing screen
- Two authentication options:
  1. **Google OAuth**: One-click sign-in
  2. **Email/Password**: Traditional form-based auth
- Privacy messaging: "ElgoraX encrypts your data locally before upload"

**Step 2: Login/Signup** (`login` / `signup`)
- **Smooth animated transition** between login and signup modes
- Forms expand/collapse based on mode

**Login Form Fields:**
- Email address (validated)
- Password (with show/hide toggle)
- "Don't have an account? Sign up" link

**Signup Form Fields:**
- Full Name (minimum 2 characters)
- Email address (validated with regex)
- Password (with strength indicator)
- Confirm Password (match validation)
- Terms of Service checkbox (required)

**Password Strength Indicator:**
- 5-bar visual indicator
- Real-time strength calculation based on:
  - Length (8+ characters)
  - Uppercase letters
  - Numbers
  - Special characters
- Color-coded: Weak (red) → Fair (yellow) → Good (blue) → Strong (green)

**Validation:**
- Real-time field validation
- Error messages with icons
- Success indicators (green checkmark for matching passwords)
- Required field enforcement

**Step 3: Email Verification** (`verify-email`)
- Post-signup screen
- Confirmation that verification email sent
- "Verify later" option to skip
- Animated shield icon with glow effect

**Step 4: Welcome Screen** (`welcome`)
- Typewriter animation of "Welcome [Name]"
- Animated shield icon
- Auto-redirects to dashboard after 2.5 seconds

#### Demo Login Feature
The landing page provides demo credentials for instant access:
- Clicking "View Demo" navigates to auth page
- Demo credentials pre-filled in login form

#### Authentication Flow
```
1. User clicks "Continue with Email" or "Continue with Google"
2. Form validation on input
3. Loading state during authentication
4. Success toast notification
5. Redirect to /onboarding (if new user) or /dashboard
```

#### Security Features
- Password visibility toggle
- Form validation prevents weak passwords
- Email format validation
- Terms acceptance required for signup

#### Animations
- Smooth form transitions using Motion AnimatePresence
- Field expansion/collapse animations
- Button hover/tap effects
- Background gradient animations

---

### 4.3 Onboarding Page (`/onboarding`)
**File:** `/src/app/routes/Onboarding.tsx`

#### Purpose
Two-step guided setup for new users to configure interface preferences and understand plan features.

#### Onboarding Steps

**Step 1: Mode Selection** (`mode-selection`)

**Purpose**: Choose interface complexity level

**Simple Mode Card:**
- Icon: LayoutGrid (green background)
- Features:
  - Minimal UI
  - Fewer controls
  - Beginner friendly
- Best for: Casual users, simple file browsing

**Power Mode Card:**
- Icon: Zap (blue background)
- Features:
  - Advanced sidebars
  - Detailed analytics
  - Security controls
- Best for: Power users, professionals

**Interaction:**
- Click card to select mode
- Selected card shows checkmark and highlight ring
- "Continue" button proceeds to next step
- Selection saved to localStorage via AuthContext

**Step 2: Plan Overview** (`plan-overview`)

**Purpose**: Display current plan features and upgrade options

**Free Plan Display:**
- Storage visualization: 0 GB / 5 GB
- Progress bar (animated)
- Included features:
  - ✓ 5 GB Storage
  - ✓ Basic Sharing
  - ✓ Basic Encryption
- Locked features (with hover tooltips):
  - 🔒 Smart Collections (Available in Gold)
  - 🔒 Advanced Analytics (Available in Gold)
  - 🔒 Zero-Knowledge Key (Available in Gold)

**Actions:**
- "Maybe later" button → Skip to dashboard
- "Upgrade to Gold" button → Update plan and redirect

**Visual Design:**
- Split layout: included vs. locked features
- Gradient styling for upgrade CTA
- Lock icons for premium features
- Tooltips explaining where features are available

#### Context Integration
- Saves `isPowerMode` preference to AuthContext
- Marks onboarding as complete
- Triggers dashboard tour on first visit

#### Flow Diagram
```
Authentication Success
    ↓
Onboarding: Mode Selection
    ↓
Onboarding: Plan Overview
    ↓
Dashboard (with optional tour)
```

---

### 4.4 Dashboard Page (`/dashboard`)
**File:** `/src/app/routes/Dashboard.tsx`

#### Purpose
Main application workspace for file management, organization, and collaboration.

#### Layout Structure

**Desktop Layout:**
```
┌─────────────────────────────────────────┐
│  Sidebar  │  Header                     │
│           ├──────────────────────────────┤
│           │  Power Mode Toolbar (opt)    │
│  Nav      ├──────────────────────────────┤
│  Items    │                              │
│           │  File Explorer               │
│           │                              │
│           │                              │
└───────────┴──────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────────────────────────┐
│  Header                                  │
├──────────────────────────────────────────┤
│                                          │
│  File Explorer                           │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Navigation (5 tabs)              │
└──────────────────────────────────────────┘
```

#### Main Components

**1. Sidebar** (Desktop only)
- Navigation items:
  - My Drive
  - Recent
  - Starred
  - Shared
  - Trash
  - Sync Inspector (Power Mode)
  - Analytics (Power Mode)
- Quick actions:
  - Create Folder
  - Upload File
- Power Mode toggle

**2. Header**
- Logo/Brand
- Search bar (global file search)
- View mode toggle (grid/list)
- Simple/Power mode switch
- User profile menu

**3. Power Mode Toolbar** (Conditional)
Visible only in Power Mode:
- 🏷️ Manage Tags
- ✨ Smart Collections
- 🔍 Advanced Search
- 📥 Offline Files

**4. File Explorer**
- Main content area
- Grid or List view
- Breadcrumb navigation
- File/folder display
- Multi-select support
- Context menu on right-click
- Drag-and-drop support (future)

**5. Bottom Navigation** (Mobile only)
- 5 navigation tabs:
  1. Home (My Drive)
  2. Recent
  3. Upload
  4. Starred
  5. Profile

#### State Management

**File System State:**
```typescript
files: FileItem[]           // All files and folders
tags: Tag[]                 // Tag definitions
collections: SmartCollection[]  // Smart collections
currentPath: string         // Current folder path
searchQuery: string         // Search filter
activeFilters: SearchFilters | null  // Advanced filters
```

**UI State:**
```typescript
viewMode: 'grid' | 'list'
showSyncInspector: boolean
showDetailsPanel: boolean
showTagManager: boolean
showSmartCollections: boolean
showVersionHistory: boolean
showStorageAnalytics: boolean
showAdvancedSearch: boolean
showSecurityPanel: boolean
showOfflineManager: boolean
```

**Modal State:**
```typescript
createFolderOpen: boolean
renameOpen: boolean
deleteOpen: boolean
shareOpen: boolean
uploadOpen: boolean
```

#### Feature Panels (Side Panels)

**Sync Inspector Panel:**
- Real-time sync status for all files
- Device-specific sync information
- Error reporting
- Manual retry options
- Filters: All, Syncing, Pending, Error, Offline

**Details Panel:**
- File metadata display
- Tag management for file
- Share status
- Version history access
- Activity log

**Tag Manager Panel:**
- Create new tags
- Edit existing tags (name, color, parent)
- Delete tags
- Hierarchical tag visualization
- Bulk tag operations

**Smart Collections Panel:**
- Create rule-based collections
- Rule builder with conditions:
  - Field: type, size, date, tags, name, extension, starred, shared
  - Operator: equals, contains, greaterThan, lessThan, in, notIn, before, after
  - Value: user input
- AND/OR conjunction support
- Collection preview (matching files)
- Edit/Delete existing collections

**Version History Panel:**
- Timeline of file versions
- Version comparison
- Restore previous version
- Download specific version
- Version comments

**Storage Analytics Panel:**
- Storage breakdown by file type (pie chart)
- Largest files list
- Duplicate detection
- Old files (90+ days) identification
- Quick cleanup actions:
  - Remove duplicates
  - Archive old files

**Advanced Search Panel:**
- Multi-criteria search builder
- File type filters
- Tag filters
- Size range filters
- Date range filters
- Starred files filter
- Search query input
- Real-time results preview

**Security Panel:**
- Per-file encryption settings
- Encryption type selection:
  - Client-side
  - Server-side
  - Zero-knowledge (Platinum only)
- Share permission management
- Access analytics

**Offline Manager Panel:**
- List of offline-available files
- Toggle offline availability
- Storage space used by offline files
- Sync status per file
- Bulk remove from offline

#### Actions & Operations

**File Operations:**
```typescript
handleCreateFolder(name: string)       // Create new folder
handleRename(newName: string)          // Rename file/folder
handleDelete()                         // Move to trash or permanent delete
handleToggleStar(ids: string[])        // Star/unstar files
handleUpload(fileList: FileList)       // Upload files
```

**Tag Operations:**
```typescript
handleCreateTag(tag: Omit<Tag, 'id'>)
handleUpdateTag(id: string, updates: Partial<Tag>)
handleDeleteTag(id: string)
handleAddTagToFile(fileId: string, tagId: string)
handleRemoveTagFromFile(fileId: string, tagId: string)
```

**Collection Operations:**
```typescript
handleCreateCollection(collection: Omit<SmartCollection, 'id' | 'createdAt' | 'updatedAt'>)
handleDeleteCollection(id: string)
handleSelectCollection(id: string)
```

**Version Operations:**
```typescript
handleRestoreVersion(versionId: string)
handleDownloadVersion(versionId: string)
```

**Analytics Operations:**
```typescript
handleCleanDuplicates()    // Remove duplicate files
handleArchiveOld()         // Archive files 90+ days old
```

**Context Menu Actions:**
- Open (folders)
- Download
- Share
- Rename
- Delete
- Star/Unstar
- Add Tag
- Toggle Offline
- View Versions
- View Details
- Security Settings

#### Filtering Logic

**Sidebar-Based Filtering:**
- **My Drive**: Shows folder hierarchy at current path
- **Recent**: All files sorted by updatedAt (descending)
- **Starred**: Files with starred=true
- **Shared**: Files with shared=true
- **Trash**: Files with trashed=true
- **Sync Inspector**: All files (panel shows sync status)
- **Analytics**: All files (panel shows analytics)

**Search Filtering:**
- Case-insensitive name matching
- Overrides sidebar filtering (shows all matching files)
- Works across entire file system

**Advanced Filtering:**
- Combines multiple criteria
- File types (image, video, document, etc.)
- Tag membership
- Starred status
- Size range
- Date range

#### Tour Overlay

**Triggers:**
- First-time dashboard visit (if `!hasSeenOnboarding`)
- 1.5 second delay after page load

**Tour Steps:**
1. Welcome message
2. File Explorer overview
3. Sidebar navigation
4. Power Mode features
5. Upload functionality
6. Search capabilities

**Actions:**
- Complete tour → Mark onboarding complete
- Dismiss → Skip tour, mark complete

#### PWA Install Prompt
- Detects if app is installable
- Shows install banner
- Promotes native app experience

---

### 4.5 Settings Page (`/settings`)
**File:** `/src/app/routes/Settings.tsx`

#### Purpose
Centralized configuration hub for account, security, storage, and preferences.

#### Page Layout

**Structure:**
```
┌──────────────────────────────────────────┐
│  Header: "Settings"                      │
│  User Name & Plan Badge                  │
├────────────┬─────────────────────────────┤
│  Sidebar   │  Content Area               │
│  Nav Tabs  │  Selected Tab Content       │
│            │                             │
│            │                             │
└────────────┴─────────────────────────────┘
```

#### Settings Tabs

**Account Group:**

**1. Profile Tab** (`profile`)
- Avatar display and edit
- Full name input
- Email address (requires verification to change)
- Display language selector (English, Urdu)
- Timezone selector
- "Save Profile Changes" button

**2. Security Tab** (`security`)
- Password management
- Two-Factor Authentication (2FA) setup
- Active sessions list
- Login history
- Trusted devices management

**3. Privacy Tab** (`privacy`)
- Data collection preferences
- Analytics opt-out
- Third-party sharing controls
- Download personal data option
- Account deletion

**4. Plan & Billing Tab** (`billing`)
- Current plan display
- Storage usage breakdown
- Payment method management
- Billing history
- Invoice downloads
- Upgrade/downgrade options

**System Group:**

**5. Storage Tab** (`storage`)
- Storage quota visualization
- File type breakdown
- Folder size analysis
- Auto-cleanup settings
- Trash auto-empty configuration

**6. Sync & Offline Tab** (`sync`)
- Sync settings per device
- Offline file management
- Bandwidth limits
- Sync schedule configuration
- Conflict resolution preferences

**7. Notifications Tab** (`notifications`)
- Email notification preferences
- Push notification settings
- Notification categories:
  - File activity
  - Sharing updates
  - Storage alerts
  - Security alerts
- Notification frequency

**Preferences Group:**

**8. Accessibility Tab** (`accessibility`)
- Interface scale
- High contrast mode
- Keyboard shortcuts reference
- Screen reader optimizations

**General Group:**

**9. Help & Support Tab** (`help`)
- App installation guide
- Community Discord link
- Documentation link
- Support tickets
- Feature requests

#### Settings Components

**Location:** `/src/app/components/settings/`

**PlanBillingSettings.tsx:**
- Subscription management
- Payment method CRUD
- Billing history table
- Plan comparison

**SecurityPrivacySettings.tsx:**
- Password change form
- 2FA setup wizard
- Privacy toggles
- Data export/delete

**StorageSyncSettings.tsx:**
- Storage analytics charts
- Sync device list
- Offline file manager
- Auto-cleanup scheduler

**PreferencesSettings.tsx:**
- Notification toggle grid
- Accessibility controls
- Language/timezone selectors

#### Mobile Responsiveness
- **Hamburger Menu**: Sidebar toggles on mobile
- **Collapsible Sidebar**: Overlay on small screens
- **Full-width Content**: Content fills screen when sidebar hidden

#### Power Mode Toggle
- Mini card at bottom of sidebar
- Visual switch component
- Persists to localStorage
- Immediate effect on dashboard

#### Logout Function
- Red "Sign Out" button at bottom of sidebar
- Clears authentication state
- Redirects to `/auth`
- Shows success toast

---

### 4.6 Plans Page (`/plans`)
**File:** `/src/app/routes/Plans.tsx`

#### Purpose
Subscription management and plan comparison page.

#### Page Sections

**1. Header**
- Back navigation button
- "Plans & Billing" title
- Fixed to top on scroll

**2. Current Plan Card**
- Plan name with badge
- Renewal date
- Storage usage progress bar
- Visual storage percentage

**3. Billing Cycle Toggle**
- Monthly vs. Yearly selector
- "Save 20%" badge on yearly option
- Affects displayed prices

**4. Plan Cards Grid**

**Free Plan:**
- ₨0/month
- 2GB storage
- Features:
  - ✓ Basic sharing
  - ✓ Standard encryption
  - ✓ Community support
- Missing:
  - ✗ Smart Collections
  - ✗ Advanced Analytics
  - ✗ Zero-knowledge
  - ✗ Priority Support

**Silver Plan:**
- ₨10/month
- 10GB storage
- Features:
  - ✓ Limited offline
  - ✓ Version history (30 days)
  - ✓ Standard encryption
- Missing:
  - ✗ Smart Collections
  - ✗ Advanced Analytics
  - ✗ Zero-knowledge

**Gold Plan:** (RECOMMENDED)
- ₨99/month
- 100GB storage
- Features:
  - ✓ Smart collections
  - ✓ Advanced sharing
  - ✓ Analytics
  - ✓ Priority Support
- Highlighted with amber gradient
- "RECOMMENDED" badge

**Platinum Plan:**
- ₨399/month
- 1TB storage
- Features:
  - ✓ Zero-knowledge encryption
  - ✓ Security panel
  - ✓ Audit logs
  - ✓ 24/7 Support
- Gradient background (dark theme)

#### Checkout Modal

**Triggers:**
- Click "Upgrade" button on any plan card
- Modal overlays page with blur backdrop

**Modal Content:**
- Selected plan name and billing cycle
- Price breakdown
- Payment method selector (pre-filled card)
- "Pay & Subscribe" CTA button
- Close (X) button

**Checkout Flow:**
```
1. User clicks "Upgrade" on plan
2. Modal appears with plan details
3. User confirms payment method
4. Click "Pay & Subscribe"
5. 1.5 second loading simulation
6. Plan updated via AuthContext
7. Success toast shown
8. Modal closes
```

#### Plan Update Logic
- Updates `user.plan` in AuthContext
- Persists to localStorage
- Reflects immediately in UI (header, profile, etc.)
- Shows success toast with plan name

#### Visual Features
- Hover animations on plan cards
- Disabled state for current plan
- Badge for recommended plan
- Gradient backgrounds for premium tiers
- Smooth modal entrance/exit animations

---

### 4.7 Profile Page (`/profile`)
**File:** `/src/app/routes/Profile.tsx`

#### Purpose
User identity display and quick access to account management.

#### Page Sections

**1. Identity Card**
- Large avatar (24x24 with initials)
- Camera edit button on hover
- User's full name
- Plan badge (colored by tier)
- Email address
- Verification status badge (green checkmark)
- Quick action buttons:
  - Edit Name
  - Verify Email
- Settings gear icon (top-right)

**2. Account Summary Cards**

**Account Identity Card:**
- Member Since: January 2024
- Last Login Device: Chrome on MacOS
- Last Login Location: San Francisco, US

**Storage & Plan Card:**
- Active plan name
- Storage used: 4.2 GB / 10 GB
- Progress bar visualization
- "Manage Plan" link → `/settings`

**3. Connected Accounts**
- Google Account card
  - Google logo
  - Connected email
  - "Disconnect" button (red)
- Support for additional OAuth providers (future)

**4. Security Snapshot Card**
- Dark indigo gradient background
- Shield icon
- Security Score: 85/100
- Recommendation: "Enable 2FA for 100%"
- "Manage Security" button → `/settings`

**5. Profile Actions**
- Three-button row:
  1. "Go to Settings" → `/settings`
  2. "Manage Plan" → `/plans`
  3. "Log Out" → Logout and redirect to `/auth`

#### Features
- Avatar upload functionality (camera button)
- Badge colors match plan tier
- Quick navigation to related pages
- Security score calculation
- Connected accounts management

---

## 5. Core Features

### 5.1 File Management

#### 5.1.1 File System Structure
- **Path-based Organization**: Unix-style paths (`/Projects/ClientA/file.pdf`)
- **Hierarchical Folders**: Nested folder support
- **Parent-Child Relationships**: Files linked via `parentId`

#### 5.1.2 File Operations

**Create Folder:**
```typescript
Input: Folder name
Process:
  1. Generate unique ID
  2. Create path based on current location
  3. Set parent folder ID
  4. Initialize with pending sync status
  5. Add to files array
Output: New folder appears in current view
Toast: "Folder [name] created"
```

**Upload Files:**
```typescript
Input: FileList from input or drag-drop
Process:
  1. Iterate through file list
  2. Detect file type (image/video/document)
  3. Generate unique ID and hash
  4. Set sync status to 'syncing'
  5. Add to files array
  6. Simulate sync completion after 2 seconds
Output: Files appear with progress indicator
Toast: "[count] file(s) uploaded" → "Upload complete"
```

**Rename File/Folder:**
```typescript
Input: New name string
Process:
  1. Validate name (non-empty)
  2. Update file name
  3. Update updatedAt timestamp
  4. Preserve path and other metadata
Output: File displays new name
Toast: "Renamed to [name]"
```

**Delete:**
```typescript
Input: File/folder ID(s)
Process:
  If in Trash view:
    - Permanently remove from files array
  Else:
    - Set trashed=true
    - Update updatedAt
Output: File moves to trash or disappears
Toast: "[count] item(s) moved to trash" or "permanently deleted"
```

**Star/Unstar:**
```typescript
Input: File ID(s)
Process:
  1. Toggle starred boolean
  2. Update multiple files if array
Output: Star icon filled/unfilled
Toast: "Star updated" or "Stars updated"
```

**Download:**
```typescript
Input: File ID
Process: (Simulated)
  1. Show toast notification
  2. In production: Generate download URL
Output: Toast: "Download started"
```

**Share:**
```typescript
Input: File ID
Process:
  1. Open ShareModal
  2. Configure permissions
  3. Set expiration
  4. Generate share link
Output: Share modal with options
```

#### 5.1.3 View Modes

**Grid View:**
- Cards with file icons/thumbnails
- File name below icon
- Sync status indicator
- Hover shows quick actions
- Multi-select with checkboxes

**List View:**
- Table layout
- Columns: Name, Size, Type, Modified, Sync Status
- Row hover highlights
- Sortable columns
- Inline actions

#### 5.1.4 Navigation

**Breadcrumb:**
- Shows current path hierarchy
- Clickable segments to navigate up
- Truncates long paths with ellipsis

**Folder Navigation:**
- Double-click folder to open
- Back button in header
- Sidebar navigation shortcuts

**Search Navigation:**
- Global search shows flat list
- Click file to view location
- Breadcrumb shows full path

### 5.2 Search & Discovery

#### 5.2.1 Global Search
- **Location**: Header search bar
- **Behavior**: Case-insensitive name matching
- **Scope**: All files (excluding trashed)
- **Real-time**: Updates as user types
- **Results**: Flat list view with full paths

#### 5.2.2 Advanced Search
- **Trigger**: Power Mode toolbar button
- **Features**:
  - Multi-field filtering
  - File type selection (image, video, document, etc.)
  - Tag filtering (multiple tags)
  - Size range slider
  - Date range picker
  - Starred files toggle
  - Combined query string
- **Results**: Live preview of matching files
- **Apply**: Filters file explorer view

#### 5.2.3 Smart Collections
- **Rule-Based Filtering**: Automated collections based on criteria
- **Rule Builder**:
  - Field selection: type, size, date, tags, name, extension, starred, shared
  - Operator selection: equals, contains, greaterThan, lessThan, in, notIn, before, after
  - Value input: text, number, date, array
  - Conjunction: AND / OR between rules
- **Saved Collections**: Persist in state
- **Dynamic Updates**: Collections update as files change
- **Examples**:
  - "Large Videos" → type=video AND size > 100MB
  - "Recent Starred" → starred=true AND date > 7 days ago
  - "Client Files" → tags in [ClientA, ClientB]

### 5.3 Organization System

#### 5.3.1 Hierarchical Tags

**Tag Structure:**
```typescript
Tag {
  id: string
  name: string
  color: string (hex)
  parentId?: string  // For nested tags
}
```

**Examples:**
- Finance
  - Invoices (child of Finance)
  - Receipts (child of Finance)
- Project Alpha
- Personal

**Tag Management:**
- Create with name, color, optional parent
- Edit name, color, parent relationship
- Delete (removes from all files)
- Color-coded in UI

**File Tagging:**
- Multiple tags per file
- Add/remove via Details Panel or Tag Manager
- Visual tag chips in file cards/rows
- Tag-based filtering in Advanced Search

#### 5.3.2 Smart Collections
*(Covered in 5.2.3)*

#### 5.3.3 Folder Structure
- Traditional hierarchical folders
- Path-based navigation
- Unlimited nesting depth
- Folder icons in file explorer

### 5.4 Sync & Offline

#### 5.4.1 Sync Status Types

```typescript
SyncStatus {
  state: 'synced' | 'syncing' | 'pending' | 'error' | 'offline'
  progress: number (0-100)
  lastSynced?: Date
  error?: string
  device?: string
}
```

**Visual Indicators:**
- **Synced**: Green checkmark
- **Syncing**: Blue spinner with progress %
- **Pending**: Gray clock icon
- **Error**: Red warning icon
- **Offline**: Yellow offline icon

#### 5.4.2 Sync Inspector Panel

**Purpose**: Monitor and manage sync across devices

**Features:**
- List all files with sync status
- Filter by status: All, Syncing, Pending, Error, Offline
- Device-specific sync information
- Last synced timestamp
- Manual retry for errors
- Sync queue management

**Use Cases:**
- Identify files not syncing
- Troubleshoot sync errors
- Monitor upload/download progress
- Ensure critical files synced before going offline

#### 5.4.3 Offline Manager

**Purpose**: Control offline file availability

**Features:**
- List of offline-available files
- Toggle offline for individual files
- Bulk remove from offline
- Storage space used calculation
- Sync status per offline file

**Workflow:**
1. User marks files "Available Offline"
2. Files download to device storage
3. Accessible without internet
4. Changes queue for sync when online
5. Conflict resolution on reconnect

#### 5.4.4 Offline-First Architecture
- Files cached locally using Service Worker
- PWA enables full offline functionality
- Background sync when connectivity restored
- Optimistic UI updates (instant feedback)

### 5.5 Collaboration & Sharing

#### 5.5.1 Share Permissions

**Permission Types:**
```typescript
SharePermission {
  role: 'viewer' | 'commenter' | 'editor'
  expiresAt?: Date           // Time-limited access
  allowDownload: boolean
  allowCopy: boolean
  watermark: boolean         // Add watermark to viewed files
  deviceRestricted?: string[] // Allowed device IDs
  locationRestricted?: string[] // Allowed IP ranges
  maxViews?: number          // View limit
  currentViews: number       // View count
}
```

**Role Capabilities:**
- **Viewer**: Can view files only
- **Commenter**: Can view and add comments
- **Editor**: Can view, comment, and edit

**Advanced Controls:**
- Time-limited access (expires after date)
- Download prevention
- Copy prevention
- Watermarking (adds user info overlay)
- Device restrictions (limit to specific devices)
- Location restrictions (IP-based access control)
- View limits (max number of views)

#### 5.5.2 Share Analytics

**Tracked Data:**
```typescript
ShareAnalytics {
  views: Array<{
    userId, userName, timestamp, device, location, ipAddress, duration
  }>
  downloads: Array<{
    userId, userName, timestamp, device
  }>
}
```

**Insights:**
- Who viewed/downloaded
- When accessed
- Device used
- Location (city/country)
- Time spent viewing
- Total view/download counts

**Use Cases:**
- Audit file access
- Verify recipient engagement
- Track document circulation
- Security monitoring

#### 5.5.3 Share Modal

**Features:**
- Share link generation
- Permission configuration
- Expiration date picker
- Device/location restrictions
- Download/copy toggles
- Watermark option
- View limit setting
- Recipient email input
- Copy link button

### 5.6 Version History

#### 5.6.1 Version Structure

```typescript
FileVersion {
  id: string
  fileId: string
  version: number
  size: number
  createdAt: Date
  createdBy: string
  comment?: string   // Version description
  changes?: string   // Change summary
  hash: string       // For integrity verification
}
```

#### 5.6.2 Version History Panel

**Features:**
- Timeline view of all versions
- Version metadata display
- Restore to previous version
- Download specific version
- Compare versions (visual diff)
- Version comments

**Workflow:**
```
1. User opens Version History panel
2. Sees timeline of file versions
3. Clicks "Restore" on older version
4. Confirmation dialog appears
5. File reverts to selected version
6. New version created (restore action logged)
```

**Retention:**
- Free Plan: 30-day history
- Silver Plan: 30-day history
- Gold Plan: 90-day history
- Platinum Plan: Unlimited history

### 5.7 Storage Analytics

#### 5.7.1 Analytics Dashboard

**Visualizations:**

**Storage Breakdown (Pie Chart):**
- By file type (images, videos, documents, etc.)
- Color-coded segments
- Percentage labels
- Interactive tooltips

**Largest Files Table:**
- Top 10 largest files
- Filename, size, location
- Quick actions (delete, move)

**Duplicate Detection:**
- Files with identical hash values
- Original vs. duplicate indicators
- Space savings calculation
- Bulk delete duplicates

**Old Files:**
- Files not accessed in 90+ days
- List with last accessed date
- Archive or delete options
- Space reclamation estimate

#### 5.7.2 Analytics Actions

**Clean Duplicates:**
```typescript
Process:
  1. Find all files with duplicateOf property
  2. Remove duplicates from files array
  3. Calculate space saved
  4. Show toast with count
Output: Toast: "[count] duplicate(s) removed"
```

**Archive Old:**
```typescript
Process:
  1. Filter files with updatedAt < 90 days ago
  2. Set trashed=true (or move to archive folder)
  3. Show toast with count
Output: Toast: "[count] old file(s) archived"
```

#### 5.7.3 Storage Visualization
- Progress bar showing used/total storage
- Color-coded: green < 80%, yellow 80-95%, red > 95%
- Breakdown by category
- Trend analysis (future)

### 5.8 Security & Privacy

#### 5.8.1 Encryption Types

**Client-Side Encryption:**
- Files encrypted in browser before upload
- Encryption keys stored locally
- Server cannot decrypt files

**Server-Side Encryption:**
- Files encrypted on server
- ElgoraX manages encryption keys
- Protects data at rest

**Zero-Knowledge Encryption:** (Platinum Plan)
- User-controlled encryption keys
- Keys never sent to server
- Complete privacy guarantee
- Recovery key required

#### 5.8.2 Security Panel

**Per-File Security Settings:**
```typescript
SecuritySettings {
  encrypted: boolean
  encryptionType: 'client' | 'server' | 'zero-knowledge'
  password?: string          // Optional password protection
  allowSharing: boolean
  allowPublicLink: boolean
  requireAuth: boolean       // Require login to access
}
```

**Security Panel UI:**
- Toggle encryption on/off
- Select encryption type (plan-dependent)
- Set file password
- Configure sharing permissions
- Enable/disable public links
- Require authentication toggle

#### 5.8.3 Privacy Features
- No file content scanning
- No ads or tracking
- GDPR compliant
- Data export available
- Account deletion option
- Audit logs (Platinum)

### 5.9 Context Menu

#### 5.9.1 Trigger
- Right-click on file/folder
- Appears at mouse position
- Backdrop dismisses menu

#### 5.9.2 Menu Actions

**All Files:**
- Open (folders only)
- Download
- Share
- Rename
- Delete
- Star/Unstar
- View Details

**Power Mode Additional:**
- Add Tag
- Toggle Offline
- View Versions
- Security Settings

**Conditional Actions:**
- "Open" only for folders
- "View Versions" only for files with versions
- "Security Settings" requires plan access

#### 5.9.3 Action Handling
```typescript
handleContextMenuAction(action: string, fileId: string) {
  switch (action) {
    case 'open': Navigate to folder path
    case 'download': Trigger download
    case 'share': Open ShareModal
    case 'rename': Open RenameModal
    case 'delete': Open ConfirmDeleteModal
    case 'star': Toggle starred state
    case 'add-tag': Open TagManager
    case 'offline': Toggle offlineAvailable
    case 'versions': Open VersionHistory panel
    case 'details': Open DetailsPanel
    case 'security': Open SecurityPanel
  }
}
```

### 5.10 Modals

#### 5.10.1 Create Folder Modal
- **Trigger**: Sidebar button, keyboard shortcut
- **Input**: Folder name (required)
- **Validation**: Non-empty name
- **Action**: Creates folder at current path
- **Toast**: "Folder [name] created"

#### 5.10.2 Rename Modal
- **Trigger**: Context menu, keyboard shortcut
- **Input**: New name (pre-filled with current name)
- **Validation**: Non-empty name
- **Action**: Updates file/folder name
- **Toast**: "Renamed to [name]"

#### 5.10.3 Delete Confirmation Modal
- **Trigger**: Delete action
- **Content**: 
  - Warning message
  - Item count
  - Permanent deletion warning (if in trash)
- **Actions**: Cancel, Delete
- **Toast**: "[count] item(s) moved to trash" or "permanently deleted"

#### 5.10.4 Share Modal
- **Trigger**: Share action
- **Sections**:
  - Link sharing
  - Permission settings
  - Expiration settings
  - Advanced restrictions
- **Actions**: Copy Link, Send Email, Save Settings

#### 5.10.5 Upload Modal
- **Trigger**: Upload button, drag-drop area
- **Features**:
  - File selection (multi-select)
  - Drag-and-drop zone
  - Progress indicators
  - Cancel upload
- **Toast**: "[count] file(s) uploaded"

---

## 6. Components Documentation

### 6.1 Layout Components

#### 6.1.1 Sidebar (`/src/app/components/Sidebar.tsx`)

**Purpose**: Main navigation component for desktop

**Props:**
```typescript
{
  activeItem: string
  onNavigate: (id: string) => void
  isPowerMode: boolean
  onCreateFolder: () => void
  onUploadFile: () => void
}
```

**Structure:**
- Logo/Brand section
- Navigation items (My Drive, Recent, Starred, Shared, Trash)
- Power Mode items (Sync Inspector, Analytics)
- Quick actions (Create Folder, Upload)
- Power Mode toggle switch

**Behavior:**
- Highlights active navigation item
- Conditionally shows Power Mode features
- Triggers modal opens
- Persists collapsed/expanded state

---

#### 6.1.2 Header (`/src/app/components/Header.tsx`)

**Purpose**: Top bar with search, view controls, and user menu

**Props:**
```typescript
{
  isPowerMode: boolean
  onToggleMode: () => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}
```

**Features:**
- Logo/Brand (mobile)
- Search bar with icon
- View mode toggle buttons
- Simple/Power mode switch
- User profile dropdown

**Responsive:**
- Hamburger menu on mobile
- Collapsible search on small screens

---

#### 6.1.3 BottomNav (`/src/app/components/BottomNav.tsx`)

**Purpose**: Mobile navigation bar (iOS/Android style)

**Props:** None (uses context)

**Structure:**
- 5 navigation tabs:
  1. **Home**: My Drive icon
  2. **Recent**: Clock icon
  3. **Upload**: Plus icon (opens modal)
  4. **Starred**: Star icon
  5. **Profile**: User avatar

**Behavior:**
- Highlights active tab
- Safe area inset support (iOS notch)
- Haptic feedback on tap
- Badge indicators for notifications

**Visibility:**
- Hidden on auth/onboarding/landing pages
- Visible only on authenticated pages
- Desktop: hidden (uses sidebar instead)

---

### 6.2 File Components

#### 6.2.1 FileExplorer (`/src/app/components/FileExplorer.tsx`)

**Purpose**: Main file listing component

**Props:**
```typescript
{
  files: FileItem[]
  currentPath: string
  onNavigate: (path: string) => void
  isPowerMode: boolean
  onDelete: (ids: string[]) => void
  onRename: (id: string) => void
  onShare: (id: string) => void
  onToggleStar: (ids: string[]) => void
  onDownload: (id: string) => void
  onContextMenu: (file: FileItem, x: number, y: number) => void
}
```

**View Modes:**

**Grid View:**
- Card-based layout
- File icons/thumbnails
- File name below icon
- Hover shows actions
- Multi-select checkboxes
- Sync status badge

**List View:**
- Table layout
- Columns: Name, Size, Type, Modified, Sync
- Sortable headers
- Row hover effects
- Inline actions

**Features:**
- Multi-select (shift-click, ctrl-click)
- Drag-and-drop (future)
- Empty state messaging
- Loading skeletons
- Infinite scroll (future)

---

#### 6.2.2 DetailsPanel (`/src/app/components/DetailsPanel.tsx`)

**Purpose**: Show detailed file information and metadata

**Props:**
```typescript
{
  file: FileItem
  tags: Tag[]
  onClose: () => void
  onAddTag: (fileId: string, tagId: string) => void
  onRemoveTag: (fileId: string, tagId: string) => void
}
```

**Sections:**
1. **File Info:**
   - Icon/thumbnail
   - Name
   - Type
   - Size (formatted)
   - Created date
   - Modified date
   - Owner

2. **Tags:**
   - Current tags (removable chips)
   - Add tag dropdown
   - Tag color indicators

3. **Sync Status:**
   - Current state
   - Progress bar (if syncing)
   - Last synced timestamp
   - Device name

4. **Sharing:**
   - Shared status
   - Number of recipients
   - Link to share settings

5. **Quick Actions:**
   - View Versions
   - Security Settings
   - Download
   - Delete

---

#### 6.2.3 ContextMenu (`/src/app/components/ContextMenu.tsx`)

**Purpose**: Right-click context menu

**Props:**
```typescript
{
  file: FileItem
  position: { x: number, y: number }
  onClose: () => void
  onAction: (action: string, fileId: string) => void
}
```

**Menu Items:**
- Open (folders)
- Download
- Share
- Rename
- Delete
- Star/Unstar
- Add Tag
- Toggle Offline
- View Versions
- View Details
- Security Settings

**Behavior:**
- Positions at mouse coordinates
- Adjusts if near screen edges
- Closes on action or backdrop click
- Keyboard navigation support

---

### 6.3 Feature Panels

#### 6.3.1 SyncInspector (`/src/app/components/SyncInspector.tsx`)

**Purpose**: Monitor sync status across all files

**Props:**
```typescript
{
  files: FileItem[]
  onClose: () => void
}
```

**Features:**
- Filter tabs: All, Syncing, Pending, Error, Offline
- File list with sync status
- Progress indicators
- Error messages
- Manual retry button
- Last synced timestamp
- Device information

**Layout:**
- Side panel (slides in from right)
- Scrollable file list
- Close button
- Filter chips at top

---

#### 6.3.2 TagManager (`/src/app/components/TagManager.tsx`)

**Purpose**: Create and manage tags

**Props:**
```typescript
{
  tags: Tag[]
  onCreateTag: (tag: Omit<Tag, 'id'>) => void
  onUpdateTag: (id: string, updates: Partial<Tag>) => void
  onDeleteTag: (id: string) => void
  onClose: () => void
}
```

**Features:**
- Tag list with color indicators
- Create tag form:
  - Name input
  - Color picker
  - Parent tag selector
- Edit tag (inline or modal)
- Delete tag (with confirmation)
- Hierarchical tree view

**Validation:**
- Unique tag names
- Valid hex color codes
- No circular parent relationships

---

#### 6.3.3 SmartCollections (`/src/app/components/SmartCollections.tsx`)

**Purpose**: Create rule-based file collections

**Props:**
```typescript
{
  collections: SmartCollection[]
  files: FileItem[]
  onCreateCollection: (collection: Omit<SmartCollection, 'id' | 'createdAt' | 'updatedAt'>) => void
  onDeleteCollection: (id: string) => void
  onSelectCollection: (id: string) => void
  onClose: () => void
}
```

**Rule Builder:**
- Field selector (type, size, date, tags, name, etc.)
- Operator selector (equals, contains, greaterThan, etc.)
- Value input (text, number, date, multi-select)
- Add rule button
- Rule list with delete option
- AND/OR conjunction toggle

**Preview:**
- Shows matching files count
- List of matching files
- Real-time updates as rules change

---

#### 6.3.4 VersionHistory (`/src/app/components/VersionHistory.tsx`)

**Purpose**: Display and manage file versions

**Props:**
```typescript
{
  file: FileItem
  onRestore: (versionId: string) => void
  onDownloadVersion: (versionId: string) => void
  onClose: () => void
}
```

**Features:**
- Timeline visualization
- Version cards:
  - Version number
  - Created date
  - Created by user
  - File size
  - Comment/changes
- Restore button (with confirmation)
- Download button
- Compare versions (visual diff)

**Restore Flow:**
```
1. User clicks "Restore" on version
2. Confirmation dialog appears
3. User confirms
4. File content replaced with selected version
5. New version created (marking restore action)
6. Toast notification
```

---

#### 6.3.5 StorageAnalytics (`/src/app/components/StorageAnalytics.tsx`)

**Purpose**: Visualize storage usage and optimize

**Props:**
```typescript
{
  files: FileItem[]
  onClose: () => void
  onCleanDuplicates: () => void
  onArchiveOld: () => void
}
```

**Charts:**
- Pie chart: Storage by file type
- Bar chart: Largest files
- List: Duplicate files
- List: Old files (90+ days)

**Actions:**
- "Clean Duplicates" button
- "Archive Old Files" button
- Per-file delete option

**Calculations:**
- Total storage used
- Storage by category
- Duplicate space waste
- Potential space savings

---

#### 6.3.6 AdvancedSearch (`/src/app/components/AdvancedSearch.tsx`)

**Purpose**: Build complex search queries

**Props:**
```typescript
{
  tags: Tag[]
  onSearch: (filters: SearchFilters) => void
  onClose: () => void
}
```

**SearchFilters Type:**
```typescript
{
  query: string
  fileTypes: FileType[]
  tags: string[]
  starred: boolean
  minSize?: number
  maxSize?: number
  dateRange: {
    start?: Date
    end?: Date
  }
}
```

**UI Components:**
- Text query input
- File type multi-select (checkboxes)
- Tag multi-select (checkboxes)
- Starred toggle
- Size range sliders
- Date range pickers
- "Search" button
- "Clear Filters" button
- Results count preview

---

#### 6.3.7 SecurityPanel (`/src/app/components/SecurityPanel.tsx`)

**Purpose**: Configure per-file security settings

**Props:**
```typescript
{
  file: FileItem
  onUpdateSecurity: (fileId: string, settings: SecuritySettings) => void
  onClose: () => void
}
```

**Settings:**
- Encryption toggle
- Encryption type selector:
  - Client-side
  - Server-side
  - Zero-knowledge (Platinum only)
- Password protection toggle
- Password input (if enabled)
- Allow sharing toggle
- Allow public link toggle
- Require authentication toggle

**Plan Restrictions:**
- Zero-knowledge only for Platinum
- Upgrade prompt if feature locked

---

#### 6.3.8 OfflineManager (`/src/app/components/OfflineManager.tsx`)

**Purpose**: Manage offline-available files

**Props:**
```typescript
{
  files: FileItem[]
  onToggleOffline: (fileId: string) => void
  onRemoveOffline: (fileIds: string[]) => void
  onClose: () => void
}
```

**Features:**
- List of offline files
- Storage space used calculation
- Toggle offline per file
- Bulk remove button
- Sync status indicators
- Sort by: name, size, last synced

---

### 6.4 Modal Components

*(Covered in section 5.10)*

All modals located in: `/src/app/components/Modals.tsx`

---

### 6.5 Onboarding Components

#### 6.5.1 TourOverlay (`/src/app/components/TourOverlay.tsx`)

**Purpose**: Guide new users through dashboard features

**Props:**
```typescript
{
  isOpen: boolean
  onComplete: () => void
  onDismiss: () => void
}
```

**Tour Steps:**
```typescript
[
  {
    target: '#file-explorer',
    title: 'Welcome to ElgoraX Drive',
    description: 'This is your file explorer...',
    placement: 'center'
  },
  {
    target: '#sidebar',
    title: 'Navigation',
    description: 'Use the sidebar to access...',
    placement: 'right'
  },
  // ... more steps
]
```

**Features:**
- Spotlight highlighting
- Step progression (1/5, 2/5, etc.)
- Skip tour option
- Complete tour option
- Backdrop dimming
- Pointer/arrow to target element

**Behavior:**
- Triggers on first dashboard visit
- Marks onboarding complete on finish/dismiss
- Can be re-triggered from settings

---

### 6.6 PWA Components

#### 6.6.1 InstallPrompt (`/src/app/components/InstallPrompt.tsx`)

**Purpose**: Promote PWA installation

**Props:** None (self-contained)

**Behavior:**
- Detects if app is installable
- Shows banner/modal after delay
- "Install" button triggers browser install prompt
- "Dismiss" hides prompt
- Don't show again option (session/localStorage)

**Trigger Conditions:**
- Not already installed
- Not dismissed in this session
- On dashboard or landing page
- After 5 seconds of page load

---

### 6.7 Settings Components

*(See section 4.5 for details)*

Located in: `/src/app/components/settings/`

---

## 7. State Management

### 7.1 Context Providers

#### 7.1.1 AuthContext (`/src/app/context/AuthContext.tsx`)

**Purpose**: Global authentication and user state

**State:**
```typescript
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isPowerMode: boolean
  hasSeenOnboarding: boolean
}
```

**Methods:**
```typescript
login(email: string, name?: string): Promise<void>
logout(): void
updatePlan(plan: PlanType): void
setPowerMode(mode: boolean): void
completeOnboarding(): void
```

**Persistence:**
- Stores user object in localStorage as 'elgorax_user'
- Stores power mode in localStorage as 'elgorax_power_mode'
- Stores onboarding status as 'elgorax_onboarding'
- Loads from localStorage on app initialization

**Hook:**
```typescript
const { user, isAuthenticated, login, logout, ... } = useAuth()
```

---

#### 7.1.2 DashboardContext (`/src/app/context/DashboardContext.tsx`)

**Purpose**: Dashboard-specific state

**State:**
```typescript
{
  activeSidebarItem: string
  uploadOpen: boolean
}
```

**Methods:**
```typescript
setActiveSidebarItem(item: string): void
setUploadOpen(open: boolean): void
```

**Hook:**
```typescript
const { activeSidebarItem, setActiveSidebarItem, uploadOpen, setUploadOpen } = useDashboard()
```

**Usage:**
- Coordinate sidebar selection across components
- Control upload modal visibility
- Share state between Sidebar and BottomNav

---

### 7.2 Local Component State

Dashboard component (`/src/app/routes/Dashboard.tsx`) manages:

**File System State:**
- `files: FileItem[]` - All files and folders
- `tags: Tag[]` - Tag definitions
- `collections: SmartCollection[]` - Smart collections
- `currentPath: string` - Current folder path
- `searchQuery: string` - Search input
- `activeFilters: SearchFilters | null` - Advanced search filters

**UI State:**
- `viewMode: 'grid' | 'list'` - File explorer view
- `showSyncInspector: boolean` - Sync panel visibility
- `showDetailsPanel: boolean` - Details panel visibility
- `showTagManager: boolean` - Tag manager visibility
- `showSmartCollections: boolean` - Collections panel visibility
- `showVersionHistory: boolean` - Version history panel visibility
- `showStorageAnalytics: boolean` - Analytics panel visibility
- `showAdvancedSearch: boolean` - Advanced search panel visibility
- `showSecurityPanel: boolean` - Security panel visibility
- `showOfflineManager: boolean` - Offline manager visibility

**Modal State:**
- `createFolderOpen: boolean`
- `renameOpen: boolean`
- `deleteOpen: boolean`
- `shareOpen: boolean`
- `uploadOpen: boolean` (synced with DashboardContext)

**Transient State:**
- `fileToRename: FileItem | null` - File being renamed
- `filesToDelete: string[]` - Files queued for deletion
- `fileToShare: FileItem | null` - File being shared
- `selectedFileForDetails: FileItem | null` - File shown in details
- `fileForVersionHistory: FileItem | null` - File shown in version history
- `fileForSecurity: FileItem | null` - File shown in security panel
- `contextMenu: { file: FileItem; x: number; y: number } | null` - Context menu state

---

### 7.3 Data Flow

**Typical Update Flow:**

```
User Action
    ↓
Event Handler (e.g., handleCreateFolder)
    ↓
State Update (e.g., setFiles([...files, newFolder]))
    ↓
Derived State Calculation (e.g., filteredFiles useMemo)
    ↓
Component Re-render
    ↓
UI Update (new folder appears)
    ↓
Toast Notification
```

**Example: Creating a Folder**

```typescript
1. User clicks "Create Folder" button in Sidebar
2. CreateFolderModal opens (setCreateFolderOpen(true))
3. User types "New Folder" and clicks "Create"
4. handleCreateFolder("New Folder") called
5. New FileItem created with:
   - Unique ID
   - Type: 'folder'
   - Path: currentPath + "/New Folder"
   - Parent ID from currentPath
6. setFiles([...files, newFolder])
7. Modal closes (setCreateFolderOpen(false))
8. Toast: "Folder 'New Folder' created"
9. FileExplorer re-renders with new folder
```

---

## 8. Data Models & Types

### 8.1 Core Types

**File:** `/src/app/types.ts`

#### 8.1.1 FileItem
```typescript
interface FileItem {
  id: string                      // Unique identifier
  name: string                    // Display name
  type: FileType                  // 'image' | 'video' | 'audio' | 'document' | 'archive' | 'folder'
  size: number                    // Size in bytes
  path: string                    // Unix-style path (e.g., '/Projects/ClientA/file.pdf')
  parentId: string | null         // Parent folder ID (null for root)
  tags: string[]                  // Array of tag IDs
  createdAt: Date
  updatedAt: Date
  syncStatus: SyncStatus
  version: number                 // Current version number
  shared?: boolean                // Shared with others
  starred?: boolean               // User starred
  trashed?: boolean               // In trash
  content?: string                // For text files or preview URL
  encrypted?: boolean
  encryptionType?: 'client' | 'server' | 'zero-knowledge'
  offlineAvailable?: boolean      // Cached for offline use
  owner: string                   // Owner username/email
  sharedWith?: SharePermission[]  // Share recipients
  versions?: FileVersion[]        // Version history
  activity?: ActivityLog[]        // Activity log
  hash?: string                   // Content hash for duplicate detection
  duplicateOf?: string            // ID of original file if duplicate
}
```

#### 8.1.2 Tag
```typescript
interface Tag {
  id: string
  name: string
  color: string                   // Hex color code
  parentId?: string               // For hierarchical tags
}
```

#### 8.1.3 SyncStatus
```typescript
interface SyncStatus {
  state: 'synced' | 'syncing' | 'pending' | 'error' | 'offline'
  progress: number                // 0-100
  lastSynced?: Date
  error?: string
  device?: string
}
```

#### 8.1.4 SharePermission
```typescript
interface SharePermission {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: 'viewer' | 'commenter' | 'editor'
  expiresAt?: Date                // Time-limited access
  allowDownload: boolean
  allowCopy: boolean
  watermark: boolean
  deviceRestricted?: string[]     // Device IDs
  locationRestricted?: string[]   // IP ranges
  maxViews?: number
  currentViews: number
  createdAt: Date
}
```

#### 8.1.5 FileVersion
```typescript
interface FileVersion {
  id: string
  fileId: string
  version: number
  size: number
  createdAt: Date
  createdBy: string
  comment?: string                // Version description
  changes?: string                // Change summary
  hash: string                    // Content hash
}
```

#### 8.1.6 SmartCollection
```typescript
interface SmartCollection {
  id: string
  name: string
  icon: string                    // Icon name or emoji
  color: string                   // Hex color code
  rules: CollectionRule[]
  createdAt: Date
  updatedAt: Date
}
```

#### 8.1.7 CollectionRule
```typescript
interface CollectionRule {
  id: string
  field: 'type' | 'size' | 'date' | 'tags' | 'name' | 'extension' | 'starred' | 'shared'
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'before' | 'after'
  value: string | number | string[]
  conjunction?: 'AND' | 'OR'      // How to combine with next rule
}
```

#### 8.1.8 ActivityLog
```typescript
interface ActivityLog {
  id: string
  fileId: string
  action: 'created' | 'modified' | 'renamed' | 'moved' | 'deleted' | 'shared' | 'downloaded' | 'viewed' | 'restored'
  userId: string
  userName: string
  timestamp: Date
  device: string
  location?: string
  details?: string
}
```

#### 8.1.9 User
```typescript
type User = {
  id: string
  name: string
  email: string
  avatar?: string
  plan: PlanType                  // 'free' | 'silver' | 'gold' | 'platinum'
}
```

---

### 8.2 Mock Data

**File:** `/src/app/data.ts`

**initialTags:**
```typescript
[
  { id: 't1', name: 'Project Alpha', color: '#3b82f6' },
  { id: 't2', name: 'Finance', color: '#10b981' },
  { id: 't3', name: 'Invoices', color: '#f59e0b', parentId: 't2' },
  { id: 't4', name: 'Personal', color: '#ec4899' },
  { id: 't5', name: 'Urgent', color: '#ef4444' },
]
```

**initialFiles:**
- Root folders: Projects, Photos
- Nested structure: Projects/ClientA/Contracts
- Sample files with various types and sync statuses
- Includes duplicates for testing
- Covers all sync states: synced, syncing, pending, error

---

## 9. Workflows

### 9.1 User Onboarding Flow

```
1. User lands on Landing Page (/)
   - Views features, plans, FAQs
   - Sees demo credentials
   
2. User clicks "View Demo" or "Get Started"
   - Redirects to /auth
   
3. Authentication (/auth)
   - Gateway: Choose Google or Email
   - If Email:
     a. Select Login or Signup
     b. Fill form with validation
     c. Submit
   - If Google:
     a. One-click OAuth
   
4. Email Verification (if signup)
   - Verification screen shown
   - Option to verify later
   
5. Welcome Screen
   - Typewriter animation
   - Auto-redirects to /onboarding
   
6. Onboarding - Mode Selection
   - Choose Simple or Power Mode
   - Saved to AuthContext
   
7. Onboarding - Plan Overview
   - View current plan (Free)
   - Option to upgrade to Gold
   - Option to skip
   
8. Redirect to Dashboard
   - Tour overlay appears (first time)
   - Dashboard loads with files
```

---

### 9.2 File Upload Workflow

```
Method 1: Upload Button
1. User clicks "Upload" in Sidebar or BottomNav
2. UploadModal opens
3. User clicks "Choose Files" or drag-drops files
4. Files selected
5. Modal shows file list with previews
6. User clicks "Upload"
7. Files added to state with 'syncing' status
8. Progress bars show 0%
9. Simulated upload (2 seconds)
10. Progress updates to 100%
11. Status changes to 'synced'
12. Toast: "[count] file(s) uploaded" → "Upload complete"
13. Modal closes

Method 2: Drag-and-Drop (Future)
1. User drags files over File Explorer
2. Drop zone highlights
3. User drops files
4. Same as steps 7-12 above
```

---

### 9.3 File Sharing Workflow

```
1. User right-clicks file
2. Context menu appears
3. User clicks "Share"
4. ShareModal opens with file info
5. User configures permissions:
   - Select role (viewer/commenter/editor)
   - Set expiration date (optional)
   - Toggle download/copy permissions
   - Enable watermark (optional)
   - Set device restrictions (optional)
   - Set view limit (optional)
6. User adds recipient email
7. User clicks "Generate Link" or "Send Email"
8. Link copied to clipboard / Email sent
9. File.shared = true
10. File.sharedWith array updated
11. Toast: "File shared successfully"
12. Modal closes
```

---

### 9.4 Search Workflow

**Simple Search:**
```
1. User types in header search bar
2. searchQuery state updates (real-time)
3. filteredFiles recalculates via useMemo
4. File Explorer shows matching files (flat list)
5. Breadcrumb shows full path for each file
6. User clears search or clicks file
```

**Advanced Search:**
```
1. User clicks "Advanced Search" in Power Mode toolbar
2. AdvancedSearch panel opens
3. User builds query:
   - Types search query
   - Selects file types (checkboxes)
   - Selects tags (checkboxes)
   - Toggles starred filter
   - Adjusts size range sliders
   - Picks date range
4. Preview shows matching count
5. User clicks "Search"
6. activeFilters state updates
7. filteredFiles recalculates
8. File Explorer shows results
9. Panel closes
10. User can clear filters from header
```

---

### 9.5 Tag Management Workflow

```
1. User clicks "Manage Tags" in Power Mode toolbar
2. TagManager panel opens
3. User sees list of existing tags (hierarchical view)

Creating Tag:
4a. User clicks "Create Tag"
5a. Form expands:
    - Name input
    - Color picker
    - Parent tag selector (optional)
6a. User fills form
7a. User clicks "Create"
8a. Tag added to tags array
9a. Toast: "Tag 'Name' created"

Editing Tag:
4b. User clicks edit icon on tag
5b. Inline edit or modal opens
6b. User changes name/color/parent
7b. User clicks "Save"
8b. Tag updated in tags array
9b. Toast: "Tag updated"

Deleting Tag:
4c. User clicks delete icon on tag
5c. Confirmation dialog appears
6c. User confirms
7c. Tag removed from tags array
8c. Tag removed from all files
9c. Toast: "Tag deleted"

Applying Tag to File:
10. User opens Details Panel for file
11. Clicks "Add Tag" dropdown
12. Selects tag
13. Tag added to file.tags array
14. Tag chip appears on file
15. Toast: "Tag added"
```

---

### 9.6 Offline Workflow

```
Marking File Offline:
1. User right-clicks file
2. Selects "Toggle Offline" from context menu
3. File.offlineAvailable = true
4. File begins downloading to local cache (simulated)
5. Sync status shows 'syncing' → 'synced'
6. Toast: "Made available offline"

Using Offline:
7. User goes offline (network disconnected)
8. Dashboard still loads (PWA service worker)
9. Only offline-available files are accessible
10. Non-offline files show "Requires internet" message
11. User can view/edit offline files
12. Changes queue for sync

Going Back Online:
13. Network reconnects
14. Queued changes sync automatically
15. Conflict resolution if needed
16. Toast: "Sync complete"

Managing Offline Files:
17. User clicks "Offline Files" in Power Mode toolbar
18. OfflineManager panel opens
19. List shows all offline files with storage used
20. User can toggle offline for individual files
21. User can bulk remove files from offline
22. Storage space freed
```

---

### 9.7 Version History Workflow

```
1. User right-clicks file
2. Selects "View Versions" from context menu
3. VersionHistory panel opens
4. Timeline shows all versions:
   - Version 3 (current) - Feb 17, 2026
   - Version 2 - Feb 14, 2026
   - Version 1 - Feb 10, 2026
5. Each version shows:
   - Version number
   - Created date
   - Created by user
   - File size
   - Comment (if any)
   - Actions: Restore, Download

Restoring Version:
6. User clicks "Restore" on Version 2
7. Confirmation dialog:
   "Restore file to Version 2? This will create a new version."
8. User confirms
9. File content replaced with Version 2
10. New Version 4 created (marking restore action)
11. File.version = 4
12. Toast: "Version 2 restored"
13. Panel updates to show Version 4

Downloading Version:
6. User clicks "Download" on Version 1
7. Download starts (specific version)
8. Toast: "Downloading Version 1"
```

---

### 9.8 Storage Analytics Workflow

```
1. User clicks "Analytics" in Sidebar (Power Mode)
   OR clicks "Analytics" in Settings
2. StorageAnalytics panel opens
3. Dashboard displays:
   
   a) Storage Breakdown Pie Chart:
      - Images: 40% (1.6 GB)
      - Videos: 30% (1.2 GB)
      - Documents: 20% (0.8 GB)
      - Other: 10% (0.4 GB)
   
   b) Largest Files Table:
      1. Site_Visit_Raw_Footage.mp4 - 4.5 GB
      2. Vacation_2025.jpg - 4.2 MB
      3. Design_Mockup_v2.png - 3.5 MB
      ...
   
   c) Duplicates Section:
      - Contract_2026_Final.pdf (original)
      - Contract_2026_Copy.pdf (duplicate)
      Potential savings: 2.5 MB
      [Clean Duplicates] button
   
   d) Old Files Section:
      - 3 files not accessed in 90+ days
      - Vacation_2025.jpg (last accessed: July 2025)
      - ...
      [Archive Old Files] button

Cleaning Duplicates:
4. User clicks "Clean Duplicates"
5. Confirmation dialog:
   "Delete 1 duplicate file(s)? This will free 2.5 MB."
6. User confirms
7. Duplicate files removed
8. Toast: "1 duplicate(s) removed"
9. Storage chart updates

Archiving Old Files:
4. User clicks "Archive Old Files"
5. Confirmation dialog:
   "Archive 3 old file(s)? Files will move to trash."
6. User confirms
7. Old files moved to trash
8. Toast: "3 old file(s) archived"
9. Storage chart updates
```

---

## 10. PWA Features

### 10.1 Progressive Web App Configuration

**Manifest:** `/manifest.json`

```json
{
  "name": "ElgoraX Drive",
  "short_name": "ElgoraX",
  "description": "Offline-first, privacy-focused cloud storage.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "icons": [...]
}
```

**Key Features:**
- **Standalone Display**: Full-screen app without browser chrome
- **Custom Theme Color**: Indigo (#4f46e5) for status bar
- **Custom Icons**: 192x192 and 512x512 for home screen and splash

---

### 10.2 Installation

**Detection:**
```typescript
// In Landing.tsx
const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
              (window.navigator as any).standalone ||
              document.referrer.includes('android-app://');

if (isPWA) {
  // Already installed, redirect to auth
  navigate('/auth');
}
```

**Install Prompt:**
- `InstallPrompt` component listens for `beforeinstallprompt` event
- Shows custom install banner
- Triggers browser install dialog on click
- Hides banner after installation or dismissal

**User Flow:**
```
1. User visits landing page in browser
2. After 5 seconds, install prompt appears
3. User clicks "Install"
4. Browser shows native install dialog
5. User confirms
6. App installs to home screen
7. Opening app from home screen:
   - Launches in standalone mode
   - Detects PWA and redirects to /auth (skipping landing)
```

---

### 10.3 Offline Capabilities

**Service Worker (Future):**
- Caches app shell (HTML, CSS, JS)
- Caches offline-marked files
- Background sync for queued changes
- Push notifications

**Current Implementation:**
- Files marked as `offlineAvailable` in state
- Simulated offline mode in Offline Manager
- Full offline support requires Service Worker (not implemented yet)

**Future Offline Features:**
- IndexedDB for file storage
- Service Worker for request interception
- Background sync API
- Cache-first network strategy

---

### 10.4 Mobile App Experience

**Meta Tags:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#4f46e5">
```

**Features:**
- **Bottom Navigation**: iOS/Android-style tab bar
- **Safe Area Support**: Respects device notches
- **Touch Optimizations**: Large tap targets, swipe gestures
- **Native Animations**: Smooth transitions matching platform expectations
- **Splash Screen**: Generated from manifest icons
- **App Switcher**: Shows app name and icon

---

### 10.5 Platform Detection

**Mobile vs. Desktop:**
```typescript
const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
  // Show BottomNav
  // Hide Sidebar
  // Show mobile app popup on first visit
} else {
  // Show Sidebar
  // Hide BottomNav
}
```

**PWA vs. Browser:**
```typescript
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

if (isPWA) {
  // Native app experience
  // Redirect directly to dashboard
} else {
  // Browser experience
  // Show landing page first
}
```

---

## 11. UI/UX Patterns

### 11.1 Design System

**Color Palette:**
- **Primary**: Indigo (#4f46e5, #4338ca, #3730a3)
- **Secondary**: Slate (#475569, #64748b, #94a3b8)
- **Success**: Green (#10b981, #059669)
- **Warning**: Amber (#f59e0b, #d97706)
- **Error**: Red (#ef4444, #dc2626)
- **Premium**: Gold gradient (Gold plan), Dark gradient (Platinum)

**Typography:**
- **Font**: System font stack (San Francisco, Segoe UI, Roboto, etc.)
- **Scale**: 
  - xs: 0.75rem
  - sm: 0.875rem
  - base: 1rem
  - lg: 1.125rem
  - xl: 1.25rem
  - 2xl: 1.5rem
  - 3xl: 1.875rem
  - 4xl: 2.25rem
  - 5xl: 3rem

**Spacing:**
- Tailwind default scale (0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Consistent padding/margin across components

**Shadows:**
- sm: Small shadow for cards
- md: Medium shadow for elevated elements
- lg: Large shadow for modals
- xl: Extra large for important overlays
- 2xl: Maximum elevation for critical modals

---

### 11.2 Component Patterns

**Cards:**
- Rounded corners (rounded-xl, rounded-2xl)
- Border (border-slate-200)
- Padding (p-6, p-8)
- Hover effects (hover:shadow-md)
- Examples: File cards, plan cards, analytics cards

**Buttons:**
- Primary: bg-indigo-600 text-white
- Secondary: bg-slate-900 text-white
- Outline: border-slate-200 hover:bg-slate-50
- Destructive: text-red-600 hover:bg-red-50
- Ghost: transparent hover:bg-slate-100
- Sizes: sm (py-2 px-3), md (py-3 px-4), lg (py-4 px-8)
- Rounded: rounded-xl for buttons

**Inputs:**
- Border: border-slate-200
- Focus: focus:ring-2 focus:ring-indigo-500 focus:border-transparent
- Rounded: rounded-lg
- Padding: px-4 py-3
- Error state: border-red-300 bg-red-50/30

**Modals:**
- Backdrop: bg-black/50 backdrop-blur-sm
- Modal: bg-white rounded-3xl shadow-2xl
- Centered: flex items-center justify-center
- Animation: scale and opacity transition
- Close: X button or click backdrop

**Panels:**
- Side panels: Slide in from right
- Full height: h-full
- Width: w-80, w-96, or w-1/3
- Close button: Top-right
- Scrollable content: overflow-y-auto

---

### 11.3 Animation Patterns

**Page Transitions:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

**Modal Entrance/Exit:**
```typescript
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

**List Item Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

**Hover Effects:**
```typescript
<motion.div
  whileHover={{ y: -2, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

**Loading States:**
```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  <Loader className="animate-spin" />
</motion.div>
```

**Scroll Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
```

---

### 11.4 Responsive Design

**Breakpoints:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Mobile-First Approach:**
```css
/* Mobile default */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

**Responsive Patterns:**
- **Sidebar**: Hidden on mobile, visible on md and up
- **BottomNav**: Visible on mobile, hidden on md and up
- **Grid Layouts**: 1 column mobile, 2 columns tablet, 3-4 columns desktop
- **Font Sizes**: Smaller on mobile, larger on desktop
- **Spacing**: Tighter on mobile, looser on desktop

---

### 11.5 Accessibility

**Keyboard Navigation:**
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modals/panels
- Arrow keys for navigation (future)

**Screen Reader Support:**
- Semantic HTML (button, nav, main, etc.)
- ARIA labels on icons
- ARIA live regions for toasts
- Focus management in modals

**Color Contrast:**
- WCAG AA compliant
- Text: 4.5:1 minimum contrast
- UI elements: 3:1 minimum contrast

**Focus Indicators:**
- Visible focus ring on all interactive elements
- Custom focus styles (ring-2 ring-indigo-500)

---

### 11.6 Loading States

**Page Loading:**
- Spinner centered on screen
- White background
- Indigo spinner color

**Skeleton Loaders:**
- Gray pulsing rectangles
- Match layout of loaded content
- Used in file explorer, lists

**Progress Indicators:**
- Linear progress bars for uploads/syncs
- Percentage text
- Color-coded: blue (syncing), green (complete)

**Optimistic UI:**
- Instant feedback on actions
- Show expected result immediately
- Revert if action fails

---

## 12. Security & Privacy

### 12.1 Authentication

**Current Implementation:**
- Email/password authentication (simulated)
- Google OAuth (simulated)
- Session stored in localStorage
- Token-based auth (future)

**Future Enhancements:**
- JWT tokens
- Refresh token rotation
- Session expiration
- Device fingerprinting
- Rate limiting

---

### 12.2 Encryption

**Encryption Types:**

**1. Client-Side Encryption:**
- Files encrypted in browser before upload
- Encryption key generated and stored locally
- Server stores encrypted blobs
- Decryption on download in browser
- Server cannot read file contents

**2. Server-Side Encryption:**
- Files uploaded plain, encrypted on server
- ElgoraX manages encryption keys
- Protects data at rest
- Allows server-side processing (thumbnails, search)

**3. Zero-Knowledge Encryption (Platinum):**
- User-controlled master password
- Master password never sent to server
- Encryption keys derived from password
- ElgoraX cannot decrypt files
- User responsible for password recovery

**Implementation (Future):**
```typescript
// Client-side encryption (pseudo-code)
const encryptFile = async (file: File, key: CryptoKey) => {
  const arrayBuffer = await file.arrayBuffer();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: generateIV() },
    key,
    arrayBuffer
  );
  return new Blob([encrypted]);
};
```

---

### 12.3 Privacy Features

**No File Scanning:**
- Files never analyzed for content
- No machine learning on user files
- No ads based on file contents

**Data Minimization:**
- Collect only essential metadata
- No tracking pixels
- No third-party analytics (optional opt-out)

**GDPR Compliance:**
- Right to access (data export)
- Right to deletion (account deletion)
- Right to portability (download all data)
- Privacy policy and terms acceptance

**Audit Logs (Platinum):**
- Track all file access
- Log authentication events
- Record permission changes
- Immutable log storage

---

### 12.4 Access Control

**File Permissions:**
- Owner: Full control
- Editor: Modify file, manage versions
- Commenter: View and comment
- Viewer: Read-only access

**Folder Permissions:**
- Inherited by child files/folders
- Override at file level
- Propagate permission changes

**Sharing Controls:**
- Time-limited links
- Password-protected links
- Device restrictions
- Location restrictions
- View count limits
- Watermarking

---

### 12.5 Security Best Practices

**Implemented:**
- HTTPS only (production)
- Secure cookie flags (future)
- CSRF protection (future)
- Input validation
- XSS prevention (React escapes by default)
- SQL injection prevention (no direct DB queries)

**Future Enhancements:**
- Two-factor authentication (2FA)
- Biometric authentication (WebAuthn)
- Security questions
- Trusted devices
- Login alerts
- Suspicious activity detection

---

## Conclusion

This documentation covers the complete ElgoraX Drive application as of February 27, 2026. The platform is designed to be a privacy-first, offline-capable alternative to traditional cloud storage solutions, with a focus on user control, security, and advanced organization features.

**Key Achievements:**
- ✅ Complete authentication and onboarding flow
- ✅ Comprehensive dashboard with Simple and Power modes
- ✅ Advanced file organization (tags, collections, search)
- ✅ Sync and offline management
- ✅ Version history and storage analytics
- ✅ Granular sharing permissions
- ✅ PWA with mobile-first design
- ✅ Four-tier pricing model
- ✅ Responsive design across all devices
- ✅ Animated, polished user experience

**Future Roadmap:**
- 🔄 Service Worker implementation for true offline support
- 🔄 Real backend integration (Supabase, Firebase, or custom)
- 🔄 Actual file upload/download functionality
- 🔄 Real-time collaboration
- 🔄 File preview (images, PDFs, videos)
- 🔄 Comments and annotations
- 🔄 Desktop sync client
- 🔄 Mobile native apps (React Native)
- 🔄 Enterprise features (team management, admin panel)
- 🔄 Internationalization (i18n)

---

**Document Version:** 1.0  
**Created:** February 27, 2026  
**Author:** ElgoraX Development Team

---

*This documentation is a living document and will be updated as the application evolves. For the latest version, refer to the project repository.*
