import { processInButches } from "./core/utils";
import fs from "node:fs/promises";

const main = async () => {
    const hardMax = 1.5 * Math.pow(10, 7); // Adjust this if needed
    const ids: number[] = Array.from({ length: hardMax }, (_, i) => i);
    const resultFileName = "result.json";

    try {
        // Start by writing an opening bracket to indicate a valid JSON array
        await fs.writeFile(resultFileName, '[', 'utf8');
        console.log("File initialized with opening bracket.");

        // Call the processInButches function and pass the file name
        await processInButches(ids, 1000, resultFileName);

        // Close the JSON array by writing the closing bracket at the end
        await fs.appendFile(resultFileName, '\n]', 'utf8');
        console.log('Finished writing all results.');

    } catch (err) {
        console.error(`Error processing batches or writing to file: ${err}`);
    }
};

main();
