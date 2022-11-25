# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

## [1.0.0] - 2022-11-25
### Changed
- use port `5017` instead of `5000` due to conflicts with other services (e.g. on macOS Monterey)
- rename package from `pdf-render` to `pdf-renderer`

### Added
- document how to deploy to Docker Hub



## [0.4.0] - 2022-11-23
### Changed
- updated dependencies
- upgraded node from version 16 (EOL) to 18 (LTS)
- updated download URL for google content as per their documentation
- do not use `sudo` to install dependencies in Docker (failed to compile with sudo on latest version)


## [0.3.0] - 2022-01-03
### Changed
- the task for docker now runs the server using vanilla `node` instead of `nodemon` along with more stuff utilizing `concurrently`. We observed, that puppeteer can crash, but nodemon prevents us from restrting since it waits for file changes (which aren't going to happen in production) [#145](https://github.com/lh-innovationhub/pdf-render/pull/145)
- docker now accepts `NODE_ENV` as `ARG` with `"production"` as default value [#145](https://github.com/lh-innovationhub/pdf-render/pull/145)


## [0.2.1] - 2021-12-16
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
