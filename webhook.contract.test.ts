import Ajv from "ajv";
import schema from "./webhook.schema.json";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

function createValidPayload(): any {
  return {
    id: "evt_123456",
    type: "payment_intent.succeeded",
    created: 1760000000,
    data: {
      object: {
        id: "pi_123456",
        status: "succeeded",
        amount: 2000,
        currency: "usd"
      }
    }
  };
}

describe("Stripe webhook contract tests", () => {
  test("valid payment_intent.succeeded webhook passes validation", () => {
    const payload = createValidPayload();

    expect(validate(payload)).toBe(true);
  });

  test("webhook without status fails validation", () => {
    const payload = JSON.parse(JSON.stringify(createValidPayload()));
    delete payload.data.object.status;

    expect(validate(payload)).toBe(false);
  });

  test("webhook with incorrect type fails validation", () => {
    const payload = createValidPayload();
    payload.type = "payment_intent.created";

    expect(validate(payload)).toBe(false);
  });

  test("webhook with amount as a string fails validation", () => {
    const payload = createValidPayload();
    payload.data.object.amount = "2000";

    expect(validate(payload)).toBe(false);
  });
});

