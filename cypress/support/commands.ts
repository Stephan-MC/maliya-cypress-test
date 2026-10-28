/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

interface JiraTicketOptions {
	navigation: string;
	input: string;
	action: string;
	expectedResult: string;
	currentResult: string;
	impact: string;
	attachmenets: Array<string>;
}

declare global {
	namespace Cypress {
		interface Chainable {
			// login(email: string, password: string): Chainable<void>;

			// drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;

			// dismiss(
			// 	subject: string,
			// 	options?: Partial<TypeOptions>,
			// ): Chainable<Element>;

			// visit(
			// 	originalFn: CommandOriginalFn<any>,
			// 	url: string,
			// 	options: Partial<VisitOptions>,
			// ): Chainable<Element>;

			createTicket(
				t: Mocha.Runnable,
				options?: Partial<JiraTicketOptions>,
			): void;

			interactsWithJira(): void;
		}
	}
}

Cypress.Commands.add("createTicket", async (test, options = {}) => {
	const { navigation, input, action, expectedResult, currentResult, impact } =
		options;

	const getTicketTitleFromTest = (t: Mocha.Runnable) => {
		return `${t.parent?.title ? t.parent.title + ": " : ""}${t.title}`;
	};

	const description = `
      **Navigation**: 
      ${navigation || "- N/A"}

      **Input**: 
      ${input || "- N/A"}

      **Action**: 
      ${action || "- N/A"}

      **Expected Result**
      ${expectedResult || "- N/A"}

      **Current Result**:
      ${currentResult || "- N/A"}

      **Impact**:
      ${impact || "- N/A"}
    `;

	const JIRA_USERNAME = "munde.stephane@maliya.cm";
	const JIRA_API_TOKEN =
		"ATATT3xFfGF0ger3-YV_bQzXKikpy08zdvUazpYxGe0IQO8gfNnQ0fL55Xytmugrnlz6B4t2l79VPcbStuNMsrmh_ckuzAn-D9cChH7Cfyyoczbu64LNPFJ12fid_p9tjhTi2qrkZmGkiXD2YCLeyvHQqq0oblrbM9u2rynw3TCrZaIOpJXY8rU=537EB80B";
	const auth = btoa(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`);

	return await fetch(
		"https://maliya-cypress-test.atlassian.com/rest/api/2/issue",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${auth}`,
			},
			body: JSON.stringify({
				fields: {
					project: {
						key: "MI",
					},
					summary: getTicketTitleFromTest(test),
					description,
					issuetype: {
						name: "Bug",
					},
				},
			}),
		},
	);
});

Cypress.Commands.add("interactsWithJira", () => {
	cy.on("fail", (error, test) => {
		console.log("Interacting with jira", error, test);

		const navigation = Cypress.expose("JIRA_TICKET_NAVIGATION") || "";
		const input = Cypress.expose("JIRA_TICKET_INPUT") || "";
		const action = Cypress.expose("JIRA_TICKET_ACTION") || "";
		const expectedResult = Cypress.expose("JIRA_TICKET_EXPECTED_RESULT") || "";
		const currentResult = Cypress.expose("JIRA_TICKET_CURRENT_RESULT") || "";
		const impact = Cypress.expose("JIRA_TICKET_IMPACT");

		console.log({
			navigation,
			input,
			action,
			expectedResult,
			currentResult,
			impact,
		});

		const description = `
		     *Navigation*:
		     ${navigation || "- N/A"}


		     *Input*:
		     ${input || "- N/A"}


		     *Action*:
		     ${action || "- N/A"}


		     *Expected Result*
		     ${expectedResult || "- N/A"}


		     *Current Result*:
		     ${currentResult || "- N/A"}


		     *Impact*:
		     ${impact || "- N/A"}
		   `;

		const data = {
			fields: {
				project: {
					// id: "10002",
					key: "MI",
				},
				issuetype: {
					// id: "10046",
					name: "Bug",
				},
				summary: `${test.parent?.title ? test.parent.title + ": " : ""}${test.title}`,
				description,
			},
		};

		cy.task("jira:create-ticket", data);

		throw error;
	});
});

Cypress.Screenshot.defaults({
	capture: "runner",
	scale: true,
});

afterEach(function () {
	const test = this.currentTest;

	if (test?.state === "failed") {
		const summary = Cypress.currentTest.titlePath.join(": ");
		const navigation = Cypress.expose("JIRA_TICKET_NAVIGATION") || "";
		const input = Cypress.expose("JIRA_TICKET_INPUT") || "";
		const action = Cypress.expose("JIRA_TICKET_ACTION") || "";
		const expectedResult = Cypress.expose("JIRA_TICKET_EXPECTED_RESULT") || "";
		const currentResult = Cypress.expose("JIRA_TICKET_CURRENT_RESULT") || "";
		const impact = Cypress.expose("JIRA_TICKET_IMPACT") || "";

		const description = [
			`*Navigation*: \n${navigation || "- N/A"}`,

			`*Input*: \n${input || "- N/A"}`,

			`*Action*: \n${action || "- N/A"}`,

			`*Expected Result*: \n${expectedResult || "- N/A"}`,

			`*Current Result*: \n${currentResult || "- N/A"}`,

			`*Impact*: \n${impact || "- N/A"}`,
		].join("\n\n\n\n");

		const data = {
			params: {
				fields: {
					project: { key: "MI" },
					issuetype: { name: "Bug" },
					summary,
					description,
				},
			},
		};

		cy.task("jira:create-ticket", data);
		cy.screenshot(summary, {
			log: true,
			overwrite: true,
			capture: "runner",
			scale: true,
		});
	}
});
