## Description

<!-- Describe your changes clearly -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Security fix
- [ ] Refactoring (no functional changes)

## Checklist

### Required for All PRs

- [ ] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guidelines
- [ ] My code follows the project's code style
- [ ] I have run `npm run type-check` and it passes
- [ ] I have run `npm run build` and it succeeds
- [ ] I have updated documentation (if applicable)

### For Permission Logic Changes

> ⚠️ Any change that affects permission resolution requires extra scrutiny.

- [ ] This change does NOT affect permission resolution logic
- [ ] OR: This change affects permission logic and I have:
  - [ ] Added explicit test cases for the change
  - [ ] Documented the behavioral change
  - [ ] Explained why this is safe in the PR description

## Security Consideration

<!--
For ANY change that touches permission logic, answer:
- Why is this change safe?
- What edge cases did you consider?
- Could this change accidentally grant or deny access?
-->

## Related Issues

<!-- Link to related issues: Fixes #123, Related to #456 -->
