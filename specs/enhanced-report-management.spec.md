# Feature: Enhanced Report Management

## Overview
Streamlined weekly report creation, editing, and submission workflow for Azubis with automatic reminders and version tracking. Reduces friction in the report submission process while maintaining full auditability and version history.

## Functional Requirements

### FR-001: Create Report
While Azubi has active Einsatz and current week is within his current Abteilungsdurchlauf, when Azubi accesses the report creation interface, the system shall display a structured form with Markdown editor, task coupling interface, and sections for Betrieb, Berufsschule, and Schulung.

### FR-002: Save Draft
While Azubi is creating a report, when Azubi clicks Save Draft, the system shall auto-save the report with timestamp and current content without changing status from "entwurf".

### FR-003: Submit Report
While report status is "entwurf" and current week has passed, when Azubi clicks Submit Report, the system shall update status to "eingereicht", log timestamp, generate automatic Friday reminder if status changed, and add to Ausbildungsbeauftragter review queue.

### FR-004: Request Edit
While report status is "eingereicht", when Ausbildungsbeauftragter clicks Request Edit, the system shall add comment "Review needed, please adjust" and revert status to "entwurf".

### FR-005: Auto-Reminder
Each Friday at 17:00, when there are reports with status "eingereicht" and due week has passed, the system shall send in-app, email, and Teams notification reminder to Azubi.

### FR-006: Cancel Submission
While report status is "eingereicht" and Azubi is the owner, when Azubi clicks Cancel Submission, the system shall revert status to "entwurf" and send notification to Ausbildungsbeauftragter.

## Non-Functional Requirements

### Performance
- Response time: < 200ms p95 for report loading and saving
- Report creation/save: < 500ms
- Auto-save debounce: 3 seconds after editing
- Reminder batch processing: < 100ms

### Security
- Authentication: JWT required
- Authorization: Role-based (Azubi owns reports, Ausbildungsbeauftragter can review)
- Data protection: PII encrypted at rest
- Version history: Append-only, immutable

### Scalability
- Concurrent Azubis: 10,000
- Report attachments: 50MB per report
- Weekly batch reminders: 100,000 users

## Acceptance Criteria

### AC-001: Report Creation
Given Azubi is logged in with active Einsatz,
When Azubi navigates to Reports → New Report,
Then Azubi sees structured form with Markdown editor and task coupling interface.

### AC-002: Draft Saving
Given Azubi is creating report in entwurf status,
When Azubi clicks Save Draft,
Then report is saved with timestamp, status remains "entwurf", and Azubi sees confirmation.

### AC-003: Report Submission
Given Azubi has completed weekly report with status "entwurf",
When Azubi clicks Submit Report,
Then status changes to "eingereicht", notification is sent, and reminder is scheduled.

### AC-004: Auto-Reminder
Given Friday 17:00 and submitted reports exist,
When system processes weekly reminders,
Then Azubis receive all three channel notifications (In-App, Email, Teams).

## Error Handling

| Error Condition | HTTP Code | User Message |
|-----------------|-----------|--------------|
| No Active Einsatz | 403 | "You must be assigned to an active Abteilung to create reports" |
| Week Already Submitted | 409 | "Report for this week has already been submitted" |
| Invalid Markdown Content | 400 | "Please check your report content" |

## Implementation TODO

### Backend
- [ ] Add task coupling service between Report and Task entities
- [ ] Implement auto-save with content hashing
- [ ] Create Friday reminder scheduler with multi-channel delivery
- [ ] Add report status workflow validation (entwurf → eingereicht → in_pruefung → visiert → archiviert)
- [ ] Add soft delete support for report history

### Frontend
- [ ] Create ReportCreationComponent with Markdown editor
- [ ] Add real-time auto-save with conflict detection
- [ ] Implement task coupling visual interface (drag-and-drop)
- [ ] Add status badge and workflow indicator
- [ ] Create ReminderPreferenceComponent for notification channels

### Testing
- [ ] Unit tests for report status workflow
- [ ] Integration tests for auto-save functionality
- [ ] E2E test for report submission flow
- [ ] Scheduler test for Friday reminders

## Out of Scope
- Email template customization
- External calendar integration (iCal import)
- Advanced Markdown syntax validation beyond basic sanitization

## Open Questions
- Should we integrate with Personio Abwesenheit to automatically pause reminders?
- Do we need a revert functionality for submitted reports?
- How should we handle timezone differences for reminders?
- Should we implement a "quick report" mode for minimal data entry?
