import { fetcher, requestBody } from "./fetcher.ts";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <div>
      <h1>Pipe0 Basic Script</h1>
      <p>Click the button below to submit an enrichment request (test data).</p>
      <button id="enrichButton" type="button">Enrich with fake data</button>
    </div>
    <div  style="text-align: left; margin-top: 2em;">
      <h2>Request Body</h2>
      <pre style="background: #1a1a1a; padding: 1em; border-radius: 8px; color: white;">
${JSON.stringify(requestBody, null, 2)}
      </pre>
    </div>
    
    <div id="resultContainer" style="display: none; text-align: left; margin-top: 2em;">
      <h2>Enrichment Results (Fake Data)</h2>
      <pre id="valuesOutput" style="background: #1a1a1a; padding: 1em; border-radius: 8px; color: white;"></pre>
      <button id="toggleRaw" type="button">Show Raw Response</button>
      <pre id="rawOutput" style="display: none; background: #1a1a1a; padding: 1em; border-radius: 8px; color: white;"></pre>
    </div>
    <div style="margin-top: 2em;">
      <p>Check out <a href="https://docs.pipe0.com" target="_blank">the repo</a> for this example or explore the <a href="https://docs.pipe0.com" target="_blank">Pipe0 docs</a>.</p>
    </div>
  </div>
`;

const enrichButton =
  document.querySelector<HTMLButtonElement>("#enrichButton")!;
const resultContainer =
  document.querySelector<HTMLDivElement>("#resultContainer")!;
const valuesOutput = document.querySelector<HTMLPreElement>("#valuesOutput")!;
const rawOutput = document.querySelector<HTMLPreElement>("#rawOutput")!;
const toggleRawButton =
  document.querySelector<HTMLButtonElement>("#toggleRaw")!;

let isRawVisible = false;

enrichButton.addEventListener("click", async () => {
  enrichButton.disabled = true;
  enrichButton.textContent = "Processing...";

  try {
    const result = await fetcher();
    if (!result) {
      valuesOutput.textContent = "No data returned from the request.";
      resultContainer.style.display = "block";
      return;
    }

    const { values, rawResponse } = result;

    // Display processed values
    valuesOutput.textContent = JSON.stringify(values, null, 2);
    resultContainer.style.display = "block";

    // Store raw response for toggling
    rawOutput.textContent = JSON.stringify(rawResponse, null, 2);
  } catch (error) {
    valuesOutput.textContent = `Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    resultContainer.style.display = "block";
  } finally {
    enrichButton.disabled = false;
    enrichButton.textContent = "Enrich data";
  }
});

toggleRawButton.addEventListener("click", () => {
  isRawVisible = !isRawVisible;
  rawOutput.style.display = isRawVisible ? "block" : "none";
  toggleRawButton.textContent = isRawVisible
    ? "Hide Raw Response"
    : "Show Raw Response";
});
