import { faker } from "@faker-js/faker";

describe("[FE][Student]", {
	testIsolation: false,
	expose: {
		JIRA_TICKET_NAVIGATION: "Students -> All Students",
		JIRA_TICKET_INPUT: "",
		JIRA_TICKET_ACTION: "",
		JIRA_TICKET_EXPECTED_RESULT: "",
		JIRA_TICKET_CURRENT_RESULT: "",
		JIRA_TICKET_IMPACT: "",
	},
}, () => {
	before(() => {
		cy.visit("http://localhost:3000/students");
	});

	beforeEach(() => {
		// cy.interactsWithJira();
		// console.log("Running a test");
	});

	it("Shows student list", {
		expose: {
			jira: {},
		},
	}, () => {
		cy.intercept("GET", "http://localhost:5000/students?", (req) => {})
			.as("getStudents")
			.wait("@getStudents");
	});

	it("Can open student creation Modal", {
		expose: {
			JIRA_TICKET_EXPECTED_RESULT:
				"Clicking the [Add Student] Button should open the modal(`dialog[open]`) and it should be visible",
		},
	}, () => {
		cy.get("button.add-student-button").click();

		cy.get("dialogs[open]").should(($el) => {
			expect($el).to.exist;
		});
	});

	it("Can create a new student", () => {
		cy.get("input[name=first_names]").type(faker.person.firstName());
		cy.get("input[name=last_name]").type(faker.person.lastName());
		cy.get("input[name=matricule]")
			.type(faker.airline.flightNumber())
			.then(($el) => {
				$el.closest("form").submit((event) => {});
			});
	});
});
