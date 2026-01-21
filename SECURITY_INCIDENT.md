# 🔒 SECURITY NOTICE

## Exposed Credentials on GitHub ⚠️

**CRITICAL:** Admin credentials were exposed in commit `c90b4bd..7af7a75` on GitHub.

### Action Required:

1. **Immediately revoke the old credentials:**
   - Email: `superadmin@securevotex.com`
   - Password: `Admin@123` (NOW EXPIRED - DO NOT USE)

2. **Delete the compromised admin account from your production database:**
   ```sql
   DELETE FROM users WHERE email = 'superadmin@securevotex.com';
   ```

3. **Create a new admin with secure credentials:**
   ```bash
   # Set in your .env file:
   SUPER_ADMIN_EMAIL=your-new-secure-email@domain.com
   SUPER_ADMIN_PASSWORD=generate-a-strong-password-here
   
   # Then run:
   node create-superadmin.js
   ```

4. **Force password changes:**
   - All admins should change their passwords immediately
   - Any users who registered during this exposure should be notified

### Best Practices Going Forward:

✅ **DO:**
- Use environment variables for all secrets
- Add `.env` files to `.gitignore` (already done)
- Use strong, unique passwords
- Rotate credentials regularly
- Use a secrets manager (e.g., Railway, Render secrets)

❌ **DON'T:**
- Hardcode credentials in source code
- Commit `.env` files to git
- Use default credentials in production
- Share credentials in chat or email

### How to Prevent This:

1. Review [SECURITY.md](./SECURITY.md) for security guidelines
2. Use pre-commit hooks to prevent `.env` commits
3. Implement secrets scanning in CI/CD
4. Enable branch protection rules requiring code review

---

**Last Updated:** January 21, 2026
**Status:** Fixed - Code updated to use environment variables
