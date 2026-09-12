<p align="center"><img src="docs/assets/logo.svg" width="88" alt="GradeForge logo"></p>

# GradeForge

![GradeForge — your grading scale and a result you can check](docs/assets/cover.svg)

GradeForge is a browser-local SGPA and CGPA calculator I built for students who want accurate calculations without wrestling with spreadsheets every semester.

[Open GradeForge](https://gradeforge.poorvithmp.com) · [My Portfolio](https://poorvithmp.com) · [GitHub](https://github.com/poorvith-mp/gradeforge)

## Why I built this

Most online GPA calculators are packed with ads, break when your university changes grading rules, or force you to sign up. I wanted something fast, clean, and completely private that works offline in your browser.

## Features

- **Install as an App**: Progressive Web App (PWA) with complete offline support. Install it on Android, iOS, or desktop and calculate grades without an internet connection.
- **See the Formula**: Formula transparency panel shows the exact mathematical rules and step-by-step worked numbers for your active semester.
- **University Presets & Provenance**: Verified presets for VTU CBCS, Anna University, Mumbai University, KTU, JNTU, US 4.0 GPA, UK Honours, and German scales, linked directly to official regulations.
- **Add Your University**: Easily contribute your institution's grading scheme via open PRs with verified official links.
- **Printable Unofficial Summary**: Generate clean, printer-ready A4 academic summaries at `/print` with a permanent unofficial watermark.
- **Share a Plan**: Share read-only plans with classmates via secure, compressed URL hashes (`#plan=`) with zero server storage.
- **Target CGPA Planner**: What-If simulator calculating required upcoming SGPA to hit your dream graduation CGPA.
- **Privacy Guarantee**: 100% browser-local storage (`localStorage`). No accounts, no telemetry, no analytics, and zero external network calls.

## Mathematical Formulas

### Semester SGPA
```text
SGPA = Σ(credit × grade point) ÷ Σ(credit)
```

### Cumulative CGPA
```text
CGPA = Σ(semester SGPA × semester credits) ÷ Σ(total credits)
```

### Percentage Equivalents
- **VTU**: `Percentage = (CGPA − 0.75) × 10`
- **Mumbai University**: Piecewise `if CGPA < 7: (7.1 × CGPA) + 11 else: (7.4 × CGPA) + 12`
- **Standard 10-Point (UGC/AICTE)**: `Percentage = CGPA × 10`
- **US 4.0 Scale**: `Percentage = (CGPA ÷ 4) × 100`

## Running locally

```bash
git clone https://github.com/poorvith-mp/gradeforge.git
cd gradeforge
npm install
npm run dev
```

To build the production bundle:

```bash
npm run build
```

The output files go straight to `dist/`.

## Contributing

Pull requests are welcome. Check [CONTRIBUTING.md](CONTRIBUTING.md) for how to add university presets or fix bugs.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Author

Built by [Poorvith M P](https://poorvithmp.com). You can find me on [GitHub](https://github.com/poorvith-mp).
