# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Updated all dependcies (solves 23 from 158 CVE issues, solves 8/10 with "high" severity), [#132](https://github.com/lh-innovationhub/pdf-render/pull/132)
- Upgraded Node from 14 -> 16 (current LTS) for the docker image
- Upgraded Docker to use latest stable Debian (bullseye), which resolves another 58 CVE issues, now down to 1 High and 76 other.

## [0.2.0] - 2021-08-05
### Added
- setting `NODE_ENV=development` will now skip the hardcoded exec path for puppeteer, allowing to run this locally on macOS

## [0.1.0] - 2021-06-16
### Added
- Initial release
