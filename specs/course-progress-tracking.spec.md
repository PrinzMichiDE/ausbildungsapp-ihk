# Feature: Course Progress Tracking

## Overview
Comprehensive progress dashboard for Azubis showing completed courses, skill mastery, and achievement tracking. Provides visual representation of learning progress with certificates and badges.

## Functional Requirements

### FR-001: View Dashboard
While Azubi is authenticated, when Azubi navigates to Dashboard → Progress, the system shall display:
- Completed courses with release status and completion dates
- Skill matrix with earned competences
- Pending requirements and suggested next courses
- Certificate and badge collection
- Weekly/monthly progress metrics

### FR-002: Filter by Timeframe
While Azubi views progress dashboard, when Azubi selects time filter (week/month/quarter/all), the system shall display filtered course completion data and metrics.

### FR-003: Course Detail View
While Azubi views dashboard, when Azubi clicks on course item, the system shall display detailed view with:
- Course hierarchy and completed modules
- Learning objectives with completion status
- Theory quiz scores and retry counts
- Praxis task completion rate
- Quality score of the course content

### FR-004: Skill Assignment Tracking
While Azubi is on course detail view, when Azubi views skill assignments, the system shall display which frameworks (IHK learning fields) are covered by the course.

### FR-005: Certificate Download
While Azubi has completed a course, when Azubi clicks Download Certificate, the system shall generate PDF certificate with course details and timestamp.

## Non-Functional Requirements

### Performance
- Dashboard load time: < 1s
- Course filtering: < 200ms
- Skill matrix rendering: < 500ms
- Certificate generation: < 2s

### Security
- Authentication: JWT required
- Authorization: Role-based (Azubi sees only own progress)
- Data protection: Progress data encrypted at rest

### Scalability
- Dashboard data size: Up to 100 courses per Azubi
- Skill matrix complexity: 50+ skills per Azubi
- Certificate generation: Batch support for 1000 Azubis

## Acceptance Criteria

### AC-001: Dashboard Load
Given Azubi is logged in,
When Azubi navigates to Dashboard → Progress,
Then dashboard loads within 1 second showing all progress sections.

### AC-002: Course Filter
Given Azubi has multiple course completions,
When Azubi filters by "Last Month",
Then dashboard displays only courses completed in the selected timeframe.

### AC-003: Course Detail
Given Azubi views dashboard course list,
When Azubi clicks on "Netzwerkinfrastrukturen planen",
Then detailed view shows module completion status and quiz scores.

### AC-004: Certificate Download
Given Azubi completed course with "freigegeben" status,
When Azubi clicks Download Certificate,
Then PDF is generated with course details and timestamp.

## Error Handling

| Error Condition | HTTP Code | User Message |
|-----------------|-----------|--------------|
| No Course Progress | 404 | "No course progress data available" |
| Invalid Time Filter | 400 | "Invalid time period selected" |
| Certificate Generation Failed | 500 | "Unable to generate certificate at this time" |

## Implementation TODO

### Backend
- [ ] Create CourseProgressDTO with aggregated data
- [ ] Implement progress aggregation service (Course → Module → Lektion → Quiz → PraxisTask)
- [ ] Add certificate generation service
- [ ] Create time-based filtering for progress data
- [ ] Add skill mapping from Course to Framework

### Frontend
- [ ] Create ProgressDashboardComponent
- [ ] Add SkillMatrixComponent with visual progress bars
- [ ] Implement CourseDetailDialog with nested modules
- [ ] Create CertificateDownloadComponent
- [ ] Add time filter controls with quick presets

### Testing
- [ ] Unit tests for progress aggregation logic
- [ ] Integration tests for certificate generation
- [ ] E2E test for dashboard loading and filtering
- [ ] Visual regression tests for skill matrix

## Out of Scope
- Custom certificate templates
- Progress export to external systems
- Gamification score calculations

## Open Questions
- Should we include peer comparison metrics?
- Do we need a milestone-based achievement system?
- Should progress data be available for HR/Ausbilder download?
- How do we handle course re-enrollment for repeat learners?
