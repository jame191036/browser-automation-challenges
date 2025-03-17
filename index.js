const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-hunting-fed83d58/'); // ไปที่ URL ที่ต้องการ

    await page.waitForSelector('.chakra-button.css-jut409'); // More specific selector
    const button = await page.$('.chakra-button.css-jut409');

    if (button) {
        // Do something with the button (e.g., click it, get text, etc.)
        const buttonText = await button.evaluate(el => el.textContent);

        await button.click(); // Example: Click the button

        await page.waitForSelector('div.css-1bfe2ax'); // More specific selector
        let values = await page.$$eval('div.css-1bfe2ax > span.chakra-badge.css-n2903v', spans => {
            return spans.map(span => span.textContent);
        });

        const selector = 'div[style="display: grid; grid-template-columns: repeat(8, 32px); gap: 4px;"] > div[style="width: 32px; height: 32px; opacity: 1;"]';

        await page.waitForSelector(selector, { visible: true }); // Wait for visibility

        const elementHandles = await page.$$(selector);

        let num = 0;
        for (const element of elementHandles) {
            await element.hover();  // Hover over the element
            const lastDivText = await page.evaluate(() => {
                const bodyChildren = document.body.children;
                return bodyChildren[bodyChildren.length - 1].textContent.trim();
            })

            for (let index = 0; index < values.length; index++) {
                if (lastDivText == values[index]) {
                    element.click();
                    values = values.filter(item => item !== lastDivText);
                    num++;
                    break;
                }
            }
            await delay(20); 

            if (num === 5) {
                console.log("Breaking at 5!");
                break;  // Exits the loop when number is 5
            }
        }
       
    } else {
        console.log('Button not found!');
    }
    // await delay(5000); 
    // await browser.close(); // ปิด browser (ถ้าต้องการ)
}

openBrowser();