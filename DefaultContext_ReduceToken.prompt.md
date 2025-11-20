# Default Context - Reduce Token Usage

## Token Optimization Principle
When performing operations that consume significant tokens, convert outputs to **VS Code style comma-separated values (CSV)** format to minimize token usage while maintaining clarity.

## Comma-Separated Value Format (CSV Style)
Instead of verbose markdown lists or long prose, use this format:
```
filename.ext, path/to/file, description, status
another.js, src/utils/, helper function, active
component.tsx, src/components/, react component, completed
```

## When to Apply Token Reduction
Trigger token reduction for operations involving:
- **File listings**: Use `filename, path, description, size` format
- **Search results**: Use `file, line_number, match_type, context` format
- **Code summaries**: Use `symbol, type, location, usage_count` format
- **Error reports**: Use `file, line, error_type, severity` format
- **Dependency lists**: Use `package, version, type, purpose` format

## VS Code Style Guidelines
1. **Separate fields with commas**: Each data point separated by `, `
2. **Keep descriptions brief**: 1-2 words per field
3. **Use consistent ordering**: Same field order across all rows
4. **Quote when necessary**: Only quote fields containing commas or special characters
5. **Skip verbose prose**: No full sentences; use abbreviated descriptions

## Example: File Search Results
**Instead of:**
```
I found 5 matching files. The first one is located at src/models/user.ts 
and contains the User class definition. The second file is in src/utils/helpers.ts...
```

**Use:**
```
src/models/user.ts, line 12, class definition, User
src/utils/helpers.ts, line 45, function definition, calculateTotal
src/components/Layout.tsx, line 8, component, Layout
src/api/endpoints.ts, line 23, constant, API_BASE_URL
config/database.ts, line 1, import, connection setup
```

## Example: Code Operation Summary
**Instead of:**
```
I have completed several modifications to your files. First, I updated the authentication 
logic in the auth service. Then I added new error handling to the API routes...
```

**Use:**
```
COMPLETED: src/services/auth.ts, line 34, logic update, authentication
COMPLETED: src/routes/api.ts, line 89, error handling, added try-catch
COMPLETED: src/utils/validators.ts, line 12, validation, new regex
IN-PROGRESS: src/db/migrations.ts, database schema, pending review
```

## Token Budget Awareness
- Target: Keep responses under 200K tokens
- Monitor: Each verbose operation can consume 10-50x more tokens than CSV format
- Verify: Before large operations, ask if CSV output is acceptable
- Optimize: Combine related operations to reduce redundant processing

---
**Remember**: Comma-separated values are not a limitation—they're a clarity enhancement that respects token budgets while improving readability.
