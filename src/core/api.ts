import axios from "axios";

export const request = async (id: number) => {
    let data = `{"token":"00000000-0000-0000-0000-000000000000","returnTabId":5,"caseID":${id},"simCtrl":0}`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://core.duvalclerk.com/internal/CoreWebSvc.asmx/GetCaseById',
        headers: { 
            'accept': '*/*', 
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,he;q=0.7,ru;q=0.6', 
            'content-type': 'application/json; charset=UTF-8', 
            'cookie': '_ga=GA1.1.339767321.1737274902; _ga_E4579F79E4=GS1.1.1737331589.2.1.1737331609.0.0.0; ASP.NET_SessionId=wcbw5y10z2mg5jenkby41o3k; CoreAffinity=8df302d4bb23dd97afeab2fef60534d03c5900df85a3ffc36ddb9df3f50c9c2a; displayName=Public%20Access; accessType=Public%20Access; token=00000000-0000-0000-0000-000000000000; loginTime=Tue%20Jan%2021%202025%2023%3A14%3A10%20GMT+0200%20%28Israel%20Standard%20Time%29', 
            'origin': 'https://core.duvalclerk.com', 
            'priority': 'u=1, i', 
            'referer': 'https://core.duvalclerk.com/CoreCms.aspx?mode=PublicAccess', 
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"Windows"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 
            'x-requested-with': 'XMLHttpRequest'
          },
          data : data
    };

    try {
        const res = await axios.request(config);
        const headerText: string = res.data["HeaderText"];
        
        if (headerText === "Case not found/denied") {
            return "stop";
        } 
        
        return JSON.stringify(res.data);
    } catch (error) {
        console.warn(error);
    }

    return "an error occured";
}
