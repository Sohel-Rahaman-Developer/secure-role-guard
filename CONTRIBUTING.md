# Contributing to secure-role-guard

Thank you for your interest in contributing! This document provides guidelines for contributing to this security-focused RBAC library.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/sohelrahaman/secure-role-guard.git
cd secure-role-guard

# Install dependencies
npm install

# Build the package
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Making Changes

### 1. Fork and Branch

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/secure-role-guard.git
cd secure-role-guard
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style
- Add/update tests if applicable
- Update documentation if needed

### 3. Verify Your Changes

```bash
npm run type-check
npm run lint
npm run build
```

### 4. Commit with Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Usage                        |
| ----------- | ---------------------------- |
| `feat:`     | New feature                  |
| `fix:`      | Bug fix                      |
| `docs:`     | Documentation only           |
| `refactor:` | Code change (no feature/fix) |
| `test:`     | Adding/updating tests        |
| `chore:`    | Maintenance tasks            |

Examples:

```bash
git commit -m "feat: add Fastify adapter"
git commit -m "fix: resolve wildcard matching edge case"
git commit -m "docs: update Next.js example"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Pull Request Guidelines

### Required for All PRs

- [ ] Clear description of changes
- [ ] All CI checks pass
- [ ] No breaking changes (for minor/patch)

### Required for Permission Logic Changes

Any PR that modifies permission resolution logic requires:

- [ ] Explicit test cases covering the change
- [ ] Security review by maintainer
- [ ] Documentation of behavioral changes
- [ ] Explanation of why the change is safe

## What We're Looking For

### Good Contributions

- Bug fixes with test cases
- Documentation improvements
- New adapters (Fastify, Koa, etc.)
- Performance improvements (without changing behavior)
- TypeScript type improvements

### What to Avoid

- Breaking API changes (discuss first)
- Adding authentication logic (out of scope)
- Adding runtime dependencies to core
- Features that compromise security guarantees

## Questions?

- **General questions:** Open a [Discussion](https://github.com/sohelrahaman/secure-role-guard/discussions)
- **Bug reports:** Open an [Issue](https://github.com/sohelrahaman/secure-role-guard/issues)
- **Security issues:** See [SECURITY.md](SECURITY.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Maintainer:** Sohel Rahaman
