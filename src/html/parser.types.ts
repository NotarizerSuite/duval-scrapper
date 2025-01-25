export interface HtmlResult {
    d: {
        BodyHtml: string;
        __type: string;
        TargetTabId: number;
        HeaderText: string;
        LoginOk: boolean;
        CaptchaChallenge: string | null;
    }
}

export interface ParsedResult {
    caseNumber: string | null;
    caseStatus: string | null;
    parties: Party[];
    charges: Charge[];
    citations: Citation[];
    courtEvents: CourtEvent[];
    dockets: Docket[];
    error?: string;
}

export interface Party {
    name: string | null;
    dob: string | null;
    partyType: string | null;
    address: string | null;
}

export interface Charge {
    statute: string | null;
    description: string | null;
}

export interface Citation {
    citationNumber: string | null;
    officer: string | null;
    statute: string | null;
    description: string | null;
}

export interface CourtEvent {
    date: string | null;
    time: string | null;
    type: string | null;
    location: string | null;
    courtroom: string | null;
}

export interface Docket {
    effectiveDate: string | null;
    description: string | null;
}