# Security Policy

## Supported Versions

| Version | Supported         |
| ------- | ----------------- |
| 1.x.x   | ✅ Active support |
| < 1.0   | ❌ Not supported  |

## Reporting a Vulnerability

**DO NOT open a public issue for security vulnerabilities.**

Please report security issues via:

1. **GitHub Security Advisory:** [Create private advisory](https://github.com/sohelrahaman/secure-role-guard/security/advisories/new)
2. **Email:** security@sohelrahaman.com

### What to Include

- Package version affected
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

### Response Timeline

| Severity | Initial Response | Fix Target         |
| -------- | ---------------- | ------------------ |
| Critical | 24 hours         | 24-48 hours        |
| High     | 48 hours         | 7 days             |
| Medium   | 7 days           | 30 days            |
| Low      | 14 days          | Next minor release |

## Security Design Principles

This package is built with security-first principles:

| Principle         | Implementation                      |
| ----------------- | ----------------------------------- |
| Zero dependencies | Core has no runtime dependencies    |
| Deny by default   | Missing permissions → access denied |
| Immutable configs | `Object.freeze()` on all registries |
| Pure functions    | No side effects, no mutations       |
| No dynamic code   | No eval, no new Function()          |
| No network access | Never makes HTTP requests           |
| No file system    | Never reads or writes files         |
| TypeScript strict | All strict flags enabled            |

## Disclosure Policy

We follow responsible disclosure:

1. Reporter contacts us privately
2. We acknowledge within 48 hours
3. We investigate and develop a fix
4. We release patched version
5. We credit the reporter (if desired)
6. We publish advisory after patch is available

## Author

**Sohel Rahaman**  
Maintainer, secure-role-guard
