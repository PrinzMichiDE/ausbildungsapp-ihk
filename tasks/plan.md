# Implementation Plan: Complete Dashboard Module Max Expansion

## Overview
This comprehensive plan outlines the expansion of the `src/modules/reporting/` module to deliver a production-ready dashboard system with advanced KPIs, analytics, and export capabilities. The implementation follows a vertical slicing approach to deliver working functionality incrementally.

## Architecture Overview

### Core Structure
```
src/modules/reporting/
├── dto/
│   ├── reporting.dto.ts          # Basic reporting DTOs
│   ├── dashboard.dto.ts          # Role-specific dashboard DTOs
│   ├── kpi.dto.ts               # KPI DTOs
│   ├── alert-config.dto.ts       # Alert configuration
│   └── custom-report.dto.ts     # Custom report builder
├── service/
│   ├── reporting.service.ts      # Core reporting service
│   └── reporting.service.spec.ts # Unit tests
├── controller/
│   └── reporting.controller.ts   # API endpoints
├── reporting.module.ts           # NestJS module
└── (other supporting files)
```

### Key Design Decisions

1. **No new module needed**: `reporting` is the fachliche dashboard (Konzept §5.4), expanding this central service avoids duplication.

2. **RBAC by Design**: All endpoints use `@Roles` decorator + `AccessScopeService.getVisibleAzubiIds()` for proper scoping.

3. **Performance**: N+1 query fixes, weighted GPA calculation, optional 60s cache, type-safe DTOs.

4. **Export Strategy**: Consistent `csv|json|pdf` export via shared `toCsv()` utility.

5. **Alert Configuration**: User-specific + global defaults for HR/Ausbilder/Beauftragter scopes.

## Implementation Roadmap

### Phase 1: Foundation (Tasks 1-3)
**Deadline**: First 2 weeks
**Priority**: High - Core contracts and basic functionality

#### Task 1: DTO Foundation & Contracts
- Implement `AzubiDashboardDto`, `BeauftragterDashboardDto`, `AusbilderHrDashboardDto`
- Create KPI DTOs: `SkillGapDto`, `NotenTrendDto`, `NotenVerteilungDto`, `ZeitreiheDto`, `KohortenDto`, `CourseCompletionDto`
- AlertConfig and CustomReport DTOs
- Swagger documentation with full API contract

#### Task 2: ReportingService Refactor
- Fix N+1 queries in `reportQuote`, `abteilungsZufriedenheit`, `collectWarnings`
- Implement weighted GPA calculation using `Grade.gewichtung`
- Centralize scope checks with `AccessScopeService`
- Performance measurement targets: <500ms for dashboard

#### Task 3: Prisma Schema Updates
- Add `DashboardAlertConfig` model with user scoping
- Migration with `synchronize: false` compliance
- Seed default configurations (global + user-specific)

**Acceptance Criteria**:
- ✅ `npm run build` successful
- ✅ `npx prisma migrate dev` successful
- ✅ All new DTOs compile
- ✅ Basic endpoints functional

### Phase 2: Core Dashboards (Tasks 4-6)
**Deadline**: Week 3-4
**Priority**: Medium - Role-specific dashboard functionality

#### Task 4: Azubi Dashboard Max
- Complete ampel logic for Report age (green ≤7d, gelb 8-14d, rot >14d)
- Skill matrix coverage with `Task`-based reporting
- Weighted GPA trends and distribution
- Projects pipeline (entwurf → abgelehnt)
- Prüfungen with deadlines and status
- Onboarding completion tracking
- Badges and gamification metrics
- Absence data integration
- Enhanced Frühwarn with new categories

#### Task 5: Beauftragter Dashboard Max
- Scoped Visa management with ampel
- Rotation management with 30d/90d horizons
- Scoped skill coverage (department filtering)
- Noten and notes aggregation
- Department-specific feedback collection
- Absence tracking scoped to department

#### Task 6: Ausbilder/HR Gesamt-Dashboard
- Complete pipeline visualization (reports, projects, Prüfungen)
- Department capacity warnings (Soll-Ist-Vergleich)
- HR-specific Übernahme pipeline
- Alumni tracking and retention metrics
- Advanced analytics with cross-department comparisons

**Acceptance Criteria**:
- ✅ All 3 dashboard roles functional
- ✅ RBAC scoping verified (own vs shared data)
- ✅ Integrationstests for all dashboard components

### Phase 3: Advanced Analytics (Tasks 7-10)
**Deadline**: Week 5-6
**Priority**: Medium-High - Advanced KPI capabilities

#### Task 7: Skill-Gap & Competency Analysis
- Learning gap identification with priority scoring
- Task usage analysis with competency mapping
- Recommendations engine for missing skills
- Integration with `ReportTask`-based usage tracking

