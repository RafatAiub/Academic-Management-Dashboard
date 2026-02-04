# Academic Management Dashboard

A comprehensive academic management system built with Next.js for managing students, courses, faculty, and grades.

![Dashboard Preview](./docs/dashboard-preview.png)

## Features

### Core Features
- **Dashboard Overview**: View key statistics, enrollment charts, GPA distributions, and top performers
- **Student Management**: Full CRUD operations for student records with search and filtering
- **Course Management**: Create, update, and manage courses with faculty assignments
- **Faculty Panel**: Manage faculty members and perform bulk operations
- **Grade Management**: Individual and bulk grade entry with automatic letter grade calculation
- **Reports**: Generate comprehensive academic reports with CSV export

### Technical Features
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 📊 Interactive charts with ApexCharts
- 🔍 Advanced search and filtering
- 📁 CSV export for all data
- ⚡ Optimistic UI updates
- 🔄 Data resets on refresh (mock API)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: ApexCharts + react-apexcharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Mock API**: JSON Server

## Getting Started

### Prerequisites
- Node.js 18.18 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/academic-management-dashboard.git
   cd academic-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**

   In one terminal, start the mock API:
   ```bash
   npm run dev:api
   ```

   In another terminal, start the Next.js development server:
   ```bash
   npm run dev
   ```

   Or use the combined command (Windows may need separate terminals):
   ```bash
   npm run dev:all
   ```

4. **Open your browser**
   - Next.js: http://localhost:3000
   - JSON Server API: http://localhost:3001

## Project Structure

```
Academic_Management_Dashboard/
├── db.json                     # Mock database file
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── courses/           # Course management pages
│   │   ├── faculty/           # Faculty panel page
│   │   ├── reports/           # Reports page
│   │   ├── students/          # Student management pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard home
│   ├── components/
│   │   ├── charts/            # Chart components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components (Header, Sidebar)
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── api/               # API services
│   │   ├── exportUtils.ts     # CSV export utilities
│   │   └── utils.ts           # General utilities
│   └── types/                 # TypeScript type definitions
└── package.json
```

## API Endpoints

The mock API (JSON Server) provides the following endpoints:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/students` | GET, POST, PUT, DELETE | Student records |
| `/courses` | GET, POST, PUT, DELETE | Course information |
| `/faculty` | GET, POST, PUT, DELETE | Faculty members |
| `/grades` | GET, POST, PUT, DELETE | Grade records |
| `/enrollmentHistory` | GET, POST | Enrollment history |

## Key Components

### UI Components
- `Button` - Customizable button with variants and loading state
- `Card` - Container component with header and body
- `Modal` - Overlay modal dialog
- `Table` - Data table with sorting and pagination
- `Tabs` - Tab navigation component
- `Badge` - Status badges
- `Input/Select` - Form inputs

### Form Components
- `StudentForm` - Create/edit students
- `CourseForm` - Create/edit courses
- `GradeForm` - Add individual grades
- `BulkAssignmentForm` - Bulk student enrollment
- `BulkGradeUpdateForm` - Bulk grade updates

### Chart Components
- `EnrollmentChart` - Bar chart for course enrollments
- `GPADistributionChart` - Donut chart for grade distribution
- `EnrollmentTrendChart` - Area chart for enrollment trends

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run dev:api` | Start JSON Server on port 3001 |
| `npm run dev:all` | Start both servers concurrently |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Data Management

### Mock Data
The application uses JSON Server with `db.json` as the data source. Data persists during a session but resets when the server restarts.

### Data Export
Export data to CSV from:
- Students page → Export student records
- Courses page → Export course data
- Reports page → Export grades, full reports

## Customization

### Theming
Modify the CSS variables in `src/app/globals.css`:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  /* ... */
}
```

### Adding New Features
1. Create types in `src/types/index.ts`
2. Add API service in `src/lib/api/`
3. Create components in appropriate directories
4. Add pages in `src/app/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or as a starting point for your own projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Tailwind CSS
