# Feature: Task Management

## Overview
Kanban-style task board for Azubis showing Praxis tasks, deadline tracking, and progress visualization. Integrates with report sheft for task coupling and completion tracking.

## Functional Requirements

### FR-001: View Task Board
While Azubi is authenticated, when Azubi navigates to Tasks → Board, the system shall display Kanban columns:
- Available Tasks (from courses, 0-100% quality score)
- In Progress (tasks Azubi is working on)
- Ready to Submit (tasks completed)
- Submitted (tasks sent to Ausbildungsbeauftragter for review)
- Approved (tasks that qualify for report coupling)
- Rejected (tasks that failed review)

### FR-002: Create Task
While Azubi is viewing course detail, when Azubi clicks Add Task or course provides default Praxis tasks, the system shall create Task entity with course reference and default status "available".

### FR-003: Start Task
While task status is "available", when Azubi clicks Start Task, the system shall update status to "in_progress", set start_time, and track progress.

### FR-004: Complete Task
While task status is "in_progress", when Azubi marks task as completed, the system shall update status to "ready_to_submit", log completion timestamp.

### FR-005: Submit Task
While task status is "ready_to_submit", when Azubi clicks Submit Task, the system shall update status to "submitted", notify Ausbildungsbeauftragter, and enable report coupling.

### FR-006: Set Deadline
While Azubi is working on task, when Azubi sets deadline, the system shall update task deadline and show countdown timer.

### FR-007: Drag-and-Drop Reordering
While Azubi is viewing task board, when Azubi reorders tasks by dragging, the system shall update task ordering for better workflow management.

## Non-Functional Requirements

### Performance
- Task board load time: < 1s
- Task CRUD operations: < 200ms
- Deadline notifications: 24h before due
- Real-time updates: < 100ms via WebSocket

### Security
- Authentication: JWT required
- Authorization: Role-based (Azubi owns tasks from enrolled courses)
- Data protection: Task data encrypted at rest

### Scalability
- Concurrent tasks per Azubi: Up to 50
- Team collaboration: 5 Azubis per course
- Deadline notifications: 100,000 users

## Acceptance Criteria

### AC-001: Task Board Load
Given Azubi is enrolled in courses,
When Azubi navigates to Tasks → Board,
Then Kanban board loads showing all task columns with counts.

### AC-002: Task Creation
Given Azubi views course detail,
When Azubi clicks Add Task,
Then new task appears in "Available Tasks" column with default title.

### AC-003: Task Workflow
Given Azubi starts a task,
When Azubi completes and submits it,
Then task moves through all status columns automatically.

### AC-004: Deadline Tracking
Given Azubi has tasks with deadlines,
When Azubi views board,
Then tasks show countdown timers and color-code by urgency.

### AC-005: Drag-and-Drop
Given Azubi views task board,
When Azubi reorders tasks by dragging,
Then task order updates instantly without page refresh.

## Error Handling

| Error Condition | HTTP Code | User Message |
|-----------------|-----------|--------------|
| Task Not Available | 403 | "You are not authorized to access this task" |
| Invalid Deadline | 400 | "Deadline must be in the future" |
| Task Already Submitted | 409 | "This task has already been submitted" |
| Drag-and-Drop Error | 500 | "Unable to reorder tasks at this time" |

## Implementation TODO

### Backend
- [ ] Add Task entity with all status columns
- [ ] Implement task state machine (available → in_progress → ready_to_submit → submitted → approved/rejected)
- [ ] Create deadline notification scheduler
- [ ] Add task ordering service for drag-and-drop
- [ ] Integrate with ReportTask for task coupling

### Frontend
- [ ] Create TaskBoardComponent with Kanban UI
- [ ] Add TaskCardComponent with status-specific actions
- [ ] Implement drag-and-drop with react-beautiful-dnd
- [ ] Create DeadlineCountdownComponent
- [ ] Add real-time WebSocket updates

### Testing
- [ ] Unit tests for task state machine
- [ ] Integration tests for deadline notifications
- [ ] E2E test for task workflow
- [ ] Drag-and-drop functionality test

## Out of Scope
- Team collaboration features
- Task comments and discussions
- Advanced filtering beyond status columns

## Open Questions
- Should we implement task dependencies (task A must be completed before task B)?
- Do we need a task assignment system for Ausbilder?
- Should we add time tracking for task completion?
- How do we handle task sharing between multiple Azubis?
