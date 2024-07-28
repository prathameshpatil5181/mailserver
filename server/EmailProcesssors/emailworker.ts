// worker.js
import { parentPort, workerData } from 'worker_threads';
import { simpleParser } from 'mailparser';
import fs from 'fs';
import { logger } from '..';

const handleEmailData = async (data:any) => {
    try {
        const parsed = await simpleParser(data);
        const jsonParsed = parsed.toString();
        fs.writeFileSync('/content.txt', jsonParsed);
        return 'Email processed successfully';
    } catch (error) {
        console.error('Error processing email:', error);
        throw error;
    }
};

// Process the email data in the worker thread
handleEmailData(workerData)
    .then((result) => {
        parentPort?.postMessage(result);
    })
    .catch((error) => {
        parentPort?.postMessage({ error: error.message });
    });
