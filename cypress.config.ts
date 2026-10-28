import { defineConfig } from "cypress";
import { existsSync, openAsBlob } from "node:fs";
import { basename } from "node:path";

let activeJiraIssueKey: string | null = null;

export default defineConfig({
	defaultBrowser: "chrome",
	trashAssetsBeforeRuns: true,
	screenshotOnRunFailure: false,
	projectId: process.env.BUN_PUBLIC_PROJECT_ID,
	e2e: {
		setupNodeEvents(on, config) {
			on("task", {
				"jira:create-ticket": async (data: { params: Record<string, any> }) => {
					const auth = Buffer.from(
						`${process.env.BUN_PUBLIC_JIRA_USERNAME}:${process.env.BUN_PUBLIC_JIRA_API_TOKEN}`,
					).toString("base64");

					try {
						const res = await fetch(
							`${process.env.BUN_PUBLIC_JIRA_API_URL}/rest/api/2/issue`,
							{
								method: "POST",
								headers: {
									Authorization: `Basic ${auth}`,
									"Content-Type": "application/json",
									Accept: "application/json",
									"Accept-Language": "en-US",
								},
								body: JSON.stringify(data.params),
							},
						);

						const issue = await res.json();

						if (res.ok && issue.key) {
							activeJiraIssueKey = issue.key;
							console.log(`[Jira Task] Created ticket: ${issue.key}`);
						} else {
							console.error(
								"[Jira Task Error] Failed to create Jira ticket:",
								issue,
							);
						}

						return issue;
					} catch (error) {
						console.error("[Jira Task Error] Network request error:", error);
						return null;
					}
				},
			});

			// Fires whenever any screenshot is taken and saved to disk
			on("after:screenshot", async (details) => {
				console.log("Inside Screenshot hook");
				// Upload if we have an active ticket key waiting for an attachment
				if (activeJiraIssueKey && existsSync(details.path)) {
					const issueKey = activeJiraIssueKey;
					activeJiraIssueKey = null; // Clear key to prevent duplicate uploads

					const auth = Buffer.from(
						`${process.env.BUN_PUBLIC_JIRA_USERNAME}:${process.env.BUN_PUBLIC_JIRA_API_TOKEN}`,
					).toString("base64");

					try {
						const form = new FormData();
						form.append(
							"file",
							await openAsBlob(details.path),
							basename(details.path),
						);

						const attachmentResponse = await fetch(
							`${process.env.BUN_PUBLIC_JIRA_API_URL}/rest/api/2/issue/${issueKey}/attachments`,
							{
								method: "POST",
								headers: {
									Authorization: `Basic ${auth}`,
									"Accept-Language": "en",
									"X-Atlassian-Token": "no-check",
								},
								body: form,
							},
						);

						const result = await attachmentResponse.json();
						console.log(
							`[Jira Attachment] Upload status for ${issueKey}:`,
							attachmentResponse.ok,
							result,
						);
					} catch (err) {
						console.error(`[Jira Attachment Error] Upload failed:`, err);
					}
				}

				return details;
			});
		},
	},
});
