const fs = require('fs');
const path = require('path');

const OWNER = "JovankaTangkilisan";
const REPO = "campus-maintenance";
const FILE_PATH = path.join(__dirname, 'campus-service-request-maintenance-issue-plan.md');

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("Error: GITHUB_TOKEN environment variable is not set.");
    console.log("\nPlease set the GITHUB_TOKEN environment variable and run the script again.");
    console.log("Example (PowerShell):");
    console.log("  $env:GITHUB_TOKEN=\"your_github_personal_access_token\"");
    console.log("  node publish-issues.js");
    console.log("\nExample (CMD):");
    console.log("  set GITHUB_TOKEN=your_github_personal_access_token");
    console.log("  node publish-issues.js");
    process.exit(1);
  }

  if (!fs.existsSync(FILE_PATH)) {
    console.error(`Error: File not found at ${FILE_PATH}`);
    process.exit(1);
  }

  console.log("Reading issue plan...");
  const content = fs.readFileSync(FILE_PATH, 'utf8');

  // Parse issues using regex
  const issueRegex = /### (GH-DRAFT-\d+):\s*(.*?)\n([\s\S]*?)(?=\n### GH-DRAFT-|\n## 5\. Dependency)/g;
  const parsedIssues = [];
  let match;
  while ((match = issueRegex.exec(content)) !== null) {
    const draftId = match[1];
    const title = match[2].trim();
    const rest = match[3];

    const metadata = {};
    const bodyLines = [];
    const lines = rest.split('\n');
    let parsingMeta = true;

    for (const line of lines) {
      if (parsingMeta && line.startsWith('- ')) {
        const separatorIdx = line.indexOf(':');
        if (separatorIdx !== -1) {
          const key = line.substring(2, separatorIdx).trim();
          const value = line.substring(separatorIdx + 1).trim();
          metadata[key] = value;
        }
      } else {
        if (line.trim() !== '' || bodyLines.length > 0) {
          parsingMeta = false;
          bodyLines.push(line);
        }
      }
    }

    parsedIssues.push({
      draftId,
      title,
      metadata,
      body: bodyLines.join('\n').trim()
    });
  }

  if (parsedIssues.length === 0) {
    console.error("Error: No issues parsed from the markdown file. Check the format.");
    process.exit(1);
  }

  console.log(`Parsed ${parsedIssues.length} issue drafts.`);

  // Dependency order list
  const dependencyOrder = [
    'GH-DRAFT-001', 'GH-DRAFT-002', 'GH-DRAFT-003', 'GH-DRAFT-004', 'GH-DRAFT-005',
    'GH-DRAFT-006', 'GH-DRAFT-007', 'GH-DRAFT-008', 'GH-DRAFT-009', 'GH-DRAFT-010',
    'GH-DRAFT-011', 'GH-DRAFT-012', 'GH-DRAFT-013'
  ];

  // Sort issues according to dependency order
  parsedIssues.sort((a, b) => {
    return dependencyOrder.indexOf(a.draftId) - dependencyOrder.indexOf(b.draftId);
  });

  const draftToRealNumber = {};
  console.log("Starting GitHub Issue creation...");

  for (const issue of parsedIssues) {
    let finalTitle = issue.title;
    let finalBody = issue.body;
    
    // Replace all drafts with real issue numbers in title and body
    for (const [draftId, realNum] of Object.entries(draftToRealNumber)) {
      finalTitle = finalTitle.replaceAll(draftId, realNum);
      finalBody = finalBody.replaceAll(draftId, realNum);
    }

    const labels = issue.metadata['Labels']
      ? issue.metadata['Labels'].split(',').map(l => l.trim())
      : [];

    console.log(`Creating ${issue.draftId}: "${finalTitle}"...`);

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'node-fetch'
        },
        body: JSON.stringify({
          title: finalTitle,
          body: finalBody,
          labels: labels
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create issue for ${issue.draftId}: HTTP ${response.status} - ${errorText}`);
        process.exit(1);
      }

      const data = await response.json();
      console.log(`Successfully created! Real GitHub Issue: #${data.number}`);
      draftToRealNumber[issue.draftId] = `#${data.number}`;

      // Sleep briefly to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Network error creating issue ${issue.draftId}:`, err);
      process.exit(1);
    }
  }

  console.log("\nAll issues published successfully!");
  console.log("Mapping of Draft IDs to Real GitHub Issue numbers:");
  console.table(draftToRealNumber);
}

main().catch(err => {
  console.error("Unhandled rejection:", err);
});
