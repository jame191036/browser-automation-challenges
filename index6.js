const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://learn.manoonchai.com/'); // ไปที่ URL ที่ต้องการ

    const qwerty = `qwertyuiop[]\\asdfghjkl;'zxcvbnm,./`.split("");

    const key = ["ใ", "ต", "ห", "ล", "ส", "ป", "ั", "ก", "ิ", "บ", "็", "ฬ", "ฯ", "ง", "เ", "ร", "น", "ม", "อ", "า", "่", "้", "ว", "ื", "Shift", "ุ", "ไ", "ท", "ย", "จ", "ค", "ี", "ด", "ะ", "ู", "Shift"]
    const keyShift = ["ฒ", "ฏ", "ซ", "ญ", "ฟ", "ฉ", "ึ", "ธ", "ฐ", "ฎ", "ฆ", "ฑ", "ฌ", "ษ", "ถ", "แ", "ช", "พ", "ผ", "ำ", "ข", "โ", "ภ", "\"", "ฤ", "ฝ", "ๆ", "ณ", "๊", "๋", "์", "ศ", "ฮ", "?"]

    const arratOfText = await page.$$eval('.sentence-gap', elements =>
        elements.map(el => el.textContent.trim())
    );

    console.log('arratOfText', arratOfText);

    await page.locator('.input').click();

    for (const text of arratOfText) {
        console.log(text);
        for (const char of text) {
            console.log(char);
            let index = key.indexOf(char);
            // await delay(1000)

            if (index != -1) {
                console.log(index);
                await page.keyboard.type(qwerty[index]); // Simulates pressing "J"
            } else {  
                index = await keyShift.indexOf(char);
                await page.keyboard.down('Shift');
                await page.keyboard.press(qwerty[index]); // Simulates pressing "Shift + J" (capital J)
                await page.keyboard.up('Shift');
                // break;
            }
            // break;
        }
        // await delay(1000)
        await page.keyboard.press('Space');
        // break;
    }
}

openBrowser();