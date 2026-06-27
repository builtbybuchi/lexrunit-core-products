# WhatsApp Flows Setup Guide

WhatsApp Flows allow you to create rich, interactive forms directly inside WhatsApp. To implement the "Book Consultation", "Order Drug", and "Order Lab Test" features seamlessly, you will need to create three separate Flows in your Meta Developer Dashboard.

## Prerequisites
1. Access to the [Meta Business Suite](https://business.facebook.com/).
2. Your WhatsApp Business Account configured in the Meta Developer Dashboard.
3. Access to the **Flows Builder**.

---

## Step 1: Create the Flows

1. Go to your **WhatsApp Manager** > **Account Tools** > **Flows**.
2. Click **Create Flow**.
3. You will need to repeat this process three times, creating three distinct flows:
   - Flow 1 Name: `book_consultation_flow`
   - Flow 2 Name: `order_drug_flow`
   - Flow 3 Name: `order_lab_test_flow`

---

## Step 2: Configure the JSON Schemas

For each flow, you will enter the Flow Builder and paste the respective JSON code. This JSON defines the screens, inputs, and routing of the interactive form.

### 1. Book Consultation Flow (`book_consultation_flow`)
This flow allows patients to select a date, time, and reason for their consultation.

```json
{
  "version": "7.3",
  "routing_model": {
    "book_consultation": []
  },
  "screens": [
    {
      "id": "book_consultation",
      "title": "Book a Consultation",
      "terminal": true,
      "success": true,
      "data": {
        "time_options": {
          "type": "array",
          "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" } } },
          "__example__": [
            { "id": "morning", "title": "Morning (8AM - 12PM)" },
            { "id": "afternoon", "title": "Afternoon (12PM - 4PM)" },
            { "id": "evening", "title": "Evening (4PM - 8PM)" }
          ],
          "__value__": [
            { "id": "morning", "title": "Morning (8AM - 12PM)" },
            { "id": "afternoon", "title": "Afternoon (12PM - 4PM)" },
            { "id": "evening", "title": "Evening (4PM - 8PM)" }
          ]
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "Consultation Details"
          },
          {
            "type": "TextBody",
            "text": "Please provide the details for your appointment."
          },
          {
            "type": "DatePicker",
            "name": "consult_date",
            "label": "Preferred Date",
            "required": true
          },
          {
            "type": "Dropdown",
            "name": "consult_time",
            "label": "Preferred Time",
            "required": true,
            "data-source": "${data.time_options}"
          },
          {
            "type": "TextInput",
            "name": "symptoms",
            "label": "Briefly describe your symptoms/reason",
            "required": true,
            "input-type": "text"
          },
          {
            "type": "Footer",
            "label": "Submit Request",
            "on-click-action": {
              "name": "complete",
              "payload": {
                "action": "book_consultation",
                "date": "${form.consult_date}",
                "time": "${form.consult_time}",
                "symptoms": "${form.symptoms}"
              }
            }
          }
        ]
      }
    }
  ]
}
```

### 2. Order Drug Flow (`order_drug_flow`)
This flow allows patients to request a prescription refill or order new drugs to be delivered.

```json
{
  "version": "7.3",
  "routing_model": {
    "order_drug": []
  },
  "screens": [
    {
      "id": "order_drug",
      "title": "Order Medication",
      "terminal": true,
      "success": true,
      "data": {
        "status_options": {
          "type": "array",
          "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" } } },
          "__example__": [
            { "id": "has_prescription", "title": "I have a prescription for this" },
            { "id": "refill", "title": "This is a refill of a previous order" }
          ],
          "__value__": [
            { "id": "has_prescription", "title": "I have a prescription for this" },
            { "id": "refill", "title": "This is a refill of a previous order" }
          ]
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "Pharmacy Order"
          },
          {
            "type": "TextInput",
            "name": "medication_name",
            "label": "Name of Medication",
            "required": true,
            "input-type": "text"
          },
          {
            "type": "TextInput",
            "name": "delivery_address",
            "label": "Delivery Address",
            "required": true,
            "input-type": "text"
          },
          {
            "type": "CheckboxGroup",
            "name": "prescription_status",
            "label": "Prescription Status",
            "data-source": "${data.status_options}"
          },
          {
            "type": "Footer",
            "label": "Place Order",
            "on-click-action": {
              "name": "complete",
              "payload": {
                "action": "order_drug",
                "medication": "${form.medication_name}",
                "address": "${form.delivery_address}",
                "status": "${form.prescription_status}"
              }
            }
          }
        ]
      }
    }
  ]
}
```

### 3. Order Lab Test Flow (`order_lab_test_flow`)
This flow allows patients to request lab tests to be done at home or at the clinic.

```json
{
  "version": "7.3",
  "routing_model": {
    "order_lab": []
  },
  "screens": [
    {
      "id": "order_lab",
      "title": "Order Lab Test",
      "terminal": true,
      "success": true,
      "data": {
        "test_options": {
          "type": "array",
          "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" } } },
          "__example__": [
            { "id": "blood_test", "title": "Blood Test (CBC, Malaria, etc.)" },
            { "id": "urinalysis", "title": "Urinalysis" },
            { "id": "std_panel", "title": "STD/STI Panel" },
            { "id": "other", "title": "Other / Doctor Recommended" }
          ],
          "__value__": [
            { "id": "blood_test", "title": "Blood Test (CBC, Malaria, etc.)" },
            { "id": "urinalysis", "title": "Urinalysis" },
            { "id": "std_panel", "title": "STD/STI Panel" },
            { "id": "other", "title": "Other / Doctor Recommended" }
          ]
        },
        "location_options": {
          "type": "array",
          "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" } } },
          "__example__": [
            { "id": "home_sample", "title": "Home Sample Collection" },
            { "id": "visit_clinic", "title": "Visit LexCare Clinic" }
          ],
          "__value__": [
            { "id": "home_sample", "title": "Home Sample Collection" },
            { "id": "visit_clinic", "title": "Visit LexCare Clinic" }
          ]
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "Lab Diagnostics"
          },
          {
            "type": "Dropdown",
            "name": "test_type",
            "label": "Select Test Category",
            "required": true,
            "data-source": "${data.test_options}"
          },
          {
            "type": "Dropdown",
            "name": "location_preference",
            "label": "Where do you want to take the test?",
            "required": true,
            "data-source": "${data.location_options}"
          },
          {
            "type": "Footer",
            "label": "Request Test",
            "on-click-action": {
              "name": "complete",
              "payload": {
                "action": "order_lab_test",
                "test": "${form.test_type}",
                "location": "${form.location_preference}"
              }
            }
          }
        ]
      }
    }
  ]
}
```

---

## Step 3: Publish the Flows and Get the IDs

Once you have pasted the JSON into the interactive builder for each flow:
1. Click **Save** and then **Publish**. 
2. *Note: Once a flow is published, it cannot be edited. You will need to clone it to make changes.*
3. After publishing, Meta will provide you with a **Flow ID** for each of the three flows.

---

## Step 4: Connecting the Flows to the Python Bot

In `lexcare-whatsapp-bot/app/utils/whatsapp_utils.py`, when a user selects a menu option, we currently reply with a text placeholder. 

To activate the Flows, you will replace those text placeholders by sending an **Interactive Flow Message** payload containing the `flow_id` and an `action`.

Example payload structure to trigger the published Flow:

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "<USER_PHONE_NUMBER>",
  "type": "interactive",
  "interactive": {
    "type": "flow",
    "header": {
      "type": "text",
      "text": "Book Consultation"
    },
    "body": {
      "text": "Please fill out the form to schedule your visit."
    },
    "footer": {
      "text": "LexCare"
    },
    "action": {
      "name": "flow",
      "parameters": {
        "flow_message_version": "3",
        "flow_token": "unique_session_token",
        "flow_id": "<YOUR_PUBLISHED_FLOW_ID>",
        "flow_cta": "Open Form",
        "flow_action": "navigate",
        "flow_action_payload": {
          "screen": "book_consultation"
        }
      }
    }
  }
}
```

When the user clicks "Submit Request" in the WhatsApp Form, Meta will send a Webhook payload back to your `process_whatsapp_message` function containing the JSON answers they provided!