#### Task 8: Course Completion Analytics
- Completion rate calculation by department and individual
- Time-to-completion metrics with percentiles
- Quality score distribution and analysis
- Course effectiveness ranking

#### Task 9: Noten Trend & Distribution
- Weighted GPA trends with departmental breakdowns
- Noten distribution histograms (1-6 buckets)
- Trend analysis with year-over-year comparisons
- Fach-spezifische performance metrics

#### Task 10: Zeitreihen & Cohort Analysis
- Quarterly and yearly aggregation capabilities
- Multi-dimensional filtering (Fach, Abteilung, Jahrgang)
- Trend detection and anomaly identification
- Predictive analytics foundations

**Acceptance Criteria**:
- ✅ All KPI services operational (<500ms response)
- ✅ No N+1 query issues
- ✅ Integration tests passing
- ✅ Performance benchmarks met

### Phase 4: Warn-Engine & Configuration (Tasks 11-13)
**Deadline**: Week 7
**Priority**: High - Alert management and configuration

#### Task 11: Frühwarn-Engine V2
- Configurable alert thresholds for Noten, Berichte, Aufgaben
- Severity categorization (gut/warnung/kritisch)
- Multi-channel notification support (future)
- Alert suppression and temporary disable options

#### Task 12: Alert Configuration CRUD
- User-specific and global alert configuration management
- Validation for alert thresholds
- Role-based access control for configuration
- Audit logging for all configuration changes

#### Task 13: Kohorten-Vergleich Widget
- Multi-dimensional cohort analysis (beruf, jahr, abteilung)
- Benchmarking across different Azubi-Kohorten
- Performance trend identification across cohorts
- Recommendations for underperforming cohorts

**Acceptance Criteria**:
- ✅ Alert configuration functional with validation
- ✅ Kohorten-Vergleich with filtering and trend analysis
- ✅ RBAC for configuration management
- ✅ Integration tests for alert systems

### Phase 5: Export & Quality (Tasks 14-18)
**Deadline**: Week 8-9
**Priority**: High - Export capabilities and quality assurance

#### Task 14: Export Ausbau
- Multi-format export (CSV, JSON, PDF) for all KPI types
- Advanced filtering and transformation capabilities
- Batch processing for large datasets
- Streaming support for file downloads

#### Task 15: Custom Report Builder
- Configurable report templates with drag-and-drop interface
- Scheduled report generation and delivery
- Collaboration features with sharing capabilities
- Template management and versioning

#### Task 16: Performance & RBAC-Härtung
- Performance monitoring and optimization
- Enhanced RBAC with fine-grained permissions
- Security hardening for export endpoints
- Rate limiting and throttling

#### Task 17: Tests & Swagger
- Comprehensive test coverage (90% Services, 80% Controllers)
- Complete Swagger documentation with examples
- Integration tests for critical workflows
- Performance testing for all APIs

#### Task 18: ADR & Frontend Integration
- Architecture Decision Records for major decisions
- Frontend contract definitions
- API documentation and examples
- User documentation and quickstart guides

**Acceptance Criteria**:
- ✅ All tests passing with required coverage
- ✅ Complete Swagger documentation
- ✅ Performance benchmarks met
- ✅ Frontend integration specifications complete

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with pgvector
- **ORM**: Prisma (migrations only)
- **Validation**: class-validator
- **Documentation**: Swagger OpenAPI
- **Testing**: Jest + Supertest
- **Security**: JWT Auth, RBAC

### Deployment
- **Build**: Docker multi-stage
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus/Grafana
- **Logging**: Structured logging

### Frontend Integration
- **API Contract**: Type-safe DTOs
- **State Management**: Pinia (future)
- **Charts**: Chart.js for visualizations
- **Authentication**: JWT token management

## Project Structure

### Key Directories
```
project-root/
├── src/
│   ├── modules/reporting/          # Core reporting module
│   │   ├── dto/                  # All DTO definitions
│   │   ├── service/             # Service implementations
│   │   └── controller/           # API endpoints
│   ├── common/                   # Shared utilities
│   │   ├── rbac/                # RBAC services
│   │   ├── decorators/          # Parameter decorators
│   │   └── filters/             # Exception filters
│   └── config/                   # Application configuration
├── prisma/                      # Database schema
├── docs/                        # Documentation
├── tests/                       # Test suites
└── scripts/                     # Setup scripts
```

### Critical Files
- `src/modules/reporting/reporting.service.ts` - Core business logic
- `src/modules/reporting/reporting.controller.ts` - API endpoints
- `src/modules/reporting/dto/dashboard.dto.ts` - Dashboard DTOs
- `prisma/schema.prisma` - Database schema with new `DashboardAlertConfig`
- `src/modules/reporting/reporting.module.ts` - NestJS module

## Risk Management

