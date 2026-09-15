# Feature: Feedback Interaction

## Overview
Real-time comment and grade feedback system for Azubis. Integrates with report workflow, task reviews, and course evaluations. Provides structured feedback with ratings and response tracking.

## Functional Requirements

### FR-001: View Feedback
While Azubi is authenticated, when Azubi navigates to Feedback → Inbox, the system shall display:
- Incoming comments on submitted reports
- Incoming comments on submitted tasks
- Grade feedback from Ausbilder/HR
- Responses from Azubi to feedback
- Feedback history with timestamps

### FR-002: View Report Feedback
While Azubi views feedback inbox, when Azubi clicks on report feedback item, the system shall display:
- Original report content
- Ausbildungsbeauftragter/Ausbilder comments
- Response form for Azubi
- Status timeline (entwurf → eingereicht → review)
- Action buttons (Request Edit, Acknowledge)

### FR-003: View Task Feedback
While Azubi views feedback inbox, when Azubi clicks on task feedback item, the system shall display:
- Task description and completion details
- Reviewer comments with rating (1-5)
- Response form for Azubi improvements
- Status tracking (submitted → approved/rejected)

### FR-004: Submit Response
While Azubi is viewing feedback, when Azubi submits a response to comment or grade, the system shall update feedback status to "responding", store response, and notify reviewer.

### FR-005: Request Edit (Report)
While feedback is about a report, when Azubi clicks Request Edit, the system shall:
- Add response "I will adjust the report" with timestamp
- Revert report status to "entwurf"
- Add Ausbildungsbeauftragter to response notification list
- Update feedback status to "edit_requested"

### FR-006: Acknowledge Feedback
While Azubi is viewing feedback, when Azubi clicks Acknowledge, the system shall:
- Mark feedback as acknowledged
- Update feedback status to "acknowledged"
- Show confirmation to reviewer
- Trigger next step in workflow

### FR-007: Rate Feedback Quality
While Azubi is viewing feedback, when Azubi rates feedback quality (1-5), the system shall store rating and aggregate for Ausbilder performance tracking.

## Non-Functional Requirements

### Performance
- Feedback inbox load time: < 1s
- Response submission: < 200ms
- Real-time updates: < 100ms via WebSocket
- Notification delivery: < 500ms

### Security
- Authentication: JWT required
- Authorization: Role-based (Azubi responds to feedback on owned items)
- Data protection: Feedback data encrypted at rest

### Scalability
- Concurrent feedback items per Azubi: Up to 10
- Feedback per report: Up to 5 comments
- Real-time connections: 1000+ simultaneous users

## Acceptance Criteria

### AC-001: Feedback Inbox Load
Given Azubi has feedback items,
When Azubi navigates to Feedback → Inbox,
Then inbox loads within 1 second showing all feedback with counts.

### AC-002: Report Feedback View
Given Azubi has report feedback,
When Azubi clicks on report feedback,
Then detailed view shows original content, comments, and response form.

### AC-003: Task Feedback View
Given Azubi has task feedback,
When Azubi clicks on task feedback,
Then detailed view shows task details, reviewer rating, and improvement form.

### AC-004: Response Submission
Given Azubi is viewing feedback,
When Azubi submits a response,
Then response is saved and notifications are sent to relevant parties.

### AC-005: Edit Request
Given Azubi receives edit request on report,
When Azubi clicks Request Edit,
Then report status updates and appropriate parties are notified.

## Error Handling

| Error Condition | HTTP Code | User Message |
|-----------------|-----------|--------------|
| Feedback Not Found | 404 | "Feedback item not found" |
| Unauthorized Response | 403 | "You are not authorized to respond to this feedback" |
| Invalid Response | 400 | "Please provide a valid response" |
| Request Already Made | 409 | "Edit request already submitted" |

## Implementation TODO

### Backend
- [ ] Add Feedback entity with status states
- [ ] Implement response workflow for reports and tasks
- [ ] Add real-time notification service for feedback responses
- [ ] Create feedback quality rating aggregation
- [ ] Add response templates for common feedback types

### Frontend
- [ ] Create FeedbackInboxComponent with tabbed view
- [ ] Add FeedbackItemComponent with context-aware actions
- [ ] Implement ResponseFormComponent with rich text editor
- [ ] Add real-time WebSocket updates for new feedback
- [ ] Create ResponseTemplateSelector

### Testing
- [ ] Unit tests for feedback workflow
- [ ] Integration tests for response submission
- [ ] E2E test for feedback interaction flow
- [ ] Real-time WebSocket test

## Out of Scope
- Advanced feedback categorization
- Sentiment analysis of feedback
- Automated response suggestions

## Open Questions
- Should we implement feedback acknowledgment receipts?
- Do we need a feedback rating system for Ausbilder?
- How should we handle multi-party feedback (Ausbildungsbeauftragter + Ausbilder)?
- Should we add emoji reactions to feedback?
