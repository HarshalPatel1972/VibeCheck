const { prompt } = require("enquirer");
const chalk = require("chalk");
const boxen = require("boxen");
const { getConfig } = require("./config");

let decisionCount = 0;

function getSeverityColor(severity) {
  switch (severity) {
    case "INFO":
      return chalk.white;
    case "LOW":
      return chalk.blue;
    case "MEDIUM":
      return chalk.yellow;
    case "HIGH":
      return chalk.keyword("orange");
    case "DANGER":
      return chalk.red;
    case "CRITICAL":
      return chalk.red.bold;
    default:
      return chalk.white;
  }
}

async function askApproval(translation, filePath, diffSnippet = "") {
  decisionCount++;

  const config = getConfig();
  const { plainEnglish } = translation;

  // Apply severity override
  let severity =
    config.severityOverrides[translation.patternId] || translation.severity;

  // Auto-approve rule
  if (config.autoApproveThreshold.includes(severity)) {
    return "approved_auto";
  }

  // TEST MODE: If interactive mode is disabled via env var
  if (process.env.VIBECHECK_INTERACTIVE === "false") {
    const mockAction = process.env.VIBECHECK_MOCK_ACTION || "reject";
    console.log(
      chalk.magenta(`[TEST MODE] Auto-responding with: ${mockAction}`),
    );
    return mockAction;
  }

  const color = getSeverityColor(severity);
  const title = `VibeCheck — Decision #${decisionCount}`;

  let content = `  📄 File: ${filePath}\n`;
  content += `  🤖 What AI is doing:\n     ${color(plainEnglish.replace(/\n/g, "\n     "))}\n\n`;
  if (diffSnippet) {
    content += `  📝 Changes:\n     ${diffSnippet.replace(/\n/g, "\n     ")}\n`;
  }

  console.log(
    boxen(content, {
      title: chalk.bold(title),
      padding: 1,
      borderStyle: "round",
      borderColor: "gray",
    }),
  );

  try {
    const response = await prompt({
      type: "select",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "approve", message: "✅ Y — Approve", value: "approve" },
        { name: "reject", message: "❌ N — Reject", value: "reject" },
        { name: "explain", message: "❔ ? — Explain more", value: "explain" },
      ],
    });

    if (response.action === "explain") {
      console.log(
        chalk.cyan(
          `\nExplanation: This change was flagged as ${severity} because it matches known patterns. Proceed with caution.\n`,
        ),
      );
      // Ask again
      const retry = await prompt({
        type: "select",
        name: "action",
        message: "After explanation, what do you want to do?",
        choices: [
          { name: "approve", message: "✅ Y — Approve", value: "approve" },
          { name: "reject", message: "❌ N — Reject", value: "reject" },
        ],
      });
      return retry.action;
    }

    return response.action;
  } catch (err) {
    // If user presses Ctrl+C
    console.log(
      chalk.yellow(
        "\nAction cancelled. Change rejected by default to be safe.",
      ),
    );
    return "reject";
  }
}

module.exports = {
  askApproval,
};