### High Risk Areas
1. **N+1 Query Performance**: Mitigated through early refactoring and testing
2. **RBAC Implementation**: Comprehensive testing and integration validation
3. **Alert Configuration**: User-specific scoping and validation
4. **Export Systems**: Large dataset handling and performance optimization

### Medium Risk Areas
1. **Weighted GPA Calculation**: Complex business logic validation
2. **Dashboard Integration**: Frontend compatibility and data format consistency
3. **Cohort Analysis**: Performance with large datasets

### Low Risk Areas
1. **Alert System**: Standard CRUD operations
2. **Report Builder**: Template management
3. **Swagger Documentation**: API specification maintenance

## Monitoring & Observability

### Metrics
- **Response Times**: <500ms for all endpoints
- **Query Performance**: N+1 detection and optimization
- **Error Rates**: <1% for critical paths
- **Coverage**: 90% for services, 80% for controllers

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Performance Monitoring**: Response times and query analysis
- **Business Metrics**: Dashboard access and export usage
- **Error Tracking**: Comprehensive error classification

## Security & Compliance

### Security Requirements
- **Authentication**: JWT with MFA support
- **Authorization**: RBAC with scope-based access
- **Data Protection**: GDPR compliance with data minimization
- **Audit Logging**: All access and configuration changes

### Compliance Checklist
- ✅ Role-based access controls
- ✅ Data encryption at rest and in transit
- ✅ Comprehensive audit logging
- ✅ Export and data handling procedures
- ✅ Access scope management
- ✅ Security testing and validation

## Testing Strategy

### Unit Tests
- **Service Layer**: 90% coverage for all business logic
- **Controller Layer**: 80% coverage for all endpoints
- **Validation**: Input validation and error handling
- **Integration**: Service integration tests

### Integration Tests
- **Database**: Transaction and consistency
- **Dependencies**: Service collaboration
- **RBAC**: Role and scope testing
- **Performance**: Load and stress testing

### E2E Tests
- **Critical Workflows**: Report management, export, alerts
- **Authentication**: Login and role-based access
- **Authorization**: Permission validation
- **Error Handling**: Error scenario testing

## Deployment & Operations

### Environment Configuration
```bash
# Local Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Database Migration
npx prisma migrate deploy
npx prisma generate

# Testing
npm run test
npm run test:e2e
```

### Monitoring Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=app
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Project Timeline

### Sprint Planning
**Sprint 1 (Weeks 1-2)**: Foundation
- DTO Implementation (Task 1)
- Service Refactor (Task 2)
- Database Migration (Task 3)

**Sprint 2 (Weeks 3-4)**: Core Dashboards
- Azubi Dashboard (Task 4)
- Beauftragter Dashboard (Task 5)
- Ausbilder/HR Dashboard (Task 6)

**Sprint 3 (Weeks 5-6)**: Advanced Analytics
- Skill-Gap Analysis (Task 7)
- Course Completion (Task 8)
- Noten Trends (Task 9)
- Zeitreihen (Task 10)

**Sprint 4 (Weeks 7-8)**: Warn-Engine
- Frühwarn Engine (Task 11)
- Alert Configuration (Task 12)
- Kohorten-Vergleich (Task 13)

**Sprint 5 (Weeks 9-10)**: Export & Quality
- Export System (Task 14)
- Custom Report Builder (Task 15)
- Performance & RBAC (Task 16)
- Tests & Documentation (Task 17-18)

## Success Metrics

### Functional Metrics
- **Dashboard Load Time**: <2 seconds for all roles
- **API Response Time**: <500ms for critical paths
- **Export Generation**: <10 seconds for large datasets
- **Alert Processing**: <100ms for threshold detection

### Quality Metrics
- **Test Coverage**: 90% for services, 80% for controllers
- **Documentation**: Complete Swagger with examples
- **Code Quality**: No critical lint/typecheck errors
- **Performance**: No N+1 queries, efficient indexing

### Business Metrics
- **User Adoption**: 90% of Azubis use dashboard
- **Export Usage**: 70% of Ausbilder export reports
- **Alert Response**: <24 hours for critical alerts
- **Data Freshness**: <1 hour for dashboard data

## Conclusion

This comprehensive dashboard module expansion will transform the existing reporting system into a production-ready, feature-complete analytics platform that meets all business requirements. The incremental implementation approach ensures risk mitigation while delivering high-value functionality throughout the project lifecycle.

The resulting system will provide:
- **Real-time insights** for all user roles
- **Advanced analytics** for business intelligence
- **Configurable alerts** for proactive notifications
- **Export capabilities** for data portability
- **Comprehensive documentation** for integration
- **Robust testing** for reliability
- **Production-ready** deployment

This implementation aligns with the organization's strategic goals of data-driven decision making, improved operational efficiency, and enhanced user experience in the NextGen IT-Ausbildung platform.
