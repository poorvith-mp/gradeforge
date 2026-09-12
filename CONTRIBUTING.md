# Contributing to GradeForge

Thanks for wanting to help improve GradeForge. Whether you're adding a grading preset for your university, fixing a math edge case, or tweaking the UI, contributions are welcome.

## How you can help

1. **Adding university grading schemes**: If your college or university uses a specific grading scale, you can add it to `src/constants/presets.ts`.
2. **Bug fixes & edge cases**: Handling strange credit combinations, rounding mismatches, or layout glitches on mobile.
3. **Feature improvements**: Suggesting useful tools for students (like better export options or formula explainers).

## Adding a University Preset

To add a new university preset to `src/constants/presets.ts`, please follow these guidelines:

1. **One preset per pull request**: Keep changes focused and easy to review.
2. **Provenance is mandatory**: Both `verifiedAgainst` (official regulation URL) and `verifiedOn` (`YYYY-MM-DD` audit date) must be provided.
3. **Attach official source evidence**: Include a link or screenshot of the official grading table and conversion formula in your PR description.
4. **Follow the required object schema**:

```ts
{
  id: 'presidency-univ',
  name: 'Presidency University (10-point)',
  maxScale: 10,
  isCustom: false,
  region: 'India',
  description: 'Presidency University Bengaluru Academic Regulations Scheme',
  formula: {
    sgpa: 'SGPA = Σ(credit × grade point) ÷ Σ(credit)',
    cgpa: 'CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)',
    percentage: 'CGPA × 10', // Or official formula
    note: 'Optional note on official percentage conversion',
  },
  verifiedAgainst: 'https://presidencyuniversity.in/academic-regulations.pdf',
  verifiedOn: '2026-09-12',
  grades: [
    { label: 'O', point: 10 },
    { label: 'A+', point: 9 },
    { label: 'A', point: 8 },
    { label: 'B+', point: 7 },
    { label: 'B', point: 6 },
    { label: 'C', point: 5 },
    { label: 'P', point: 4 },
    { label: 'F', point: 0 },
  ],
}
```

## Getting started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/your-username/gradeforge.git
   cd gradeforge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feat/add-my-university-scale
   ```

## Rules to keep in mind

- **Keep it 100% private**: No backend databases, logins, or tracking of student grades. Everything must work client-side in the browser.
- **Verify the math**: Any new grading scale or formula calculation needs to be verified against the official university syllabus or notification.
- **Run the build**: Make sure `npm run build` passes with zero TypeScript and bundling errors before opening a pull request.

## Submitting a PR

1. Commit your changes with a clear commit message.
2. Push to your fork and open a Pull Request against `main`.
3. Explain what you changed and why, with references if you added new grading schemes.

I review PRs as soon as I can. If you want to discuss an idea before building it, open an issue on GitHub first.
