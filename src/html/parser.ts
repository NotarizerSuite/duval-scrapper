import * as cheerio from 'cheerio';
import fs from 'fs';
//@ts-ignore
import JSONStream from 'JSONStream';
import es from 'event-stream';
import { MongoClient, Db } from 'mongodb';
import { HtmlResult, ParsedResult } from './parser.types';

// Function to parse HTML content and extract data
const parseHtmlToJson = (html: string): ParsedResult => {
    const $ = cheerio.load(html);
    const result: ParsedResult = {
        caseNumber: null,
        caseStatus: null,
        parties: [],
        charges: [],
        citations: [],
        courtEvents: [],
        dockets: [],
    };

    try {
        result.caseNumber = $('#c_CaseNumberLabel').text().trim() || null;
        result.caseStatus = $('.caseDisplayTable.caseSummary tr')
            .filter((_, el) => $(el).text().includes('Case Status'))
            .find('td:last-child')
            .text()
            .trim() || null;

        $('#c_PartiesPanel tbody tr').each((_, el) => {
            const name = $(el).find('td:first-child span').first().text().trim() || null;
            const dobMatch = $(el).find('td:first-child').text().match(/DOB:\s*([\d/]+)/);
            const dob = dobMatch ? dobMatch[1] : null;
            const partyType = $(el).find('td:nth-child(2)').text().trim() || null;
            const address = $(el).find('td:nth-child(3) address').text().trim() || null;

            result.parties.push({ name, dob, partyType, address });
        });

        $('#c_ChargesPanel tbody tr').each((_, el) => {
            const statute = $(el).find('.caseDetailCell').first().text().trim() || null;
            const description = $(el).find('.chargeDescription').text().trim() || null;

            result.charges.push({ statute, description });
        });

        $('#c_CitationsPanel tbody tr').each((_, el) => {
            const citationNumber = $(el).find('td:first-child').text().trim() || null;
            const officer = $(el).find('td:nth-child(2)').text().trim() || null;
            const statute = $(el).find('td:nth-child(3)').text().trim() || null;
            const description = $(el).find('td:nth-child(4)').text().trim() || null;

            result.citations.push({ citationNumber, officer, statute, description });
        });

        $('#c_CourtEventsPanel tbody tr').each((_, el) => {
            const date = $(el).find('td:nth-child(1)').text().trim() || null;
            const time = $(el).find('td:nth-child(2)').text().trim() || null;
            const type = $(el).find('td:nth-child(3)').text().trim() || null;
            const location = $(el).find('td:nth-child(4)').text().trim() || null;
            const courtroom = $(el).find('td:nth-child(5)').text().trim() || null;

            result.courtEvents.push({ date, time, type, location, courtroom });
        });

        $('#c_DocketsPanel tbody tr').each((_, el) => {
            const effectiveDate = $(el).find('td:nth-child(3)').text().trim() || null;
            const description = $(el).find('td:nth-child(4)').text().trim() || null;

            result.dockets.push({ effectiveDate, description });
        });

    } catch (error) {
        // console.error('Error parsing HTML:', error);
        result.error = 'An error occurred while parsing the HTML.';
    }

    return result;
};

// Function to process each JSON object and insert into MongoDB
const processJsonObject = async (obj: HtmlResult, db?: Db) => {
    if (obj.d && obj.d.BodyHtml) {
        try {
            const parsedData = parseHtmlToJson(obj.d.BodyHtml);
            await db?.collection('duvalCases').insertOne(parsedData);
        } catch (error) {
            console.error('Error inserting data into MongoDB:', error);
        }
    } else {
       return;
    }
};

// Stream read the large JSON file and process each object
export const processJsonFile = async (path: string, db?: Db) => {
    try {
        fs.createReadStream(path, { encoding: 'utf-8' })
            .pipe(JSONStream.parse('*'))
            .pipe(es.mapSync(async (data: HtmlResult) => {
                await processJsonObject(data, db);
            }))
            .on('error', (err: Error) => {
                console.error('Error reading or processing file:', err);
            })
            .on('end', () => {
                console.log('File processing completed');
            });
    } catch (error) {
        console.error('Error processing JSON file:', error);
    }
};