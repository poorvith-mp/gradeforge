<p align="center"><img src="docs/assets/logo.svg" width="88" alt="GradeForge logo"></p>

# GradeForge

![GradeForge — your grading scale and a result you can check](docs/assets/cover.svg)

GradeForge is a browser-local SGPA and CGPA calculator I built for students who want accurate calculations without wrestling with spreadsheets every semester.

[Open GradeForge](https://gradeforge.poorvithmp.com) · [My Portfolio](https://poorvithmp.com) · [GitHub](https://github.com/poorvith-mp/gradeforge)

## Why I built this

Most online GPA calculators are packed with ads, break when your university changes grading rules, or force you to sign up. I wanted something fast, clean, and completely private that works offline in your browser.

## Features in v2.1.0

- **16 General Regional & International Presets**: Built-in verified scales across India (VTU CBCS, Anna University, Mumbai University, KTU, JNTU, UGC Generic 10-Point, Central Universities 9.5x, Autonomous Engineering 10-Point), North America (US 4.0, Canada 4.33), UK & Europe (UK Honours, European ECTS, German Inverted 1.0–5.0, French 20-Point), and Australia & Asia-Pacific (Australia 7.0, Singapore 5.0 CAP).
- **Custom Scale Builder & Editor**: Create and edit custom grading scales with any maximum scale up to 100, define custom letter grades and points, and select your percentage conversion formula (`CGPA × 10`, `CGPA × 9.5`, `(CGPA − 0.75) × 10`, or proportional).
- **Cross-System GPA & Percentage Converter**: Bidirectionally convert scores across 10-point, US 4.0, Canada 4.33, German 1.0–5.0, UK Honours, French 20-Point, Australia 7.0, and Singapore 5.0 systems.
- **See the Formula**: Formula transparency panel shows the exact mathematical rules and step-by-step worked numbers for your active semester.
- **Persistent Zero-Login Onboarding**: Configure your profile name, default grading scale, or sample data on first visit; everything persists in browser `localStorage` with zero accounts required.
- **Printable Unofficial Summary**: Generate clean, printer-ready A4 academic summaries at `/print` with a permanent unofficial watermark.
- **Share a Plan**: Share read-only plans with classmates via secure, compressed URL hashes (`#plan=`) with zero server storage.
- **Target CGPA Planner**: What-If simulator calculating required upcoming SGPA to hit your target graduation CGPA.
- **Install as an Offline PWA**: Progressive Web App with complete offline support on Android, iOS, and desktop.

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
- **Central Universities / CBSE (9.5x)**: `Percentage = CGPA × 9.5`
- **Standard 10-Point (UGC / AICTE / Autonomous)**: `Percentage = CGPA × 10`
- **German Inverted Scale (1.0 - 5.0)**: `Percentage = ((5.0 − CGPA) ÷ 4.0) × 100`
- **Proportional International Scales (4.0, 4.33, 5.0, 7.0, 20)**: `Percentage = (CGPA ÷ MaxScale) × 100`

## Running locally

```bash
git clone https://github.com/poorvith-mp/gradeforge.git
cd gradeforge
npm install
npm run dev
```

To build and test the production bundle:

```bash
npm run build
npm test
```

The output files go straight to `dist/`.

## Contributing

Pull requests are welcome. Check [CONTRIBUTING.md](CONTRIBUTING.md) for how to add regional grading presets or fix bugs.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Author

Built by [Poorvith M P](https://poorvithmp.com). You can find me on [GitHub](https://github.com/poorvith-mp).
