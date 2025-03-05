# Contributing to LexiShift

🎉 Thank you for your interest in contributing to **LexiShift**! This project is an open-source browser extension that helps users translate and define words on the go. We welcome contributions to improve functionality, fix bugs, and enhance the user experience.

## Getting Started

To contribute to LexiShift, follow these steps:

### 1. Fork the Repository
- Go to the [LexiShift GitHub repository](<https://github.com/rohit32999/LexiShift>)
- Click the **Fork** button at the top right to create your copy of the project.

### 2. Clone the Repository
Once you have forked the repo, clone it to your local machine:

```bash
git clone https://github.com/<your-username>/LexiShift.git
cd LexiShift
3. Set Up the Project
Ensure you have a web browser that supports extensions (Chrome or Firefox).
Load the extension manually:
Open Chrome and go to chrome://extensions/
Enable Developer Mode (toggle on the top right)
Click Load unpacked and select the LexiShift project folder.
4. Explore the Codebase
LexiShift consists of:

popup.html → The extension UI
popup.js → Fetches word definitions and displays them
translate.js → Handles translation via API requests
content.js → Injects scripts for text selection
background.js → Manages extension background tasks
manifest.json → Defines extension metadata
5. Pick an Issue
Check out the Issues tab on GitHub for open tasks.
If you want to work on something new, open an issue first to discuss it.
6. Create a Branch
Before making changes, create a new branch:
git checkout -b feature-your-feature-name
7. Make Your Changes
Fix bugs, add features, or improve documentation.
Test the extension locally to ensure your changes work.
8. Commit & Push
After making your changes:
git add .
git commit -m "Describe your changes"
git push origin feature-your-feature-name
9. Submit a Pull Request (PR)
Go to your forked repository on GitHub.
Click New Pull Request.
Select main as the base branch and your feature branch as the compare branch.
Add a clear description of your changes and submit the PR.
Contribution Guidelines
Follow best practices for clean, readable code.
Write meaningful commit messages.
Ensure changes do not break existing functionality.
Get feedback and iterate based on code reviews.
