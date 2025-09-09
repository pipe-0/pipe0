import { PipeId, PipePayloadMap, PipesRequest } from "@pipe0/client-sdk";
import Oas from "oas";
import { OASDocument } from "oas/types";

const miniSpec: OASDocument = {
  openapi: "3.1.0",
  info: { title: "Pipe0 API", version: "0.5.0" },
  servers: [
    {
      url: "https://api.pipe0.com",
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  paths: {
    "/v1/pipes/run": {
      post: {
        summary: "Create a user",
        operationId: "createUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                },
                required: ["name", "email"],
              },
              example: {
                name: "Alice",
                email: "alice@example.com",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
          },
        },
      },
    },
  },
};

export const pipesMiniSpec = new Oas(miniSpec);

export const snippetCatalog = {
  "company:funding:leadmagic@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:funding:leadmagic@1",
      },
    ],
    input: [{ id: "1", company_website_url: "https://pipe0.com" }],
  },
  "company:identity@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:identity@1",
      },
    ],
    input: [
      {
        id: "1",
        company_name: "Pipe0",
      },
    ],
  },
  "company:identity@2": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:identity@2",
      },
    ],
    input: [
      {
        id: "1",
        company_name: "Pipe0",
      },
    ],
  },
  "company:overview@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:overview@1",
      },
    ],
    input: [
      {
        id: "1",
        company_website_url: "Pipe0",
      },
    ],
  },
  "people:phone:workemail:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:phone:workemail:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        work_email: "jane@pipe0.com",
      },
    ],
  },
  "people:workemail:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:workemail:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        name: "John Doe",
        company_website_url: "https://pipe0.com",
      },
    ],
  },
  "company:techstack:builtwith@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:techstack:builtwith@1",
      },
    ],
    input: [
      {
        id: "1",
        company_website_url: "https://pipe0.com",
      },
    ],
  },
  "prompt:run@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "prompt:run@1",
        config: {
          prompt: {
            template: `
    Tell me if {{ input name required="true" type="string" }} fits the ICP criteria for my company <YOUR_COMPANY_NAME>.

    My company, <YOUR_COMPANY_NAME>, can be described as follows: <ADD_COMPANY_DESCRIPTION>.

    Use the following information to make your decision:
    
    Job title: {{ input job_title type="string" }}.

    Profile headline (optional): {{ input profile_headline type="string" required="false" }}

    Output three fields:

    {{ output is_icp_fit type="boolean" description="A boolean flag indicating if the user is a good ICP fit for us" }}

    {{ output reason type="string" description="A text explanation of your decision process" }}

    {{ output json_summary type="json" schema="summary" description="A JSON object that combines both fields" }}
  `,
            json_schemas: {
              summary: {
                type: "object",
                properties: {
                  is_icp_fit: {
                    type: "boolean",
                    description:
                      "A boolean flag indicating if the user is a good ICP fit for us",
                  },
                  reason: {
                    type: "string",
                    description: "A text explanation of the decision process",
                  },
                },
                required: ["is_icp_fit", "reason"],
              },
            },
          },
        },
      },
    ],
    input: [
      {
        id: "1",
        name: "John Doe",
        job_title: "Founder",
      },
      {
        id: "2",
        name: "Jane Doe",
        job_title: "CTO",
        profile_headline: "CTO for a big tech company.",
      },
    ],
  },
  "people:email:iswork@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:email:iswork@1",
      },
    ],
    input: [
      {
        id: "1",
        email: "john@pipe0.com",
      },
    ],
  },
  "people:name:split@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:name:split@1",
      },
    ],
    input: [
      {
        id: "1",
        name: "John Doe",
      },
    ],
  },
  "people:name:join@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:name:join@1",
      },
    ],
    input: [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
      },
    ],
  },
  "people:personalemail:profile:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:personalemail:profile:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        profile_url: "https://linkedin.com/in/jane-doe-uth6-dk",
      },
    ],
  },
  "people:email:validate:zerobounce@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:email:validate:zerobounce@1",
      },
    ],
    input: [
      {
        id: "1",
        work_email: "jane@pipe0.com",
      },
    ],
  },
  "people:email:validate:zerobounce@2": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:email:validate:zerobounce@2",
      },
    ],
    input: [
      {
        id: "1",
        email: "jane@pipe0.com",
      },
    ],
  },
  "people:phone:profile:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:phone:profile:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        profile_url: "https://linkedin.com/li/jane-doe-456j",
      },
    ],
  },
  "people:profile:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:profile:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        profile_url: "https://linkedin.com/li/jane-doe-456j",
      },
    ],
  },
  "company:newssummary:website@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:newssummary:website@1",
      },
    ],
    input: [
      {
        id: "1",
        company_website_url: "https://pipe0.com",
      },
    ],
  },
  "company:websiteurl:email@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:websiteurl:email@1",
      },
    ],
    input: [
      {
        id: "1",
        email: "https://pipe0.com",
      },
    ],
  },
  "json:extract@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "json:extract@1",
        config: {
          json_extraction: {
            field_name: "example_json",
            extractions: [
              {
                path: "name",
                output_field: {
                  format: null,
                  name: "extracted_name",
                  label: "Simple Example Using Jsonata Path",
                  type: "string",
                },
              },
              {
                path: '{ "fullName": name, "count": $count(nested) }',
                output_field: {
                  format: null,
                  name: "reshaped_object",
                  label: "Complex Transformation Using Jasonata",
                  type: "json",
                },
              },
            ],
          },
        },
      },
    ],
    input: [
      {
        id: "1",
        example_json: {
          name: "John Doe",
          nested: [1, 2, 3],
        },
      },
    ],
  },
  "message:write@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "message:write@1",
        config: {
          model: "gemini-flash-latest",
          prompt: {
            template: `
Write an internal slack message that notifies the team about a high value signup 
that customer success should reach out to personally.

Include the name of the new signup in your message:

{{ input name type="string" }}

As well as the company name they work for:

{{ input company_name type="string" }}
            `,
          },
        },
      },
    ],
    input: [
      {
        id: "1",
        name: "https://pipe0.com",
        company_name: "Pipe0",
      },
    ],
  },
  "email:write@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "email:write@1",
        config: {
          model: "gemini-flash-latest",
          persona: "customer_success",
          signature: `
John Doe
Head of Customer Success
[LinkedIn](https://https://linkedin.com/li/john-doe)
          `,
          prompt: {
            template: `
Write a welcome message for new users of my app Pipe0.

Pipe0 is a data enrichment framework that serves both software engineers working on products that 
use data enrichment and GTM professionals.

Use the job title of the user to figure out which function the new user has: {{ input job_title type="string" required="true" }}.

Customize the message using the name of the user: {{ input name type="string" required="true" }}.
            `,
          },
        },
      },
    ],
    input: [
      {
        id: "1",
        job_title: "GTM Engineer",
        name: "Pipe Piper",
      },
    ],
  },
  "people:profileurl:name@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:profileurl:name@1",
      },
    ],
    input: [
      {
        id: "1",
        name: "John",
        company_name: "Pipe0",
      },
    ],
  },
  "template:fill@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "template:fill@1",
        config: {
          template: `Hey team: A new user has just signed up. Here's the info:
**Name**: {{ input name type="string" }}
**Email**: {{ input email type="string" }}
`,
        },
      },
    ],
    input: [
      {
        id: "1",
        name: "John",
        email: "john@pipe0.com",
      },
    ],
  },
  "email:send:resend@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        connector: {
          strategy: "first",
          connections: [
            {
              connection: "<PROVIDE_YOUR_OWN_CONNECTION_VIA_DASHBOARD>",
              type: "vault",
            },
          ],
        },
        pipe_id: "email:send:resend@1",
        config: {
          reply_to: "<REPLY_TO_EMAIL_ADDRESS>",
          from: "<FROM_EMAIL_ADDRESS>",
        },
      },
    ],
    input: [
      {
        id: "1",
        email: "<EMAIL_ADDRESS>",
        email_body: "<EMAIL_TEXT>",
        email_subject: "<EMAIL_SUBJECT_LINE>",
      },
    ],
  },
  "email:send:gmail@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        connector: {
          strategy: "first",
          connections: [
            {
              connection: "<PROVIDE_YOUR_OWN_CONNECTION_VIA_DASHBOARD>",
              type: "vault",
            },
          ],
        },
        pipe_id: "email:send:gmail@1",
        config: {
          reply_to: "<REPLY_TO_EMAIL_ADDRESS>",
        },
      },
    ],
    input: [
      {
        id: "1",
        email: "<EMAIL_ADDRESS>",
        email_body: "<EMAIL_TEXT>",
        email_subject: "<EMAIL_SUBJECT_LINE>",
      },
    ],
  },
  "message:send:slack@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        connector: {
          strategy: "first",
          connections: [
            {
              connection: "<PROVIDE_YOUR_OWN_CONNECTION_VIA_DASHBOARD>",
              type: "vault",
            },
          ],
        },
        pipe_id: "message:send:slack@1",
        config: {
          channel_id: "<SLACK_CHANNEL_ID>",
        },
      },
    ],
    input: [
      {
        id: "1",
        message: "<MESSAGE_TEXT>",
      },
    ],
  },

  "people:profileurl:email:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:profileurl:email:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        email: "<MESSAGE_TEXT>",
      },
    ],
  },

  // deprecated
  "people:validate:email:zerobounce@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:validate:email:zerobounce@1",
      },
    ],
    input: [
      {
        id: "1",
        work_email: "john@pipe0.com",
      },
    ],
  },
  "people:mobilenumber:workemail:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:mobilenumber:workemail:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        work_email: "john@pipe0.com",
      },
    ],
  },
  "people:professionalprofile:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:professionalprofile:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        professional_profile_url: "john@pipe0.com",
      },
    ],
  },
  "people:professionalprofileurl:name@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:professionalprofileurl:name@1",
      },
    ],
    input: [
      {
        id: "1",
        name: "John",
        company_name: "Pipe0",
        location_int: "Berlin",
      },
    ],
  },
  "people:professionalprofileurl:email:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:professionalprofileurl:email:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        email: "john@pipe0.com",
      },
    ],
  },
  "people:mobilenumber:professionalprofile:waterfall@1": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "people:mobilenumber:professionalprofile:waterfall@1",
      },
    ],
    input: [
      {
        id: "1",
        professional_profile_url: "https://linkedin.com/li/john",
      },
    ],
  },
  "company:overview@2": {
    config: {
      environment: "production",
    },
    pipes: [
      {
        pipe_id: "company:overview@2",
      },
    ],
    input: [
      {
        id: "1",
        company_website_url: "Pipe0",
      },
    ],
  },
} satisfies { [K in PipeId]: PipesRequest & { pipes: PipePayloadMap[K][] } };
