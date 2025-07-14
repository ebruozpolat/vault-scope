// CHANGELOG.md

# Changelog

All notable changes to **VaultScope** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.2.0] - 2025-07-14
### Added
- Alert filtering by resolution status (All / Unresolved)
- Alert filtering by severity (High / Medium / Low)
- Pagination with "Load More" functionality in alert viewer
- Skeleton loading indicators

### Changed
- AlertViewer component refactored for reactivity on filter changes

---

## [0.1.0] - 2025-07-12
### Added
- Initial AlertViewer UI with Supabase integration
- Real-time alert listing from `alert_logs` table
- ScenarioRuleEditor UI for adding JSON-based rules
- Basic dashboard layout with cards and alert badges
