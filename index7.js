const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-towers-6d3a20be/'); // ไปที่ URL ที่ต้องการ

    await page.waitForSelector('.chakra-button.css-jut409'); // More specific selector
    const button = await page.$('.chakra-button.css-jut409');

    if (button) {
        await button.click();
        
        let k = 0;
        while (k < 24) {
            const selector = 'div[style="display: flex; gap: 4px;"] > div';
            // const elementNumbers = await page.$$(selector);

            try {
                await page.waitForSelector(selector, { visible: true, timeout: 500 }); // Timeout after 5 seconds
            } catch (error) {
                console.log('Selector not found in time, ending loop');
                break; // End loop if timeout is reached or selector is not found
            }

            const textArray = await page.evaluate((selector) => {
                return Array.from(document.querySelectorAll(selector))
                    .map(el => parseInt(el.textContent.trim(), 10))
                    .filter(num => !isNaN(num)); // Remove NaN values if any
            }, selector);

            let indexNumberMove = k;
            for (let i = k; i < textArray.length; i++) {
                for (let j = k; j < textArray.length; j++) {
                    if (i <= j) {
                        if (textArray[indexNumberMove] > textArray[j]) {
                            indexNumberMove = j;
                        }
                    }
                    // const element = array[j];
                }

                // console.log('index[i]', i);
                // console.log('index[j]', indexNumberMove);

                // console.log('textArray[i]', textArray[i]);
                // console.log('textArray[j]', textArray[indexNumberMove]);E
            }

            const elementNumbers = await page.$$(selector);
            const sourceBox = await elementNumbers[indexNumberMove].boundingBox();
            const targetBox = await elementNumbers[k].boundingBox();

            // await delay(3000);
            if (sourceBox && targetBox) {
                await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
                await page.mouse.down(); // Start dragging
                await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2 + 10);
                await page.mouse.up(); // Drop
            }

            k++;
        }

    } else {
        console.log('Button not found!');
    }
}

openBrowser();