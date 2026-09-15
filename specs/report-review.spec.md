# Feature: Report Review

## Overview
Streamlined review and approval workflow for Ausbilder and Ausbildungsbeauftragter. Provides batch processing capabilities, structured comments, and clear decision tracking for submitted reports.

## Functional Requirements

### FR-001: View Review Queue
While Ausbilder/Ausbildungsbeauftragter is authenticated, when user navigates to Reports → Review, the system shall display:
- Reports awaiting review with status "eingereicht"
- Filters by Azubi, week, and department
- Batch selection controls
- Quick action buttons (Approve, Request Edit, Reject)
- Progress indicators

### FR-002: Access Report for Review
While user has review permissions, when user clicks on report in queue, the system shall display:
- Full report content with Markdown viewer
- Azubi information and week details
- Comment section for structured feedback
- Approval/rejection decision panel
- Status timeline
- Task coupling details

### FR-003: Add Comment
While user is reviewing report, when user adds comment in comment section, the system shall:
- Save comment with timestamp
- Assign comment type (Allgemein, Fachlich, Formal, Aufgabenkopplung)
- Notify Azubi of new comment
- Update feedback inbox for Azubi

### FR-004: Approve Report
While user is reviewing report, when user clicks Approve and selects "visieren", the system shall:
- Update report status to "visiert"
- Add approval timestamp and comment
- Generate digital signature
- Send notification to Azubi
- Add to audit log
- Update progress dashboard

### FR-005: Request Edit
While user is reviewing report, when user clicks Request Edit, the system shall:
- Update report status to "entwurf"
- Add edit request comment
- Notify Azubi of edit requirements
- Schedule reminder for resubmission
- Update feedback inbox

### FR-006: Reject Report
While user is reviewing report, when user clicks Reject with reason, the system shall:
- Update report status to "abgelehnt" (new status)
- Log rejection reason
- Send detailed feedback to Azubi
- Prevent further submissions until fixed

### FR-007: Batch Actions
While user is in review queue, when user selects multiple reports and clicks batch action, the system shall:
- Perform selected action on all reports
- Show progress with completion percentage
- Log each action in audit trail
- Send bulk notifications

### FR-008: Export Review Results
While user is in review queue, when user exports review results, the system shall generate CSV/PDF with:
- Report statuses and timestamps
- Reviewer comments and decisions
- Azubi information
- Action taken by reviewer

## Non-Functional Requirements

### Performance
- Review queue load time: < 1s
- Report loading: < 500ms
- Batch processing: < 1s for 100 reports
- Comment saving: < 200ms
- Notification delivery: < 500ms

### Security
- Authentication: JWT required
- Authorization: Role-based (Ausbildungsbeauftragter: eigene Einsatz; Ausbilder: alle Azubis)
- Data protection: Review data encrypted at rest

### Scalability
- Review queue size: Up to 500 reports per user
- Concurrent reviewers: 50 users
- Report attachments: 50MB per report
- Batch operations: 100 reports simultaneously

## Acceptance Criteria

### AC-001: Review Queue Load
Given Ausbilder/Ausbildungsbeauftragter is logged in,
When user navigates to Reports → Review,
Then review queue loads within 1 second showing all pending reports.

### AC-002: Report Access
Given user is in review queue,
When user clicks on report,
Then full report view loads with all review tools.

### AC-003: Comment Addition
Given user is reviewing report,
When user adds a structured comment,
Then comment is saved and Azubi is notified.

### AC-004: Approval Workflow
Given report is ready for approval,
When user approves and selects "visieren",
Then report status updates and Azubi is notified.

### AC-005: Edit Request
Given report needs changes,
When user requests edit,
Then report status reverts to entwurf and Azubi is notified.

### AC-006: Batch Processing
Given user selects multiple reports,
When user performs batch action,
Then all reports are processed with audit logging.

### AC-007: Export Results
Given review queue is populated,
When user exports results,
Then CSV/PDF is generated with all review data.

## Error Handling

| Error Condition | HTTP Code | User Message |
|-----------------|-----------|--------------|
| Report Not Found | 404 | "Report not found or access denied" |
| Unauthorized Access | 403 | "You do not have permission to review this report" |
| Invalid Comment | 400 | "Comment cannot be empty" |
| Batch Action Too Large | 400 | "Cannot process more than 100 reports at once" |
| Export Generation Failed | 500 | "Unable to generate export at this time" |

## Implementation TODO

### Backend
- [ ] Add ReportReview entity with comment support
- [ ] Implement access scope checking for Ausbilder/Ausbildungsbeauftragter
- [ ] Create batch processing service
- [ ] Add structured comment types and templates
- [ ] Implement digital signature generation
- [ ] Add review analytics and metrics

### Frontend
- [ ] Create ReviewQueueComponent with filters and batch controls
- [ ] Add ReportReviewComponent with comment system
- [ ] Implement BatchActionComponent
- [ ] Add CommentTypeSelector
- [ ] Create ReviewAnalyticsComponent

### Testing
- [ ] Unit tests for access scope logic
- [ ] Integration tests for batch processing
- [ ] E2E test for review workflow
- [ ] Performance test for batch operations

## Out of Scope
- Advanced report version comparison
- Third-party annotation integration
- Automated report assessment scoring

## Open Questions
- Should we add response templates for common review comments?
- How should we handle multi-department report reviews?
- Should we implement a review rating system for reviewers?
- How do we track reviewer consistency?
