const puppeteer = require('puppeteer');

async function openBrowser() {
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await page.goto('https://lemon-meadow-0c732f100.5.azurestaticapps.net/ssg'); // ไปที่ URL ที่ต้องการ
    
    const zero = [0, 1, 2, 4, 5, 6];
    const one = [2, 5];
    const two = [0, 2, 3, 4, 6];
    const three = [0, 2, 3, 5, 6];
    const four = [1, 2, 3, 5];
    const five = [0, 1, 3, 5, 6];
    const six = [0, 1, 3, 4, 5, 6];
    const seven = [0, 2, 5];
    const eight = [0, 1, 2, 3, 4, 5, 6];
    const nine = [0, 1, 2, 3, 5, 6];

    const selectorNumber = 'div.number.svelte-pqiwpi';

    await page.waitForSelector(selectorNumber, { visible: true }); // More specific selector

    const numberText = await page.evaluate((selectorNumber) => {
        const element = document.querySelector(selectorNumber);
        return element ? element.textContent.trim() : "";
    }, selectorNumber);

    // console.log(numberText);

    const numberArray = numberText.split(''); // Split each character as an array
    // console.log('Split number into array:', numberArray);


    const selector = 'div.display-container.svelte-jineh9 > div.seven-segment.svelte-jineh9.interactive';

    await page.waitForSelector(selector, { visible: true }); // Wait for visibility
    const elements = await page.$$(selector);
    // console.log('elementHandles:', elementHandles);

    for (let index = 0; index < numberArray.length; index++) {
        const numPad = await elements[index].$$('div')

        switch (numberArray[index]) {
            case '0':
                for (const element of zero) {
                    numPad[element].click();
                }
                break;
            case '1':
                for (const element of one) {
                    numPad[element].click();
                }
                break;
            case '2':
                for (const element of two) {
                    numPad[element].click();
                }
                break;
            case '3':
                for (const element of three) {
                    numPad[element].click();
                }
                break;
            case '4':
                for (const element of four) {
                    numPad[element].click();
                }
                break;
            case '5':
                for (const element of five) {
                    numPad[element].click();
                }
                break;
            case '6':
                for (const element of six) {
                    numPad[element].click();
                }
                break;
            case '7':
                for (const element of seven) {
                    numPad[element].click();
                }
                break;
            case '8':
                for (const element of eight) {
                    numPad[element].click();
                }
                break;
            case '9':
                for (const element of nine) {
                    numPad[element].click();
                }
                break;
            default:
            // code block
        }
        // await delay(100); 
    }

    await page.evaluate(async () => {
        const distance = 100; // Scroll distance in pixels
        const delay = 100; // Delay in milliseconds

        while (document.documentElement.scrollHeight > document.documentElement.scrollTop + window.innerHeight) {
            window.scrollBy(0, distance);
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the scroll
        }
    });
}

openBrowser();