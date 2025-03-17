const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-buttons-a9808c5e/'); // ไปที่ URL ที่ต้องการ

    await page.waitForSelector('.chakra-button.css-jut409'); // More specific selector
    const button = await page.$('.chakra-button.css-jut409');

    if (button) {
        await button.click();

        await page.waitForSelector('div.css-1lpl3tc', { visible: true }); // More specific selector
        const selectorButtonNumber = 'div.css-1lpl3tc > div.css-0';
        const elementButtonNumber = await page.$$(selectorButtonNumber);

        const zero = elementButtonNumber[9];
        const one = elementButtonNumber[6];
        const two = elementButtonNumber[7];
        const three = elementButtonNumber[8];
        const fout = elementButtonNumber[3];
        const five = elementButtonNumber[4];
        const six = elementButtonNumber[5];
        const seven = elementButtonNumber[0];
        const eight = elementButtonNumber[1];
        const nine = elementButtonNumber[2];


        let i = 0;
        while (i < 100) {
            i++;

            await page.waitForSelector('div.css-0 p.chakra-text.css-157wn8n', { visible: true }); // More specific selector
            const textHeader = await page.$eval('div.css-0 p.chakra-text.css-157wn8n', el => el.textContent.trim());

            const numberArray = textHeader.split(" ");
            // Convert the numbers from string to integer
            const number1 = parseInt(numberArray[0].replace(/,/g, '') || 0);
            const operations = numberArray[1];
            const number2 = parseInt(numberArray[2].replace(/,/g, '') || 0);

            console.log('number1', number1);
            console.log('operations', operations);
            console.log('number2', number2);
            console.log('numberArray', numberArray);

            // Perform the sum
            let sum;

            switch (operations) {
                case '+':
                    sum = number1 + number2;
                    break;
                case '-':
                    sum = number1 - number2;
                    break;
                case '×':
                    sum = number1 * number2;
                    break;
                case '÷':
                    sum = number1 / number2;
                    break;
                default:
                    console.error("Invalid operation:", operations);
                    sum = null; // Or handle it differently
            }

            const digits = String(sum).split('').map(Number);

            console.log('sum', sum);
            console.log('digits', digits);

            for (const digit of digits) {
                // console.log(digit);
                switch (digit) {
                    case 0:
                        await zero.click();
                        break;
                    case 1:
                        await one.click();
                        break;
                    case 2:
                        await two.click();
                        break;
                    case 3:
                        await three.click();
                        break;
                    case 4:
                        await fout.click();
                        break;
                    case 5:
                        await five.click();
                        break;
                    case 6:
                        await six.click();
                        break;
                    case 7:
                        await seven.click();
                        break;
                    case 8:
                        await eight.click();
                        break;
                    case 9:
                        await nine.click();
                        break;
                    default:
                    // code block
                }
            }

            // await delay(1000);
            await page.waitForSelector('div.css-tuh9u2', { visible: true }); // Wait for the parent div to be visible
            const selectorButtonSubmit = 'div.css-tuh9u2 button.chakra-button.css-t1xvau';

            // Get the button element and click it
            const elementButtonSubmit = await page.$(selectorButtonSubmit);  // Use $() to get the element handle
            if (elementButtonSubmit) {
                await elementButtonSubmit.click();  // Click the button
                console.log('Button clicked!');
            } else {
                console.log('Button not found.');
            }

            console.log('i', i);

        }
    } else {
        console.log('Button not found!');
    }
}

openBrowser();