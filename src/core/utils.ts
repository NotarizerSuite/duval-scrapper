import { request } from "./api";
import fs from "node:fs/promises";

export const processInButches = async (ids: number[], batchSize: number, resultFileName: string): Promise<void> => {
    let count = 0;
    let firstBatch = true;  // To track if it's the first batch to handle the comma correctly

    while (ids.length > 0) {
        try {
            const batch = ids.splice(0, batchSize);
            const responses = await Promise.all(batch.map((id) => request(id)));

            for (const res of responses) {
                switch (res) {
                    case "an error occured": // Retry batch
                        // ids = batch.concat(ids); // Retry the batch
                        console.log(`Retrying batch ${count} due to an error`);
                        break;
                    case "stop": // Stop condition
                        console.log('Stop condition met, terminating process.');
                        return;
                    default:
                        // Write the result
                        if (!firstBatch) {
                            await fs.appendFile(resultFileName, ',', 'utf8'); // Add a comma if it's not the first result
                        }
                        await fs.appendFile(resultFileName, `\n${res}`, 'utf8');
                        firstBatch = false;  // After the first batch, we no longer add commas before the results
                        break;
                }
            }

            count += 1;
            console.log(`Processed batch ${count}`);
        } catch (e) {
            console.error(`Error processing batch ${count}. Error: ${e}`);
        }
    }

    // Close the JSON array by writing the closing bracket at the end
    console.log('Finished writing all results.');
};
